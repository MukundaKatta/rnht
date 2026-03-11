"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-300" />
        <h1 className="mt-4 text-2xl font-heading font-bold text-gray-900">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our services and add poojas to your cart.
        </p>
        <Link href="/services" className="btn-primary mt-8 inline-flex">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="section-heading">Your Cart</h1>
      <p className="mt-2 text-gray-600">
        {items.length} service{items.length !== 1 ? "s" : ""} in your cart
      </p>

      <div className="mt-8 space-y-4">
        {items.map((item) => {
          const price = item.selectedTier
            ? item.selectedTier.price
            : item.service.price ??
              item.service.suggested_donation ??
              0;

          return (
            <div
              key={item.id}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
            >
              <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-temple-cream to-temple-gold/20 flex items-center justify-center">
                <span className="text-3xl opacity-60">🙏</span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-gray-900">
                  {item.service.name}
                </h3>
                {item.selectedTier && (
                  <span className="mt-1 inline-block rounded-full bg-temple-cream px-3 py-0.5 text-xs font-medium text-temple-maroon">
                    {item.selectedTier.name}
                  </span>
                )}
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <strong>Date:</strong> {item.bookingDate} at{" "}
                    {item.bookingTime}
                  </p>
                  <p>
                    <strong>Devotee:</strong> {item.devoteeName}
                  </p>
                  {item.gotra && (
                    <p>
                      <strong>Gotra:</strong> {item.gotra}
                    </p>
                  )}
                  {item.familyMembers.length > 0 && (
                    <p>
                      <strong>Family Members:</strong>{" "}
                      {item.familyMembers
                        .map((m) => m.name)
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <span className="text-lg font-bold text-temple-red">
                  {formatCurrency(price)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-temple-red">
            {formatCurrency(getTotal())}
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/services"
            className="btn-outline flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Browsing
          </Link>
          <Link
            href="/checkout"
            className="btn-primary flex items-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
