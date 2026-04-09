import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal-server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { orderId } = (await request.json()) as { orderId: string };

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const result = await capturePayPalOrder(orderId);

    if (result.status === "COMPLETED" && result.donationId) {
      const supabase = getServiceSupabase();
      const { error } = await supabase
        .from("donations")
        .update({ payment_status: "completed" })
        .eq("id", result.donationId);

      if (error) console.error("Failed to update donation:", error);
    }

    return NextResponse.json({ status: result.status });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: "Failed to capture PayPal payment" },
      { status: 500 }
    );
  }
}
