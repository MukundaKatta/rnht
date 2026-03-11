"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Image,
  Video,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  X,
} from "lucide-react";
import {
  useSlideshowStore,
  type Slide,
  type SlideType,
} from "@/store/slideshow";

function SlideEditor({
  slide,
  onClose,
}: {
  slide: Slide | null;
  onClose: () => void;
}) {
  const { addSlide, updateSlide } = useSlideshowStore();
  const slides = useSlideshowStore((s) => s.slides);

  const isNew = !slide;
  const [form, setForm] = useState<Omit<Slide, "id">>({
    type: slide?.type || "image",
    url: slide?.url || "",
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    ctaText: slide?.ctaText || "Learn More",
    ctaLink: slide?.ctaLink || "/services",
    isActive: slide?.isActive ?? true,
    sortOrder: slide?.sortOrder ?? slides.length,
  });

  const handleSave = () => {
    if (isNew) {
      addSlide({
        ...form,
        id: `slide-${Date.now()}`,
      });
    } else {
      updateSlide(slide.id, form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="font-heading text-lg font-bold text-gray-900">
            {isNew ? "Add New Slide" : "Edit Slide"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media Type
            </label>
            <div className="mt-1 flex gap-2">
              {(["image", "video"] as SlideType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, type })}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    form.type === type
                      ? "border-temple-red bg-red-50 text-temple-red"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {type === "image" ? (
                    <Image className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {form.type === "image" ? "Image URL" : "Video URL"}
            </label>
            <input
              type="url"
              className="input-field mt-1"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder={
                form.type === "image"
                  ? "https://example.com/photo.jpg (leave empty for gradient)"
                  : "https://example.com/video.mp4"
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              {form.type === "image"
                ? "Leave empty to use the temple gradient background. Recommended size: 1920x800px."
                : "Use a direct MP4 link. YouTube/Vimeo embeds are not supported for autoplay."}
            </p>
          </div>

          {/* Preview */}
          {form.url && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              {form.type === "image" ? (
                <img
                  src={form.url}
                  alt="Preview"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <video
                  src={form.url}
                  className="h-40 w-full object-cover"
                  muted
                  playsInline
                />
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              className="input-field mt-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Rudra Narayana Hindu Temple"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
            </label>
            <textarea
              className="input-field mt-1"
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Describe this slide..."
            />
          </div>

          {/* CTA */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                className="input-field mt-1"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Book a Pooja"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                className="input-field mt-1"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/services"
              />
            </div>
          </div>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded text-temple-red"
            />
            <span className="text-sm font-medium text-gray-700">
              Active (visible on homepage)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title}
            className="btn-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            {isNew ? "Add Slide" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSlideshowPage() {
  const { slides, removeSlide, updateSlide, reorderSlides } =
    useSlideshowStore();
  const [editingSlide, setEditingSlide] = useState<Slide | null | "new">(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedSlides = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);

  const moveSlide = (index: number, direction: "up" | "down") => {
    const newSlides = [...sortedSlides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    [newSlides[index], newSlides[swapIndex]] = [
      newSlides[swapIndex],
      newSlides[index],
    ];
    reorderSlides(
      newSlides.map((s, i) => ({ ...s, sortOrder: i }))
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Back to admin"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="section-heading flex items-center gap-2">
            <Image className="h-7 w-7 text-temple-red" />
            Hero Slideshow
          </h1>
          <p className="mt-1 text-gray-600">
            Manage homepage banner slides — add photos, videos, and text
          </p>
        </div>
        <button
          onClick={() => setEditingSlide("new")}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </button>
      </div>

      {/* Slide List */}
      <div className="mt-8 space-y-3">
        {sortedSlides.length === 0 && (
          <div className="card p-12 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-600">No slides yet. Add your first slide to get started.</p>
            <button
              onClick={() => setEditingSlide("new")}
              className="btn-primary mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Slide
            </button>
          </div>
        )}

        {sortedSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`card overflow-hidden ${
              !slide.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-stretch">
              {/* Thumbnail */}
              <div className="w-32 shrink-0 sm:w-48">
                {slide.url ? (
                  slide.type === "video" ? (
                    <div className="flex h-full items-center justify-center bg-gray-900">
                      <Video className="h-8 w-8 text-white/60" />
                    </div>
                  ) : (
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).className =
                          "h-full w-full bg-gradient-to-br from-temple-maroon to-temple-red";
                      }}
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-temple-maroon to-temple-red">
                    <span className="text-2xl text-white/40">🕉️</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center gap-3 p-4">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                    className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <button
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === sortedSlides.length - 1}
                    className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {slide.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        slide.type === "video"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {slide.type}
                    </span>
                    {!slide.isActive && (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {slide.subtitle || "No description"}
                  </p>
                  {slide.ctaText && (
                    <p className="mt-1 text-xs text-temple-red">
                      {slide.ctaText} → {slide.ctaLink}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() =>
                      updateSlide(slide.id, { isActive: !slide.isActive })
                    }
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label={
                      slide.isActive ? "Hide slide" : "Show slide"
                    }
                    title={slide.isActive ? "Hide" : "Show"}
                  >
                    {slide.isActive ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-temple-red"
                    aria-label="Edit slide"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  {deleteConfirm === slide.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          removeSlide(slide.id);
                          setDeleteConfirm(null);
                        }}
                        className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(slide.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-900">Tips</h3>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>
            Use high-quality photos (1920x800px) of temple ceremonies, festivals, or deities.
          </li>
          <li>
            For videos, use direct MP4 links. Videos autoplay muted in the background.
          </li>
          <li>
            Leave the image URL empty to use the default temple gradient.
          </li>
          <li>
            Slides auto-rotate every 6 seconds. Visitors can pause or manually navigate.
          </li>
          <li>
            Reorder slides using the up/down arrows. Toggle visibility with the eye icon.
          </li>
        </ul>
      </div>

      {/* Edit Modal */}
      {editingSlide && (
        <SlideEditor
          slide={editingSlide === "new" ? null : editingSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
}
