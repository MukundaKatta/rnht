// Supabase Edge Function: delete-account
//
// Real in-app account deletion (Apple Guideline 5.1.1(v) / Google Play data
// deletion). The client sends the signed-in user's session token in
// x-user-token; we verify it server-side, then use the service role to delete
// the auth user. FK cascades on auth.users remove the profile and dependent
// rows; donations are retained for financial records but de-linked (user_id
// set null) so no personal account remains.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  try {
    const token = req.headers.get("x-user-token") ?? "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    // Verify the token and resolve the caller's own user id — a user can only
    // ever delete themselves.
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    const userId = userData?.user?.id;
    if (userErr || !userId) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    // The temple has very few admin accounts. Deleting the last one would lock
    // everybody out of donations, bookings and receipts with no way back, so
    // refuse and tell them to appoint another admin first.
    const { data: adminRows, error: adminErr } = await admin
      .from("profiles")
      .select("id")
      .eq("is_admin", true);
    if (adminErr) {
      console.error("delete-account admin count failed:", adminErr);
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
    const admins = (adminRows ?? []).map((r: { id: string }) => r.id);
    if (admins.includes(userId) && admins.length <= 1) {
      return new Response(
        JSON.stringify({
          error:
            "This is the temple's only administrator account, so it cannot be deleted. Make someone else an administrator first.",
        }),
        { status: 409, headers: jsonHeaders },
      );
    }

    // ORDER MATTERS. Everything destructive used to run BEFORE deleteUser, so a
    // failed deletion (an auth outage, a rate limit) left a LIVE account whose
    // giving history was already de-linked and whose booking details were
    // already overwritten: the devotee could still sign in, saw $0.00 donated,
    // and nothing ever put it back. Now the only work done before the point of
    // no return is a reversible stamp, and the PII wipe happens after the
    // account is actually gone.

    // Which bookings to anonymize. Read them now: the FK nulls user_id the
    // moment the auth user goes, and then they can no longer be found.
    const { data: bookingRows, error: bookingReadErr } = await admin
      .from("bookings")
      .select("id")
      .eq("user_id", userId);
    if (bookingReadErr) {
      console.error("delete-account booking read error:", bookingReadErr);
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
    const bookingIds = (bookingRows ?? []).map((b: { id: string }) => b.id);

    // Stamp the gifts this account is releasing. They stay for the temple's tax
    // records, but the stamp stops the 012 back-link trigger re-attaching them
    // to whoever next signs up with the same email address (migration 019).
    const { data: donationRows, error: donationReadErr } = await admin
      .from("donations")
      .select("id, custom_fields")
      .eq("user_id", userId);
    if (donationReadErr) {
      console.error("delete-account donation read error:", donationReadErr);
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
    for (const row of donationRows ?? []) {
      const cf =
        typeof row.custom_fields === "object" && row.custom_fields !== null && !Array.isArray(row.custom_fields)
          ? (row.custom_fields as Record<string, unknown>)
          : {};
      const { error: stampErr } = await admin
        .from("donations")
        .update({ custom_fields: { ...cf, account_deleted: true } })
        .eq("id", row.id);
      if (stampErr) {
        console.error("delete-account stamp error:", stampErr);
        return new Response(JSON.stringify({ error: "Failed to delete account" }), {
          status: 500,
          headers: jsonHeaders,
        });
      }
    }

    // Delete the auth user (cascades profile + user-owned rows via FK).
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      // Nothing destructive has happened yet: the account is intact and the
      // devotee can try again.
      console.error("delete-account error:", delErr);
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }
    // The account is gone. The FK has already nulled user_id on donations and
    // bookings; strip the booking PII that the FK does not touch. A failure
    // here is logged for follow-up but must NOT be reported as a failed
    // deletion: the account really was deleted.
    if (bookingIds.length > 0) {
      const { error: bookingErr } = await admin
        .from("bookings")
        .update({
          user_id: null,
          devotee_name: "Deleted user",
          devotee_email: "deleted@rnht.invalid",
          devotee_phone: null,
          gotra: null,
          nakshatra: null,
          rashi: null,
          special_instructions: null,
          family_members: null,
        })
        .in("id", bookingIds);
      if (bookingErr) {
        console.error(
          "delete-account: ACCOUNT DELETED BUT BOOKING PII REMAINS, needs manual cleanup",
          { bookingIds, error: bookingErr.message },
        );
      }
    }


    return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
  } catch (err) {
    console.error("delete-account exception:", err);
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
