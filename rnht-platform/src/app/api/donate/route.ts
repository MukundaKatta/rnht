import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";
import { getServiceSupabase } from "@/lib/supabase";
import type Stripe from "stripe";

interface DonateRequest {
  amount: number;
  fundType: string;
  donorName: string;
  donorEmail: string;
  message?: string;
  isAnonymous?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: "monthly" | "quarterly" | "annual";
}

const fundLabels: Record<string, string> = {
  general: "General Temple Fund",
  building: "Building Fund",
  priest: "Priest Fund",
  annadanam: "Annadanam Fund",
  festival: "Festival Fund",
  education: "Education Fund",
  "rudra-narayana": "Sri Rudra Narayana Seva",
  ganesha: "Lord Ganesha Seva",
  lakshmi: "Goddess Lakshmi Seva",
  hanuman: "Lord Hanuman Seva",
  shiva: "Lord Shiva Seva",
  rama: "Lord Rama Seva",
};

function mapFrequency(freq: string): Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring {
  switch (freq) {
    case "quarterly":
      return { interval: "month", interval_count: 3 };
    case "annual":
      return { interval: "year" };
    default:
      return { interval: "month" };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DonateRequest;
    const { amount, fundType, donorName, donorEmail, message, isAnonymous, isRecurring, recurringFrequency } = body;

    if (!amount || amount <= 0 || !donorName || !donorEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Insert donation record
    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .insert({
        donor_name: donorName,
        donor_email: donorEmail,
        amount,
        fund_type: fundType,
        payment_method: "stripe",
        payment_status: "pending",
        is_recurring: isRecurring || false,
        message: message || null,
        is_anonymous: isAnonymous || false,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to create donation record" },
        { status: 500 }
      );
    }

    const label = fundLabels[fundType] || "Donation";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: donorEmail,
      metadata: {
        type: "donation",
        donation_id: donation.id,
      },
      success_url: `${appUrl}/donate?success=true`,
      cancel_url: `${appUrl}/donate`,
    };

    if (isRecurring && recurringFrequency) {
      sessionParams.mode = "subscription";
      sessionParams.line_items = [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: { name: `${label} (Recurring)` },
            recurring: mapFrequency(recurringFrequency),
          },
          quantity: 1,
        },
      ];
    } else {
      sessionParams.mode = "payment";
      sessionParams.line_items = [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amount * 100),
            product_data: { name: label },
          },
          quantity: 1,
        },
      ];
    }

    const session = await getStripeServer().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Donate error:", err);
    return NextResponse.json(
      { error: "Failed to create donation session" },
      { status: 500 }
    );
  }
}
