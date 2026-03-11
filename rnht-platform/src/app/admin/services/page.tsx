"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { sampleServices, sampleCategories } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/types/database";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const toggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, is_active: !s.is_active } : s
      )
    );
  };

  const deleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getCategoryName = (categoryId: string) => {
    return (
      sampleCategories.find((c) => c.id === categoryId)?.name ?? "Unknown"
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-temple-red"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="section-heading">Manage Services</h1>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setEditingService(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {service.short_description}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                  {getCategoryName(service.category_id)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {service.price_type === "fixed" && service.price != null
                    ? formatCurrency(service.price)
                    : service.price_type === "tiered"
                      ? `From ${formatCurrency(service.price_tiers?.[0]?.price ?? 0)}`
                      : service.price_type === "custom"
                        ? "Custom"
                        : "Donation"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                  {service.duration_minutes} min
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(service.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      service.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.is_active ? (
                      <>
                        <Eye className="h-3 w-3" /> Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> Hidden
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setShowForm(true);
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <ServiceFormModal
          service={editingService}
          onClose={() => setShowForm(false)}
          onSave={(service) => {
            if (editingService) {
              setServices((prev) =>
                prev.map((s) => (s.id === service.id ? service : s))
              );
            } else {
              setServices((prev) => [...prev, service]);
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ServiceFormModal({
  service,
  onClose,
  onSave,
}: {
  service: Service | null;
  onClose: () => void;
  onSave: (service: Service) => void;
}) {
  const isEditing = !!service;
  const [name, setName] = useState(service?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    service?.category_id ?? sampleCategories[0].id
  );
  const [shortDescription, setShortDescription] = useState(
    service?.short_description ?? ""
  );
  const [price, setPrice] = useState(String(service?.price ?? ""));
  const [priceType, setPriceType] = useState<string>(service?.price_type ?? "fixed");
  const [duration, setDuration] = useState(
    String(service?.duration_minutes ?? 60)
  );
  const [locationType, setLocationType] = useState<string>(
    service?.location_type ?? "at_temple"
  );

  const handleSave = () => {
    const newService: Service = {
      id: service?.id ?? `svc-${Date.now()}`,
      category_id: categoryId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      short_description: shortDescription,
      full_description: service?.full_description ?? null,
      significance: service?.significance ?? null,
      items_to_bring: service?.items_to_bring ?? null,
      whats_included: service?.whats_included ?? null,
      image_url: null,
      price: priceType === "fixed" ? parseFloat(price) : null,
      price_type: priceType as Service["price_type"],
      price_tiers: service?.price_tiers ?? null,
      suggested_donation:
        priceType === "donation" ? parseFloat(price) : null,
      duration_minutes: parseInt(duration),
      location_type: locationType as Service["location_type"],
      is_active: true,
      sort_order: 99,
      created_at: service?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave(newService);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="font-heading text-xl font-bold text-gray-900">
          {isEditing ? "Edit Service" : "Add New Service"}
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name *
            </label>
            <input
              type="text"
              className="input-field mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              className="input-field mt-1"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {sampleCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short Description *
            </label>
            <textarea
              className="input-field mt-1"
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Type
              </label>
              <select
                className="input-field mt-1"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
              >
                <option value="fixed">Fixed</option>
                <option value="tiered">Tiered</option>
                <option value="custom">Custom Quote</option>
                <option value="donation">Donation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                className="input-field mt-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                type="number"
                className="input-field mt-1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              className="input-field mt-1"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="at_temple">At Temple</option>
              <option value="outside_temple">Outside Temple</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!name || !shortDescription}
          >
            {isEditing ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
