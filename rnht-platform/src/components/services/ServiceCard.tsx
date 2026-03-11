"use client";

import { useState } from "react";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import type { Service } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { ServiceDetailModal } from "./ServiceDetailModal";

const categoryIcons: Record<string, string> = {
  "cat-homam": "🔥",
  "cat-pooja": "🙏",
  "cat-wedding": "💒",
  "cat-paaraayana": "📿",
  "cat-jyotisham": "⭐",
  "cat-sharadham": "🪔",
};

export function ServiceCard({ service }: { service: Service }) {
  const [showModal, setShowModal] = useState(false);

  const locationLabel =
    service.location_type === "at_temple"
      ? "At Temple"
      : service.location_type === "outside_temple"
        ? "Outside Temple"
        : "At Temple / Outside";

  const priceDisplay = () => {
    switch (service.price_type) {
      case "fixed":
        return formatCurrency(service.price!);
      case "tiered":
        if (service.price_tiers && service.price_tiers.length > 0) {
          return `From ${formatCurrency(service.price_tiers[0].price)}`;
        }
        return "Contact for pricing";
      case "donation":
        return service.suggested_donation
          ? `Suggested: ${formatCurrency(service.suggested_donation)}`
          : "Donation based";
      case "custom":
        return "Contact for Pricing";
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste! I would like to inquire about ${service.name}. Please share the details and availability.`
  );

  const icon = categoryIcons[service.category_id] || "🙏";

  return (
    <>
      <div
        className="card cursor-pointer overflow-hidden group"
        onClick={() => setShowModal(true)}
      >
        <div className="h-36 bg-gradient-to-br from-temple-cream to-temple-gold/20 flex items-center justify-center relative">
          <span className="text-5xl opacity-60 transition-transform group-hover:scale-110">{icon}</span>
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600 backdrop-blur">
              {locationLabel}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-gray-900 leading-tight">
            {service.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {service.short_description}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {service.duration_minutes} min
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-bold text-temple-red">
              {priceDisplay()}
            </span>
            <div className="flex gap-1.5">
              <a
                href={`https://wa.me/15125450473?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Book ${service.name} via WhatsApp`}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <button
                className="rounded-lg bg-temple-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-temple-red-dark transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ServiceDetailModal
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
