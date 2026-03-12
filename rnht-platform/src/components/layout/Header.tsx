"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Globe,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";
import { useAuthStore } from "@/store/auth";
import { localeNames, type Locale } from "@/lib/i18n/translations";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "Priests", href: "/priests" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
];

const mobileNavItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "Priests", href: "/priests" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
];

/* ─── Hanging Temple Bell SVG ─── */
function TempleBell({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = { sm: { w: 16, h: 28 }, md: { w: 20, h: 36 }, lg: { w: 24, h: 42 } };
  const { w, h } = dims[size];
  return (
    <svg width={w} height={h} viewBox="0 0 24 42" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chain / rope */}
      <line x1="12" y1="0" x2="12" y2="10" stroke="url(#chainGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="10" r="1.5" fill="#C5972C" />
      {/* Bell dome */}
      <path d="M4 24C4 17 6 12 12 12C18 12 20 17 20 24L22 28H2L4 24Z" fill="url(#bellGold)" stroke="#A67C10" strokeWidth="0.5" />
      {/* Bell rim */}
      <rect x="1" y="28" width="22" height="3" rx="1.5" fill="url(#rimGold)" />
      {/* Clapper */}
      <line x1="12" y1="25" x2="12" y2="33" stroke="#8B6914" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="12" cy="34" r="2" fill="url(#clapperGold)" />
      {/* Shine highlight */}
      <ellipse cx="9" cy="19" rx="2.5" ry="4" fill="white" opacity="0.18" />
      {/* Decorative bands on bell */}
      <path d="M6 20H18" stroke="#A67C10" strokeWidth="0.4" opacity="0.5" />
      <path d="M5 23H19" stroke="#A67C10" strokeWidth="0.4" opacity="0.5" />
      {/* Top ornament */}
      <circle cx="12" cy="11.5" r="2.5" fill="url(#bellGold)" stroke="#A67C10" strokeWidth="0.4" />
      <defs>
        <linearGradient id="chainGrad" x1="12" y1="0" x2="12" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#B8912A" />
        </linearGradient>
        <linearGradient id="bellGold" x1="4" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0D060" />
          <stop offset="30%" stopColor="#D4A843" />
          <stop offset="70%" stopColor="#C5972C" />
          <stop offset="100%" stopColor="#A67C10" />
        </linearGradient>
        <linearGradient id="rimGold" x1="1" y1="28" x2="23" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C5972C" />
          <stop offset="50%" stopColor="#E8C34A" />
          <stop offset="100%" stopColor="#C5972C" />
        </linearGradient>
        <radialGradient id="clapperGold" cx="12" cy="34" r="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8C34A" />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── South Indian Hanging Temple Deepam ─── */
/* Chain from ceiling → brass holder → open oil cup → flame rising UP */
function HangingLamp({ id = "hl", size = "md", className = "" }: { id?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const dims = { sm: { w: 20, h: 58 }, md: { w: 26, h: 72 }, lg: { w: 32, h: 86 } };
  const { w, h } = dims[size];
  return (
    <svg width={w} height={h} viewBox="0 0 30 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* ── Brass chain from ceiling ── */}
      <line x1="15" y1="0" x2="15" y2="5" stroke={`url(#${id}ch)`} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="15" cy="7" rx="1.8" ry="2.2" stroke={`url(#${id}ch)`} strokeWidth="0.8" fill="none" />
      <line x1="15" y1="9.2" x2="15" y2="13" stroke={`url(#${id}ch)`} strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="15" cy="15" rx="1.8" ry="2.2" stroke={`url(#${id}ch)`} strokeWidth="0.8" fill="none" />
      <line x1="15" y1="17.2" x2="15" y2="21" stroke={`url(#${id}ch)`} strokeWidth="1.4" strokeLinecap="round" />

      {/* ── Decorative brass canopy / top cap ── */}
      <path d="M10 22C10 21 12 20 15 20C18 20 20 21 20 22L21 24H9L10 22Z" fill={`url(#${id}br)`} stroke="#8B6914" strokeWidth="0.4" />
      <rect x="9" y="24" width="12" height="1.2" rx="0.6" fill={`url(#${id}rim)`} />

      {/* ── Three support chains fanning down to bowl ── */}
      <line x1="10" y1="25.2" x2="7" y2="38" stroke={`url(#${id}ch)`} strokeWidth="0.7" />
      <line x1="15" y1="25.2" x2="15" y2="37" stroke={`url(#${id}ch)`} strokeWidth="0.7" />
      <line x1="20" y1="25.2" x2="23" y2="38" stroke={`url(#${id}ch)`} strokeWidth="0.7" />

      {/* ── Oil cup — open brass bowl (flame rises from here) ── */}
      {/* Bowl rim */}
      <ellipse cx="15" cy="39" rx="10" ry="2.5" fill={`url(#${id}rim)`} stroke="#8B6914" strokeWidth="0.4" />
      {/* Bowl body — rounded open cup */}
      <path d="M5 39C5 39 5 44 8 47C10 49 13 50 15 50C17 50 20 49 22 47C25 44 25 39 25 39" fill={`url(#${id}br)`} stroke="#8B6914" strokeWidth="0.4" />
      {/* Inner oil surface */}
      <ellipse cx="15" cy="39.5" rx="8" ry="1.8" fill="#C5972C" opacity="0.3" />
      {/* Decorative band around bowl */}
      <path d="M6 42Q15 46 24 42" stroke={`url(#${id}rim)`} strokeWidth="0.8" fill="none" />
      {/* Decorative dots on bowl */}
      {[9, 12, 15, 18, 21].map((x) => (
        <circle key={x} cx={x} cy="41.5" r="0.4" fill="#F5E17D" opacity="0.8" />
      ))}
      {/* Bowl bottom finial */}
      <ellipse cx="15" cy="51" rx="2" ry="1.5" fill={`url(#${id}rim)`} stroke="#8B6914" strokeWidth="0.3" />
      <ellipse cx="15" cy="53" rx="1" ry="1.2" fill={`url(#${id}br)`} />

      {/* ── Wick rising from oil ── */}
      <line x1="15" y1="37" x2="15" y2="39" stroke="#5D4037" strokeWidth="0.7" />

      {/* ── Flame — rising UP from the open cup ── */}
      <path d="M15 27C15 27 11.5 31 11.5 33.5C11.5 35.4 13.1 37 15 37C16.9 37 18.5 35.4 18.5 33.5C18.5 31 15 27 15 27Z" fill={`url(#${id}fl)`} />
      {/* White-hot inner core */}
      <path d="M15 30C15 30 13.5 32 13.5 33.5C13.5 34.3 14.2 35 15 35C15.8 35 16.5 34.3 16.5 33.5C16.5 32 15 30 15 30Z" fill="#FFFDE7" opacity="0.9" />
      {/* Spark tip */}
      <ellipse cx="15" cy="28" rx="0.7" ry="1.5" fill="#FFF59D" opacity="0.6" />

      {/* ── Flame glow ── */}
      <circle cx="15" cy="33" r="10" fill={`url(#${id}gl)`} opacity="0.3" />
      <circle cx="15" cy="33" r="6" fill={`url(#${id}gli)`} opacity="0.4" />

      {/* Brass bowl shine */}
      <ellipse cx="12" cy="43" rx="2.5" ry="3" fill="white" opacity="0.08" />

      <defs>
        <linearGradient id={`${id}ch`} x1="15" y1="0" x2="15" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id={`${id}br`} x1="5" y1="38" x2="25" y2="53" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5E17D" />
          <stop offset="30%" stopColor="#D4A843" />
          <stop offset="60%" stopColor="#C5972C" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id={`${id}rim`} x1="5" y1="39" x2="25" y2="39" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="25%" stopColor="#D4A843" />
          <stop offset="50%" stopColor="#F5E17D" />
          <stop offset="75%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id={`${id}fl`} x1="15" y1="27" x2="15" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="25%" stopColor="#FFD54F" />
          <stop offset="55%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <radialGradient id={`${id}gl`} cx="15" cy="33" r="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="50%" stopColor="#FF8F00" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}gli`} cx="15" cy="33" r="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Mango Leaf Toran (garland) SVG ─── */
function MangoLeafToran() {
  return (
    <svg className="absolute -bottom-[6px] left-0 right-0 w-full h-[8px]" viewBox="0 0 1200 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M0 0 Q150 8 300 0 Q450 8 600 0 Q750 8 900 0 Q1050 8 1200 0" stroke="url(#toranGrad)" strokeWidth="1.5" fill="none" />
      {/* Small marigold dots at the peaks */}
      {[150, 450, 750, 1050].map((x) => (
        <circle key={x} cx={x} cy="7" r="2.5" fill="#E8A020" opacity="0.6" />
      ))}
      <defs>
        <linearGradient id="toranGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C5973E" stopOpacity="0.2" />
          <stop offset="20%" stopColor="#2D8B3A" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#C5973E" stopOpacity="0.5" />
          <stop offset="80%" stopColor="#2D8B3A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C5973E" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Hanging Bells Row ─── */
function HangingBells() {
  // Bell config: position (%), size, animation class
  const bells: { pct: number; size: "sm" | "md" | "lg"; anim: string }[] = [
    { pct: 2, size: "sm", anim: "bell-swing" },
    { pct: 6, size: "md", anim: "bell-swing-delayed" },
    { pct: 11, size: "sm", anim: "bell-swing-slow" },
    { pct: 16, size: "md", anim: "bell-swing" },
    { pct: 21, size: "sm", anim: "bell-swing-delayed" },
    { pct: 26, size: "md", anim: "bell-swing-slow" },
    { pct: 31, size: "sm", anim: "bell-swing" },
    { pct: 36, size: "md", anim: "bell-swing-delayed" },
    { pct: 41, size: "sm", anim: "bell-swing-slow" },
    { pct: 45, size: "md", anim: "bell-swing" },
    { pct: 50, size: "lg", anim: "bell-swing-delayed" },
    { pct: 55, size: "md", anim: "bell-swing-slow" },
    { pct: 59, size: "sm", anim: "bell-swing" },
    { pct: 64, size: "md", anim: "bell-swing-delayed" },
    { pct: 69, size: "sm", anim: "bell-swing-slow" },
    { pct: 74, size: "md", anim: "bell-swing" },
    { pct: 79, size: "sm", anim: "bell-swing-delayed" },
    { pct: 84, size: "md", anim: "bell-swing-slow" },
    { pct: 89, size: "sm", anim: "bell-swing" },
    { pct: 94, size: "md", anim: "bell-swing-delayed" },
    { pct: 98, size: "sm", anim: "bell-swing-slow" },
  ];

  return (
    <div className="hidden lg:block absolute -bottom-[2px] left-0 right-0 pointer-events-none z-10 overflow-visible" aria-hidden="true">
      {/* Decorative toran garland thread */}
      <MangoLeafToran />

      {/* Bells positioned absolutely across full width, hugging the header */}
      {bells.map((b, i) => (
        <div
          key={i}
          className={`absolute top-0 ${b.anim}`}
          style={{ left: `${b.pct}%` }}
        >
          <TempleBell size={b.size} />
        </div>
      ))}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((s) => s.items.length);
  const { locale, setLocale } = useLanguageStore();
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close language picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    }
    if (showLangPicker) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showLangPicker]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#FFF8E7] via-[#FFF3D6] to-[#FDEDC4] backdrop-blur-md shadow-[0_2px_20px_rgba(191,155,48,0.15)] border-b border-temple-gold/30 relative">
      {/* Premium gold accent line at top */}
      <div className="h-1 bg-gradient-to-r from-temple-gold via-yellow-400 to-temple-gold" />

      {/* Hanging South Indian temple deepams — 5 on each side */}
      <div className="hidden lg:flex absolute left-0 top-0 z-20 pointer-events-none items-start" aria-hidden="true">
        <HangingLamp id="hL1" size="sm" className="animate-pulse-glow bell-swing opacity-50" />
        <HangingLamp id="hL2" size="md" className="animate-pulse-glow bell-swing-delayed opacity-65" />
        <HangingLamp id="hL3" size="lg" className="animate-pulse-glow bell-swing-slow" />
        <HangingLamp id="hL4" size="md" className="animate-pulse-glow bell-swing opacity-65" />
        <HangingLamp id="hL5" size="sm" className="animate-pulse-glow bell-swing-delayed opacity-50" />
      </div>
      <div className="hidden lg:flex absolute right-0 top-0 z-20 pointer-events-none items-start" aria-hidden="true">
        <HangingLamp id="hR1" size="sm" className="animate-pulse-glow bell-swing-delayed opacity-50" />
        <HangingLamp id="hR2" size="md" className="animate-pulse-glow bell-swing opacity-65" />
        <HangingLamp id="hR3" size="lg" className="animate-pulse-glow bell-swing-slow" />
        <HangingLamp id="hR4" size="md" className="animate-pulse-glow bell-swing-delayed opacity-65" />
        <HangingLamp id="hR5" size="sm" className="animate-pulse-glow bell-swing opacity-50" />
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-5 group min-w-0 lg:min-w-[340px]">
          {/* Logo with premium gold glow ring — larger */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: "radial-gradient(circle, rgba(197,151,62,0.45) 0%, rgba(232,195,74,0.15) 55%, transparent 80%)",
            }} />
            <div className="absolute -inset-0.5 rounded-full ring-1 ring-temple-gold/25" />
            <Image
              src="/cropped-RNHT_Logo_512x512_transparent-150x150.png"
              alt="RNHT Logo"
              width={64}
              height={64}
              className="relative rounded-full ring-[3px] ring-temple-gold/50 shadow-[0_0_16px_rgba(197,151,62,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(197,151,62,0.5)]"
            />
          </div>
          <div className="hidden sm:block min-w-0">
            {/* Sanskrit / Devanagari blessing — tiny, elegant */}
            <p className="text-[10px] font-accent text-temple-gold/60 tracking-[0.2em] leading-none mb-1" aria-hidden="true">
              ॐ श्री रुद्र नारायणाय नमः
            </p>
            {/* Premium temple name — Playfair Display, animated gold gradient — BIGGER */}
            <h1 className="text-[28px] lg:text-[32px] font-heading font-black leading-[1.05] tracking-[0.02em] whitespace-nowrap" style={{
              background: "linear-gradient(90deg, #8B6914 0%, #C5973E 12%, #F5E17D 28%, #FFD700 42%, #F5E17D 55%, #E8C34A 68%, #C5973E 82%, #8B6914 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 5s ease-in-out infinite",
              filter: "drop-shadow(0 1px 3px rgba(139,105,20,0.35))",
            }}>
              Rudra Narayana
            </h1>
            {/* Ornamental gold divider with center diamond */}
            <div className="flex items-center gap-1.5 my-[4px]">
              <div className="flex-1 h-[1.5px]" style={{
                background: "linear-gradient(90deg, transparent 0%, #C5973E 30%, #E8C34A 100%)",
              }} />
              <div className="w-[6px] h-[6px] rotate-45 bg-gradient-to-br from-[#F5E17D] to-[#C5973E] rounded-[1px] flex-shrink-0 shadow-[0_0_4px_rgba(197,151,62,0.5)]" />
              <div className="flex-1 h-[1.5px]" style={{
                background: "linear-gradient(90deg, #E8C34A 0%, #C5973E 70%, transparent 100%)",
              }} />
            </div>
            {/* Subtitle — Cormorant Garamond, wide tracking, gold shimmer — BIGGER */}
            <p className="text-[15px] lg:text-[16px] font-accent font-bold tracking-[0.4em] uppercase leading-none" style={{
              background: "linear-gradient(90deg, #9B7730 0%, #C5973E 18%, #F0D060 36%, #E8C34A 50%, #F0D060 64%, #C5973E 82%, #9B7730 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s ease-in-out infinite",
            }}>
              Hindu Temple
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:gap-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:text-temple-red ${
                isActive(item.href)
                  ? "text-temple-maroon"
                  : "text-gray-700 hover:bg-temple-gold/10"
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-gradient-to-r from-temple-gold via-temple-red to-temple-gold" />
              )}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Donate Button */}
          <Link
            href="/donate"
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C5973E] via-[#E8C34A] to-[#C5973E] px-4 py-2 text-sm font-bold text-white shadow-[0_2px_12px_rgba(197,151,62,0.4)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(197,151,62,0.6)] hover:-translate-y-0.5 active:scale-[0.97] animate-gold-shimmer"
          >
            <Heart className="h-4 w-4 fill-white" />
            <span>Donate</span>
          </Link>
          <Link
            href="/donate"
            className="sm:hidden flex items-center justify-center rounded-full bg-gradient-to-r from-[#C5973E] via-[#E8C34A] to-[#C5973E] p-2 shadow-[0_2px_12px_rgba(197,151,62,0.4)]"
            aria-label="Donate"
          >
            <Heart className="h-4 w-4 fill-white text-white" />
          </Link>

          {/* Language Picker */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="hidden sm:flex items-center gap-1 rounded-lg p-2 text-temple-maroon/60 transition-colors hover:bg-temple-gold/15 hover:text-temple-maroon"
              title="Language"
              aria-label="Select language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">{locale}</span>
            </button>
            {showLangPicker && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-temple-gold/20 bg-white py-1 shadow-premium animate-slide-down">
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLocale(code);
                        setShowLangPicker(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-temple-cream ${
                        locale === code
                          ? "font-semibold text-temple-red bg-temple-cream/50"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="w-8 text-xs text-gray-400 uppercase">
                        {code}
                      </span>
                      {name}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-temple-maroon/60 transition-colors hover:bg-temple-gold/15 hover:text-temple-maroon"
            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-temple-red text-[10px] font-bold text-white animate-scale-in">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Profile / Dashboard */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-temple-maroon/70 transition-colors hover:bg-temple-gold/15 hover:text-temple-maroon"
            aria-label={isAuthenticated ? "Dashboard" : "Sign in"}
          >
            {isAuthenticated ? (
              <>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-temple-gold/15 text-[10px] font-bold text-temple-gold">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-temple-maroon max-w-[80px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                <span className="text-sm">Sign in</span>
              </>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-temple-maroon/70 transition-colors hover:bg-temple-gold/15 lg:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Hanging temple bells */}
      <HangingBells />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[61px] z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-[61px] z-50 border-t border-temple-gold/10 bg-white lg:hidden max-h-[calc(100vh-61px)] overflow-y-auto animate-slide-down">
            <div className="px-4 py-2">
              {/* Prominent mobile donate button */}
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5973E] via-[#E8C34A] to-[#C5973E] px-4 py-3 mb-2 text-base font-bold text-white shadow-md"
              >
                <Heart className="h-5 w-5 fill-white" />
                Donate Now
              </Link>
              {mobileNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-temple-cream ${
                    isActive(item.href)
                      ? "text-temple-red bg-temple-cream/50"
                      : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Mobile language picker */}
            <div className="border-t border-temple-gold/10 px-4 py-4">
              <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                <Globe className="h-3 w-3" /> Language
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLocale(code);
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        locale === code
                          ? "bg-temple-red text-white"
                          : "bg-temple-cream text-gray-600 hover:bg-temple-cream-dark"
                      }`}
                    >
                      {name}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
