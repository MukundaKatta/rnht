"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { sampleServices, sampleCategories } from "@/lib/sample-data";
import { ServiceCard } from "@/components/services/ServiceCard";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [locationType, setLocationType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

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
        if (
          locationType === "at_temple" &&
          service.location_type === "outside_temple"
        )
          return false;
        if (
          locationType === "outside_temple" &&
          service.location_type === "at_temple"
        )
          return false;
      }

      if (priceRange !== "all") {
        const price =
          service.price ?? service.price_tiers?.[0]?.price ?? Infinity;
        if (priceRange === "under50" && price >= 50) return false;
        if (priceRange === "50to100" && (price < 50 || price > 100))
          return false;
        if (priceRange === "100to250" && (price < 100 || price > 250))
          return false;
        if (priceRange === "over250" && price < 250) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, locationType, priceRange]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-heading">Pooja & Ritual Services</h1>
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
            { value: "all", label: "All Services" },
            { value: "at_temple", label: "At Temple" },
            { value: "outside_temple", label: "Outside Temple" },
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
            placeholder="Search services..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
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
          <select
            className="input-field"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Any Price</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="100to250">$100 - $250</option>
            <option value="over250">$250+</option>
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
