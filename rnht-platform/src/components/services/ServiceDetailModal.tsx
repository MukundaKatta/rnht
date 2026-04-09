"use client";

import { useState, useEffect } from "react";
import { X, Clock, MapPin, CheckCircle, AlertCircle, MessageCircle, Phone } from "lucide-react";
import type { Service, PriceTier, FamilyMember } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { useCartStore, type CartItem } from "@/store/cart";

export function ServiceDetailModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(
    service.price_tiers?.[0] ?? null
  );
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [devoteeName, setDevoteeName] = useState("");
  const [devoteeEmail, setDevoteeEmail] = useState("");
  const [devoteePhone, setDevoteePhone] = useState("");
  const [gotra, setGotra] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [rashi, setRashi] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [added, setAdded] = useState(false);

  const isCustomQuote = service.price_type === "custom";

  // Lock body scroll and handle escape key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const locationLabel =
    service.location_type === "at_temple"
      ? "At Temple"
      : service.location_type === "outside_temple"
        ? "Outside Temple"
        : "At Temple / Outside";

  const handleAddToCart = () => {
    const item: CartItem = {
      id: `${service.id}-${Date.now()}`,
      service,
      selectedTier,
      quantity: 1,
      bookingDate,
      bookingTime,
      devoteeName,
      devoteeEmail,
      devoteePhone,
      gotra,
      nakshatra,
      rashi,
      specialInstructions,
      familyMembers,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => onClose(), 1500);
  };

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: "", gotra: "", nakshatra: "", relationship: "" },
    ]);
  };

  const updateFamilyMember = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste! I would like to book ${service.name}. Please share availability and pricing details.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-h-[85vh] sm:max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-gray-500 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="h-48 bg-gradient-to-br from-temple-cream to-temple-gold/30 flex items-center justify-center">
          <span className="text-7xl opacity-50">🙏</span>
        </div>

        <div className="p-4 sm:p-6">
          {added ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center animate-fade-in">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">
                Added to Cart!
              </h3>
              <p className="text-gray-600">
                {service.name} has been added to your cart.
              </p>
            </div>
          ) : (
            <>
              <h2 id="modal-title" className="font-heading text-2xl font-bold text-gray-900">
                {service.name}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {service.duration_minutes} minutes
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {locationLabel}
                </span>
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {service.full_description || service.short_description}
              </p>

              {service.significance && (
                <div className="mt-4 rounded-lg bg-temple-cream p-4">
                  <h4 className="text-sm font-semibold text-temple-maroon">
                    Spiritual Significance
                  </h4>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    {service.significance}
                  </p>
                </div>
              )}

              {service.whats_included && service.whats_included.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900">
                    What&apos;s Included
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {service.whats_included.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.items_to_bring && service.items_to_bring.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Items to Bring (Pooja Checklist)
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {service.items_to_bring.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 text-temple-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pricing */}
              <div className="mt-6 rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Pricing
                </h4>
                {service.price_type === "fixed" && (
                  <p className="mt-2 text-2xl font-bold text-temple-red">
                    {formatCurrency(service.price!)}
                  </p>
                )}
                {service.price_type === "tiered" && service.price_tiers && (
                  <div className="mt-3 space-y-2">
                    {service.price_tiers.map((tier) => (
                      <label
                        key={tier.name}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                          selectedTier?.name === tier.name
                            ? "border-temple-red bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tier"
                          checked={selectedTier?.name === tier.name}
                          onChange={() => setSelectedTier(tier)}
                          className="text-temple-red"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{tier.name}</span>
                            <span className="font-bold text-temple-red">
                              {formatCurrency(tier.price)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {tier.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {service.price_type === "donation" && (
                  <p className="mt-2 text-gray-600">
                    This service is offered on a donation basis.
                    {service.suggested_donation && (
                      <span className="block mt-1 font-semibold text-temple-gold">
                        Suggested donation:{" "}
                        {formatCurrency(service.suggested_donation)}
                      </span>
                    )}
                  </p>
                )}
                {service.price_type === "custom" && (
                  <p className="mt-2 text-gray-600">
                    This service requires a custom quote. Please submit an
                    inquiry and our priest will contact you with details.
                  </p>
                )}
              </div>

              {/* Quick Contact */}
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Quick Booking via WhatsApp
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Contact our priest directly for availability and custom quotes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/15125450473?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Pt. Aditya
                  </a>
                  <a
                    href="tel:+15129980122"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Pt. Raghurama
                  </a>
                </div>
              </div>

              {!isCustomQuote && !showBookingForm && (
                <button
                  className="btn-primary mt-4 w-full"
                  onClick={() => setShowBookingForm(true)}
                >
                  Or Book Online
                </button>
              )}

              {isCustomQuote && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  This service requires a custom quote. Please contact us via WhatsApp or phone above.
                </p>
              )}

              {/* Booking Form */}
              {showBookingForm && !isCustomQuote && (
                <div className="mt-6 space-y-4 rounded-lg border border-gray-200 p-4 animate-fade-in-up">
                  <h4 className="font-semibold text-gray-900">
                    Booking Details
                  </h4>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        className="input-field mt-1"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Preferred Time *
                      </label>
                      <select
                        className="input-field mt-1"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                      >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Devotee Name *
                      </label>
                      <input
                        type="text"
                        className="input-field mt-1"
                        placeholder="Full name"
                        value={devoteeName}
                        onChange={(e) => setDevoteeName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="input-field mt-1"
                        placeholder="your@email.com"
                        value={devoteeEmail}
                        onChange={(e) => setDevoteeEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input-field mt-1"
                      placeholder="(555) 123-4567"
                      value={devoteePhone}
                      onChange={(e) => setDevoteePhone(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gotra
                      </label>
                      <input
                        type="text"
                        className="input-field mt-1"
                        placeholder="e.g., Bharadwaja"
                        value={gotra}
                        onChange={(e) => setGotra(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nakshatra
                      </label>
                      <input
                        type="text"
                        className="input-field mt-1"
                        placeholder="e.g., Ashwini"
                        value={nakshatra}
                        onChange={(e) => setNakshatra(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rashi
                      </label>
                      <input
                        type="text"
                        className="input-field mt-1"
                        placeholder="e.g., Mesha"
                        value={rashi}
                        onChange={(e) => setRashi(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <textarea
                      className="input-field mt-1"
                      rows={2}
                      placeholder="Any special requests or notes for the priest..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>

                  {/* Family Members */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Family Members (for Sankalp)
                      </label>
                      <button
                        type="button"
                        className="text-sm text-temple-red hover:underline"
                        onClick={addFamilyMember}
                      >
                        + Add Member
                      </button>
                    </div>
                    {familyMembers.map((member, index) => (
                      <div
                        key={`family-${index}`}
                        className="mt-2 flex items-start gap-2 rounded-lg border border-gray-200 p-3"
                      >
                        <div className="flex-1 grid gap-2 grid-cols-2 sm:grid-cols-4">
                          <input
                            type="text"
                            placeholder="Name"
                            className="input-field text-sm"
                            value={member.name}
                            onChange={(e) =>
                              updateFamilyMember(index, "name", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Relationship"
                            className="input-field text-sm"
                            value={member.relationship || ""}
                            onChange={(e) =>
                              updateFamilyMember(
                                index,
                                "relationship",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Gotra"
                            className="input-field text-sm"
                            value={member.gotra || ""}
                            onChange={(e) =>
                              updateFamilyMember(index, "gotra", e.target.value)
                            }
                          />
                          <input
                            type="text"
                            placeholder="Nakshatra"
                            className="input-field text-sm"
                            value={member.nakshatra || ""}
                            onChange={(e) =>
                              updateFamilyMember(
                                index,
                                "nakshatra",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="mt-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove family member"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-primary w-full"
                    onClick={handleAddToCart}
                    disabled={
                      !bookingDate ||
                      !bookingTime ||
                      !devoteeName ||
                      !devoteeEmail
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
