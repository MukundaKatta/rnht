"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { sampleServices, sampleCategories } from "@/lib/sample-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/i18n/translations";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationType, setLocationType] = useState<string>("all");
  // Price filter removed — all services use custom quotes
  const locale = useLanguageStore((s) => s.locale);

  // Read ?category= URL param to support deep linking from home page
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const match = sampleCategories.find((c) => c.slug === categorySlug);
      if (match) setSelectedCategory(match.id);
    }
  }, [searchParams]);

  const filteredServices = useMemo(() => {
    return sampleServices.filter((service) => {
      if (!service.is_active) return false;

      if (
        searchQuery &&
        !service.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !service.short_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedCategory !== "all" &&
        service.category_id !== selectedCategory
      ) {
        return false;
      }

      if (locationType !== "all") {
        if (locationType === "at_temple" && service.location_type === "outside_temple")
          return false;
        if (locationType === "outside_temple" && service.location_type !== "outside_temple")
          return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, locationType]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-heading">{t("services.title", locale)}</h1>
        <p className="mt-3 text-gray-600">
          We offer daily pujas, special occasion pujas, Sodash Samskaras, Homams,
          remedial yagnas, and more. Serving the Austin, Texas area.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Service areas: Kyle, Manor, Austin, Dallas, Houston, Lakeway, Bee Cave,
          Georgetown, Round Rock, San Antonio, Leander, Dripping Springs, and more.
        </p>
      </div>

      {/* Location Type Toggle */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          {[
            { value: "all", label: t("services.all", locale) },
            { value: "at_temple", label: t("services.atTemple", locale) },
            { value: "outside_temple", label: t("services.outsideTemple", locale) },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setLocationType(option.value)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                locationType === option.value
                  ? "bg-white text-temple-red shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("services.search", locale)}
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <select
            className="input-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {sampleCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === "all"
              ? "bg-temple-red text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {sampleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-temple-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        <p className="text-sm text-gray-500">
          {filteredServices.length} service
          {filteredServices.length !== 1 ? "s" : ""} found
        </p>
        {filteredServices.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-600">
              No services match your filters. Try adjusting your search
              criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
