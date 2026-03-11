"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useLanguageStore } from "@/store/language";
import { localeNames, type Locale } from "@/lib/i18n/translations";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  {
    name: "Temple",
    href: "#",
    children: [
      { name: "Daily Panchangam", href: "/panchangam" },
      { name: "Events Calendar", href: "/calendar" },
      { name: "Live Darshan", href: "/streaming" },
      { name: "Gallery", href: "/gallery" },
      { name: "Our Priests", href: "/priests" },
    ],
  },
  {
    name: "Community",
    href: "#",
    children: [
      { name: "Volunteer & Annadanam", href: "/community" },
      { name: "Education & Classes", href: "/education" },
      { name: "Sponsorship & Packages", href: "/sponsorship" },
    ],
  },
  { name: "Donate", href: "/donate" },
  {
    name: "About",
    href: "#",
    children: [
      { name: "Financial Transparency", href: "/transparency" },
    ],
  },
];

const mobileNavItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Daily Panchangam", href: "/panchangam" },
  { name: "Events Calendar", href: "/calendar" },
  { name: "Live Darshan", href: "/streaming" },
  { name: "Gallery", href: "/gallery" },
  { name: "Our Priests", href: "/priests" },
  { name: "Volunteer & Annadanam", href: "/community" },
  { name: "Education & Classes", href: "/education" },
  { name: "Sponsorship & Packages", href: "/sponsorship" },
  { name: "Donate", href: "/donate" },
  { name: "Financial Transparency", href: "/transparency" },
  { name: "My Profile", href: "/profile" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const itemCount = useCartStore((s) => s.items.length);
  const { locale, setLocale } = useLanguageStore();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-temple-red text-white font-heading font-bold text-lg">
            R
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-heading font-bold text-temple-maroon leading-tight">
              Rudra Narayana
            </p>
            <p className="text-xs text-gray-500">Hindu Temple - Las Vegas</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-temple-red">
                  {item.name}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openDropdown === item.name && (
                  <div className="absolute left-0 top-full z-50 mt-0 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-temple-red"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-temple-red"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language Picker */}
          <div className="relative">
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="hidden sm:flex items-center gap-1 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              title="Language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">{locale}</span>
            </button>
            {showLangPicker && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {(Object.entries(localeNames) as [Locale, string][]).map(
                  ([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLocale(code);
                        setShowLangPicker(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
                        locale === code
                          ? "font-semibold text-temple-red"
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
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-temple-red"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-temple-red text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Profile / Login */}
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-temple-red"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-2 lg:hidden max-h-[70vh] overflow-y-auto">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              {item.name}
            </Link>
          ))}
          {/* Mobile language picker */}
          <div className="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
            <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
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
                    className={`rounded-full px-3 py-1 text-xs ${
                      locale === code
                        ? "bg-temple-red text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {name}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
