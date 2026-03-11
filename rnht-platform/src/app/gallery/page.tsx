"use client";

import { useState } from "react";
import {
  Camera,
  Video,
  Eye,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type GalleryTab = "photos" | "videos" | "darshan";

type Album = {
  id: string;
  title: string;
  category: string;
  date: string;
  photoCount: number;
  coverColor: string;
};

type VideoItem = {
  id: string;
  title: string;
  category: string;
  duration: string;
  date: string;
  thumbnail: string;
};

const albums: Album[] = [
  { id: "alb-1", title: "Ugadi 2025 Celebrations", category: "Festivals", date: "2025-03-30", photoCount: 45, coverColor: "from-amber-400 to-orange-500" },
  { id: "alb-2", title: "Sri Rama Navami 2025", category: "Festivals", date: "2025-04-06", photoCount: 62, coverColor: "from-red-400 to-pink-500" },
  { id: "alb-3", title: "Diwali 2025 Grand Celebration", category: "Festivals", date: "2025-10-20", photoCount: 78, coverColor: "from-yellow-400 to-amber-500" },
  { id: "alb-4", title: "Community Annadanam — Dec 2025", category: "Community", date: "2025-12-28", photoCount: 23, coverColor: "from-green-400 to-emerald-500" },
  { id: "alb-5", title: "Bharatanatyam Arangetram", category: "Cultural", date: "2025-11-15", photoCount: 34, coverColor: "from-purple-400 to-indigo-500" },
  { id: "alb-6", title: "Sunday Bala Vihar Classes", category: "Education", date: "2025-09-01", photoCount: 18, coverColor: "from-blue-400 to-cyan-500" },
  { id: "alb-7", title: "Kalyanotsavam — Jan 2026", category: "Ceremonies", date: "2026-01-14", photoCount: 56, coverColor: "from-rose-400 to-red-500" },
  { id: "alb-8", title: "Maha Shivaratri 2026", category: "Festivals", date: "2026-02-27", photoCount: 41, coverColor: "from-slate-500 to-gray-600" },
];

const videos: VideoItem[] = [
  { id: "vid-1", title: "Diwali 2025 — Complete Lakshmi Pooja", category: "Ceremonies", duration: "1:45:30", date: "2025-10-20", thumbnail: "" },
  { id: "vid-2", title: "Bhagavad Gita Discourse — Chapter 2", category: "Pravachanam", duration: "58:20", date: "2025-11-05", thumbnail: "" },
  { id: "vid-3", title: "Sri Rudram Chanting by Pandit Sharma", category: "Bhajans", duration: "32:15", date: "2025-09-15", thumbnail: "" },
  { id: "vid-4", title: "Bala Vihar Annual Day Performance", category: "Cultural", duration: "1:12:45", date: "2025-12-10", thumbnail: "" },
  { id: "vid-5", title: "How to Perform Sandhyavandanam", category: "Tutorials", duration: "25:30", date: "2025-08-20", thumbnail: "" },
  { id: "vid-6", title: "Annadanam Seva — Behind the Scenes", category: "Community", duration: "8:45", date: "2026-01-26", thumbnail: "" },
];

const darshanImages = [
  { id: "d-1", deity: "Sri Rudra Narayana", time: "Morning Darshan", date: "Today" },
  { id: "d-2", deity: "Lord Ganesha", time: "After Abhishekam", date: "Today" },
  { id: "d-3", deity: "Goddess Lakshmi", time: "Evening Alankaram", date: "Today" },
  { id: "d-4", deity: "Lord Hanuman", time: "Sindoor Alankaram", date: "Today" },
];

const categoryColors: Record<string, string> = {
  Festivals: "bg-amber-100 text-amber-700",
  Community: "bg-green-100 text-green-700",
  Cultural: "bg-purple-100 text-purple-700",
  Education: "bg-blue-100 text-blue-700",
  Ceremonies: "bg-red-100 text-red-700",
  Pravachanam: "bg-indigo-100 text-indigo-700",
  Bhajans: "bg-pink-100 text-pink-700",
  Tutorials: "bg-cyan-100 text-cyan-700",
};

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("photos");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <Camera className="mx-auto h-10 w-10 text-temple-red" />
        <h1 className="mt-4 section-heading">Photo & Video Gallery</h1>
        <p className="mt-3 mx-auto max-w-2xl text-gray-600">
          Relive the divine moments from our temple events, festivals,
          and daily darshan through our photo and video gallery.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex justify-center gap-2">
        {[
          { id: "photos" as const, label: "Photo Albums", icon: Camera },
          { id: "videos" as const, label: "Videos", icon: Video },
          { id: "darshan" as const, label: "Daily Darshan", icon: Eye },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-temple-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="card cursor-pointer overflow-hidden"
                onClick={() => setSelectedAlbum(album)}
              >
                <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${album.coverColor}`}>
                  <Camera className="h-12 w-12 text-white/60" />
                </div>
                <div className="p-4">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[album.category] || "bg-gray-100 text-gray-700"}`}>
                    {album.category}
                  </span>
                  <h3 className="mt-2 font-heading text-sm font-bold text-gray-900 line-clamp-2">
                    {album.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{album.photoCount} photos</span>
                    <span>{album.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="card overflow-hidden">
                <div className="relative flex h-44 items-center justify-center bg-gray-900">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[video.category] || "bg-gray-100 text-gray-700"}`}>
                    {video.category}
                  </span>
                  <h3 className="mt-2 font-heading text-sm font-bold text-gray-900">
                    {video.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{video.date}</span>
                    <button className="flex items-center gap-1 text-temple-red hover:underline">
                      <Share2 className="h-3 w-3" /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Daily Darshan Tab */}
        {activeTab === "darshan" && (
          <div>
            <div className="mb-6 rounded-xl bg-temple-cream p-4 text-center">
              <p className="text-sm text-temple-maroon">
                Updated daily. View the divine deities in their morning and evening
                alankaram from the comfort of your home.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {darshanImages.map((item, i) => (
                <div
                  key={item.id}
                  className="card cursor-pointer overflow-hidden"
                  onClick={() => setLightboxIndex(i)}
                >
                  <div className="flex h-64 items-center justify-center bg-gradient-to-br from-temple-cream to-temple-gold/20">
                    <div className="text-center">
                      <Eye className="mx-auto h-10 w-10 text-temple-gold/50" />
                      <p className="mt-2 text-sm font-semibold text-temple-maroon">
                        {item.deity}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.deity}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Share darshan photos to WhatsApp, Instagram, Facebook, or X with one tap.
            </div>
          </div>
        )}
      </div>

      {/* Album Viewer Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="font-heading text-xl font-bold">{selectedAlbum.title}</h2>
              <p className="text-sm text-gray-400">{selectedAlbum.photoCount} photos | {selectedAlbum.date}</p>
            </div>
            <button onClick={() => setSelectedAlbum(null)} className="rounded-lg p-2 hover:bg-white/10">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: Math.min(selectedAlbum.photoCount, 12) }).map((_, i) => (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br ${selectedAlbum.coverColor} opacity-80 hover:opacity-100 cursor-pointer transition-opacity`}
                >
                  <Camera className="h-8 w-8 text-white/40" />
                </div>
              ))}
            </div>
            {selectedAlbum.photoCount > 12 && (
              <p className="mt-4 text-center text-sm text-gray-400">
                Showing 12 of {selectedAlbum.photoCount} photos. Full album available after login.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            className="absolute right-4 top-4 rounded-lg p-2 text-white hover:bg-white/10"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white hover:bg-white/10"
            onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white hover:bg-white/10"
            onClick={() => setLightboxIndex(Math.min(darshanImages.length - 1, lightboxIndex + 1))}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="flex h-96 w-96 items-center justify-center rounded-2xl bg-gradient-to-br from-temple-cream to-temple-gold/20">
            <div className="text-center">
              <Eye className="mx-auto h-16 w-16 text-temple-gold/50" />
              <p className="mt-4 text-lg font-heading font-bold text-temple-maroon">
                {darshanImages[lightboxIndex].deity}
              </p>
              <p className="text-sm text-gray-500">{darshanImages[lightboxIndex].time}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
