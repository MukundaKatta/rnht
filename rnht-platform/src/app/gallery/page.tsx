"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const galleryImages = [
  { src: "/gallery/gallery-01.jpg", alt: "Priest conducting ceremony with family", category: "Ceremonies" },
  { src: "/gallery/gallery-02.jpg", alt: "Priest performing pooja at mandapam", category: "Ceremonies" },
  { src: "/gallery/gallery-03.jpg", alt: "Priest with Ganesha idol and decorations", category: "Ceremonies" },
  { src: "/gallery/gallery-04.jpg", alt: "Priest blessing devotees at community event", category: "Community" },
  { src: "/gallery/gallery-05.jpg", alt: "Deity with garlands and green backdrop", category: "Darshan" },
  { src: "/gallery/gallery-06.jpg", alt: "Devotee performing abhishekam at temple", category: "Ceremonies" },
  { src: "/gallery/gallery-07.jpg", alt: "Both priests seated with deity idols", category: "Priests" },
  { src: "/gallery/gallery-08.jpg", alt: "Goddess Lakshmi beautifully adorned", category: "Darshan" },
  { src: "/gallery/gallery-09.jpg", alt: "Goddess with floral decorations", category: "Darshan" },
  { src: "/gallery/gallery-10.jpg", alt: "Wedding ceremony with priest and couple", category: "Weddings" },
  { src: "/gallery/gallery-11.jpg", alt: "Colorful pooja materials and offerings", category: "Ceremonies" },
  { src: "/gallery/gallery-12.jpg", alt: "Home pooja with family and Ganesh backdrop", category: "Home Services" },
  { src: "/gallery/gallery-13.jpg", alt: "Family pooja with priest", category: "Home Services" },
  { src: "/gallery/gallery-14.jpg", alt: "Hanuman deity with abhishekam", category: "Darshan" },
  { src: "/gallery/gallery-15.jpg", alt: "Gau Pooja - cow worship ceremony", category: "Ceremonies" },
  { src: "/gallery/gallery-16.jpg", alt: "Shiva Lingam with floral decoration", category: "Darshan" },
  { src: "/gallery/gallery-17.jpg", alt: "Beautiful flower rangoli pooja setup", category: "Ceremonies" },
  { src: "/gallery/gallery-18.jpg", alt: "Shiva Lingam with flowers and coconuts", category: "Ceremonies" },
  { src: "/gallery/gallery-19.jpg", alt: "Shiva Parvati deity with floral offerings", category: "Darshan" },
  { src: "/gallery/gallery-20.jpg", alt: "Pandit Aditya Sharma with Shiva yantra", category: "Priests" },
  { src: "/gallery/gallery-21.jpg", alt: "Beautiful Navagraha rangoli with fruits", category: "Ceremonies" },
  { src: "/gallery/gallery-22.jpg", alt: "Pandit speaking at temple event", category: "Community" },
  { src: "/gallery/gallery-23.jpg", alt: "Ram Parivar celebration with mandapam", category: "Festivals" },
  { src: "/gallery/gallery-24.jpg", alt: "Deity adorned with roses and jewels", category: "Darshan" },
  { src: "/gallery/gallery-25.jpg", alt: "Ram Parivar event - priest addressing devotees", category: "Festivals" },
];

const categories = ["All", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

const DRIVE_LINK = "#"; // TODO: Replace with actual Google Drive link

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (filteredIndex: number) => {
    setLightboxIndex(filteredIndex);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = () => {
    setLightboxIndex((prev) => (prev! === 0 ? filtered.length - 1 : prev! - 1));
  };

  const goNext = () => {
    setLightboxIndex((prev) => (prev! === filtered.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <Camera className="mx-auto h-10 w-10 text-temple-red" />
        <h1 className="mt-4 section-heading">Gallery</h1>
        <p className="mt-3 mx-auto max-w-2xl text-gray-600">
          Glimpses of divine moments from our temple ceremonies, festivals, and community events.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-temple-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4">
        {filtered.map((img, i) => (
          <div
            key={img.src}
            className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl group"
            onClick={() => openLightbox(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={400}
              height={300}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* View Full Gallery CTA */}
      <div className="mt-12 text-center">
        <div className="rounded-2xl bg-gradient-to-br from-temple-cream to-temple-gold/10 p-8">
          <Camera className="mx-auto h-8 w-8 text-temple-gold" />
          <h2 className="mt-4 font-heading text-xl font-bold text-gray-900">
            Want to see more?
          </h2>
          <p className="mt-2 text-gray-600">
            Browse our complete collection of photos and videos from all temple events.
          </p>
          <a
            href={DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Gallery on Google Drive
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 rounded-lg p-2 text-white hover:bg-white/10 z-10"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white hover:bg-white/10 z-10"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white hover:bg-white/10 z-10"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm text-gray-300">
              {filtered[lightboxIndex].alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
