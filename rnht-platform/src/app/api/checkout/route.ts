import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";
import { getServiceSupabase } from "@/lib/supabase";

interface FamilyMember {
  name: string;
  gotra?: string;
  nakshatra?: string;
  relationship?: string;
}

interface CheckoutItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  bookingDate: string;
  bookingTime: string;
  devoteeName: string;
  devoteeEmail: string;
  devoteePhone?: string;
  gotra?: string;
  nakshatra?: string;
  rashi?: string;
  specialInstructions?: string;
  familyMembers?: FamilyMember[];
  userId?: string;
}

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CheckoutItem[] };

    if (!items?.length) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Insert booking rows with all devotee info
    const bookingRows = items.map((item) => ({
      user_id: item.userId || null,
      service_id: item.serviceId,
      booking_date: item.bookingDate,
      booking_time: item.bookingTime,
      devotee_name: item.devoteeName,
      devotee_email: item.devoteeEmail,
      devotee_phone: item.devoteePhone || null,
      gotra: item.gotra || null,
      nakshatra: item.nakshatra || null,
      rashi: item.rashi || null,
      special_instructions: item.specialInstructions || null,
      family_members: item.familyMembers || null,
      total_amount: item.price * item.quantity,
      payment_status: "pending",
      status: "pending",
    }));

    const { data: bookings, error: dbError } = await supabase
      .from("bookings")
      .insert(bookingRows)
      .select("id");

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to create bookings" },
        { status: 500 }
      );
    }

    const bookingIds = bookings.map((b: { id: string }) => b.id);

    // Create Stripe Checkout Session
    const session = await getStripeServer().checkout.sessions.create({
      mode: "payment",
      customer_email: items[0].devoteeEmail,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.serviceName },
        },
        quantity: item.quantity,
      })),
      metadata: {
        type: "booking",
        booking_ids: JSON.stringify(bookingIds),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
