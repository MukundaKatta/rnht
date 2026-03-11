"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import type { Service } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { ServiceDetailModal } from "./ServiceDetailModal";

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
        return "Contact for Quote";
    }
  };

  return (
    <>
      <div
        className="card cursor-pointer overflow-hidden"
        onClick={() => setShowModal(true)}
      >
        <div className="h-40 bg-gradient-to-br from-temple-cream to-temple-gold/20 flex items-center justify-center">
          <span className="text-5xl opacity-60">🙏</span>
        </div>
        <div className="p-4">
          <h3 className="font-heading font-bold text-gray-900">
            {service.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {service.short_description}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {service.duration_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {locationLabel}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-temple-red">
              {priceDisplay()}
            </span>
            <button
              className="rounded-lg bg-temple-red px-4 py-1.5 text-xs font-semibold text-white hover:bg-temple-red-dark"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              Book Now
            </button>
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
