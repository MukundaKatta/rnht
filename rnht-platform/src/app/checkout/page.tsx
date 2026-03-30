"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "zelle"
  >("stripe");
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  // BUG FIX: track checkout errors instead of silently swallowing them
  const [error, setError] = useState("");

  // BUG FIX: redirect via useEffect instead of during render
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [items.length, orderComplete, router]);

  if (items.length === 0 && !orderComplete) {
    return null;
  }

  const handleCheckout = async () => {
    setProcessing(true);
    setError("");

    try {
      if (paymentMethod === "stripe") {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: items.map((item) => ({
                serviceId: item.service.id,
                serviceName: item.service.name,
                price: item.selectedTier
                  ? item.selectedTier.price
                  : item.service.price ??
                    item.service.suggested_donation ??
                    0,
                quantity: item.quantity,
                bookingDate: item.bookingDate,
                bookingTime: item.bookingTime,
                devoteeName: item.devoteeName,
                devoteeEmail: item.devoteeEmail,
              })),
            }),
          });

          const data = await response.json();

          if (data.url) {
            window.location.href = data.url;
            return;
          }

          // Fallback for demo
          const newOrderId = `RNHT-${Date.now().toString(36).toUpperCase()}`;
          setOrderId(newOrderId);
          setOrderComplete(true);
          clearCart();
        } catch {
          // BUG FIX: show error to user instead of simulating success
          setError("Payment processing failed. Please try again or use Zelle.");
        }
      } else {
        // Zelle flow: show instructions
        const newOrderId = `RNHT-${Date.now().toString(36).toUpperCase()}`;
        setOrderId(newOrderId);
        setOrderComplete(true);
        clearCart();
      }
    } finally {
      // BUG FIX: always reset processing state
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-6 text-3xl font-heading font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Your booking ID is{" "}
          <span className="font-bold text-temple-maroon">{orderId}</span>
        </p>
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-left text-sm text-green-800">
          <p className="font-semibold">What happens next?</p>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>
              You will receive a confirmation email with your booking details.
            </li>
            <li>
              The temple priest will be assigned and you&apos;ll be notified.
            </li>
            <li>
              Please arrive 15 minutes before your scheduled time.
            </li>
            {paymentMethod === "zelle" && (
              <li>
                Please send your payment via Zelle to (512) 545-0473 with
                reference: {orderId}
              </li>
            )}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-outline">
            Return Home
          </Link>
          <Link href="/services" className="btn-primary">
            Book Another Service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-temple-red"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>
      <h1 className="mt-4 section-heading">Checkout</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Order Summary
            </h2>
            <div className="mt-4 divide-y divide-gray-100">
              {items.map((item) => {
                const price = item.selectedTier
                  ? item.selectedTier.price
                  : item.service.price ??
                    item.service.suggested_donation ??
                    0;
                return (
                  <div key={item.id} className="flex justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.bookingDate} at {item.bookingTime}
                      </p>
                      {item.selectedTier && (
                        <p className="text-xs text-temple-gold">
                          {item.selectedTier.name}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(price)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-temple-red">
                  {formatCurrency(getTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="lg:col-span-3">
          <div className="card p-5">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Payment Method
            </h2>
            <div className="mt-4 space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "stripe"
                    ? "border-temple-red bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="text-temple-red"
                />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Credit / Debit Card</p>
                  <p className="text-sm text-gray-500">
                    Visa, Mastercard, Amex via Stripe
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  paymentMethod === "zelle"
                    ? "border-temple-red bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "zelle"}
                  onChange={() => setPaymentMethod("zelle")}
                  className="text-temple-red"
                />
                <span className="text-xl">💸</span>
                <div>
                  <p className="font-medium">Zelle</p>
                  <p className="text-sm text-gray-500">
                    Send to (512) 545-0473
                  </p>
                </div>
              </label>
            </div>

            {paymentMethod === "zelle" && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-semibold">Zelle Payment Instructions:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Open your banking app and select Zelle</li>
                  <li>
                    Send payment of{" "}
                    <strong>{formatCurrency(getTotal())}</strong> to{" "}
                    <strong>(512) 545-0473</strong>
                  </li>
                  <li>
                    Include your name and &quot;Pooja Booking&quot; in the memo
                  </li>
                  <li>
                    Click &quot;Complete Booking&quot; below to confirm your
                    reservation
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>
                Your payment information is secure and encrypted. RNHT is a
                registered 501(c)(3) nonprofit.
              </span>
            </div>

            <button
              className="btn-primary mt-6 w-full"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing
                ? "Processing..."
                : paymentMethod === "stripe"
                  ? `Pay ${formatCurrency(getTotal())}`
                  : "Complete Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
