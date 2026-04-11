import { getServiceSupabase } from "@/lib/supabase";

/**
 * Tax-receipt summary email at the $750/year threshold.
 *
 * Wiring: call `checkAndSendReceipt(userId)` from the webhook that marks
 * a donation `completed` (Stripe + PayPal). The function:
 *   1. Sums the current calendar year's completed donations for the user
 *   2. If the total is >= $750 AND at least one donation hasn't been
 *      marked `tax_receipt_sent = true`, sends them a summary email
 *   3. Marks every included donation `tax_receipt_sent = true`
 *
 * The actual email transport is intentionally left pluggable. If the
 * project has a transactional email helper (e.g. Resend, SES), swap
 * `sendTaxSummaryEmail` below for a real implementation.
 */

export const TAX_RECEIPT_THRESHOLD_USD = 750;

type DonationRow = {
  id: string;
  amount: number;
  fund_type: string;
  created_at: string;
  tax_receipt_sent: boolean;
};

type UserSummary = {
  email: string;
  name: string | null;
};

type SummaryPayload = {
  user: UserSummary;
  year: number;
  total: number;
  donations: DonationRow[];
};

/**
 * Placeholder email sender. Replace with Resend/SES/etc. once chosen.
 * Currently logs the intended send so a human can manually fire one
 * while transport is being wired up.
 */
async function sendTaxSummaryEmail(payload: SummaryPayload): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("[tax-receipt] would send summary email:", {
    to: payload.user.email,
    subject: `Your ${payload.year} donation summary — Rudra Narayana Hindu Temple`,
    total: payload.total,
    count: payload.donations.length,
  });
}

export async function checkAndSendReceipt(userId: string): Promise<void> {
  const serviceClient = getServiceSupabase();
  if (!serviceClient) return;

  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01T00:00:00Z`;
  const yearEnd = `${year + 1}-01-01T00:00:00Z`;

  const { data: donations, error } = await serviceClient
    .from("donations")
    .select("id, amount, fund_type, created_at, tax_receipt_sent, donor_email, donor_name")
    .eq("user_id", userId)
    .eq("payment_status", "completed")
    .gte("created_at", yearStart)
    .lt("created_at", yearEnd);

  if (error || !donations || donations.length === 0) return;

  const total = donations.reduce(
    (sum, d) => sum + Number((d as { amount: number }).amount ?? 0),
    0
  );
  if (total < TAX_RECEIPT_THRESHOLD_USD) return;

  const anyUnsent = donations.some(
    (d) => !(d as { tax_receipt_sent: boolean }).tax_receipt_sent
  );
  if (!anyUnsent) return;

  const first = donations[0] as { donor_email: string; donor_name: string | null };
  await sendTaxSummaryEmail({
    user: { email: first.donor_email, name: first.donor_name },
    year,
    total,
    donations: donations as unknown as DonationRow[],
  });

  const ids = donations.map((d) => (d as { id: string }).id);
  await serviceClient
    .from("donations")
    .update({ tax_receipt_sent: true })
    .in("id", ids);
}
