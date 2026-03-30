import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: { onAuthStateChange: vi.fn(), signInWithOtp: vi.fn().mockResolvedValue({ error: null }), verifyOtp: vi.fn().mockResolvedValue({ error: null }), signOut: vi.fn().mockResolvedValue({}), signInWithOAuth: vi.fn().mockResolvedValue({ error: null }) },
    from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }), order: () => ({ data: [], limit: () => ({ data: [] }) }) }), order: () => ({ data: [] }) }), insert: () => ({ then: vi.fn() }), update: () => ({ eq: () => ({ then: vi.fn() }) }), delete: () => ({ eq: () => ({ then: vi.fn() }) }) }),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ error: null }), getPublicUrl: () => ({ data: { publicUrl: "https://example.com/img.jpg" } }) }) },
  },
}));
vi.mock("@/store/cart", () => ({ useCartStore: (sel: any) => { const s = { items: [], addItem: vi.fn(), removeItem: vi.fn(), updateItem: vi.fn(), clearCart: vi.fn(), getTotal: () => 0, getItemCount: () => 0 }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/language", () => ({ useLanguageStore: (sel: any) => { const s = { locale: "en", setLocale: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/auth", () => ({ useAuthStore: (sel: any) => { const s = { isAuthenticated: false, user: null, authUser: null, bookings: [], donations: [], activities: [], loading: false, initialized: true, initialize: vi.fn(), sendOtp: vi.fn().mockResolvedValue({}), verifyOtp: vi.fn().mockResolvedValue({}), logout: vi.fn(), addDonation: vi.fn(), addBooking: vi.fn(), updateProfile: vi.fn(), addFamilyMember: vi.fn(), removeFamilyMember: vi.fn(), fetchUserData: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/slideshow", () => ({ useSlideshowStore: (sel: any) => { const s = { slides: [{ id: "1", type: "image", url: "https://example.com/img.jpg", title: "Test Slide", subtitle: "Test", ctaText: "Learn More", ctaLink: "/services", isActive: true, showText: true, sortOrder: 0 }], loading: false, fetchSlides: vi.fn(), addSlide: vi.fn(), updateSlide: vi.fn(), removeSlide: vi.fn(), reorderSlides: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));

vi.mock("@/components/slideshow/HeroSlideshow", () => ({ HeroSlideshow: () => <div data-testid="hero-slideshow" /> }));
vi.mock("@/components/panchangam/PanchangamWidget", () => ({ PanchangamWidget: () => <div data-testid="panchangam-widget" /> }));
vi.mock("@/components/services/ServiceCard", () => ({ ServiceCard: ({ service }: any) => <div data-testid="service-card">{service.name}</div> }));
vi.mock("@/components/calendar/EventCard", () => ({ EventCard: ({ event }: any) => <div data-testid="event-card">{event.title}</div> }));

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByText("Book a Pooja")).toBeInTheDocument();
  });

  it("renders the hero section with Book a Pooja button", () => {
    render(<HomePage />);
    expect(screen.getByText("Book a Pooja")).toBeInTheDocument();
  });

  it("renders the PanchangamWidget", () => {
    render(<HomePage />);
    expect(screen.getByTestId("panchangam-widget")).toBeInTheDocument();
  });

  it("shows quick info bar with location and phone", () => {
    render(<HomePage />);
    expect(screen.getByText("Georgetown, TX 78628")).toBeInTheDocument();
    expect(screen.getByText("(512) 545-0473")).toBeInTheDocument();
  });

  it("shows temple hours", () => {
    render(<HomePage />);
    expect(screen.getByText(/9 AM – 12 PM/)).toBeInTheDocument();
  });

  it("shows support the temple link", () => {
    render(<HomePage />);
    expect(screen.getByText("Support the Temple")).toBeInTheDocument();
  });

  it("displays trust stats section", () => {
    render(<HomePage />);
    expect(screen.getByText("Est. 2022")).toBeInTheDocument();
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("12+")).toBeInTheDocument();
    expect(screen.getByText("Serving the Community")).toBeInTheDocument();
    expect(screen.getByText("Vedic Services Offered")).toBeInTheDocument();
  });

  it("shows Our Sacred Services section", () => {
    render(<HomePage />);
    expect(screen.getByText("Our Sacred Services")).toBeInTheDocument();
    expect(screen.getByText(/Book authentic Vedic poojas/)).toBeInTheDocument();
  });

  it("shows service category links", () => {
    render(<HomePage />);
    expect(screen.getByText("Homam / Havan")).toBeInTheDocument();
    expect(screen.getByText("Pooja & Samskaras")).toBeInTheDocument();
  });

  it("shows Popular Services heading", () => {
    render(<HomePage />);
    expect(screen.getByText("Popular Services")).toBeInTheDocument();
  });

  it("renders featured service cards", () => {
    render(<HomePage />);
    const serviceCards = screen.getAllByTestId("service-card");
    expect(serviceCards.length).toBe(4);
  });

  it("shows View All Services link", () => {
    render(<HomePage />);
    const viewAllLink = screen.getByText("View All Services");
    expect(viewAllLink.closest("a")).toHaveAttribute("href", "/services");
  });

  it("shows Why Choose RNHT section", () => {
    render(<HomePage />);
    expect(screen.getByText("Why Choose RNHT")).toBeInTheDocument();
    expect(screen.getByText("Authentic Vedic Rituals")).toBeInTheDocument();
    // "Experienced Priests" appears in stats section and Why Choose section
    const expPriests = screen.getAllByText("Experienced Priests");
    expect(expPriests.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Home & Temple Services")).toBeInTheDocument();
    expect(screen.getByText("Personalized Attention")).toBeInTheDocument();
    expect(screen.getByText("Multilingual Priests")).toBeInTheDocument();
    expect(screen.getByText("Tax-Deductible Donations")).toBeInTheDocument();
  });

  it("shows testimonials section", () => {
    render(<HomePage />);
    expect(screen.getByText("What Devotees Say")).toBeInTheDocument();
    expect(screen.getByText("Srinivas R.")).toBeInTheDocument();
    expect(screen.getByText("Lakshmi P.")).toBeInTheDocument();
    expect(screen.getByText("Venkat K.")).toBeInTheDocument();
  });

  it("shows testimonial locations", () => {
    render(<HomePage />);
    expect(screen.getByText("Round Rock, TX")).toBeInTheDocument();
    expect(screen.getByText("Kyle, TX")).toBeInTheDocument();
    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
  });

  it("shows Explore RNHT quick links section", () => {
    render(<HomePage />);
    expect(screen.getByText("Explore RNHT")).toBeInTheDocument();
    expect(screen.getByText("Live Darshan")).toBeInTheDocument();
    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Volunteer")).toBeInTheDocument();
    expect(screen.getByText("Our Priests")).toBeInTheDocument();
    expect(screen.getByText("Sponsorship")).toBeInTheDocument();
    // "Dollar A Day" appears in quick links and CTA section
    const dollarADay = screen.getAllByText("Dollar A Day");
    expect(dollarADay.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Transparency")).toBeInTheDocument();
  });

  it("has correct quick link hrefs", () => {
    render(<HomePage />);
    expect(screen.getByText("Live Darshan").closest("a")).toHaveAttribute("href", "/streaming");
    expect(screen.getByText("Gallery").closest("a")).toHaveAttribute("href", "/gallery");
    expect(screen.getByText("Education").closest("a")).toHaveAttribute("href", "/education");
    expect(screen.getByText("Volunteer").closest("a")).toHaveAttribute("href", "/community");
  });

  it("shows upcoming events section", () => {
    render(<HomePage />);
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
    expect(screen.getByText("Full Calendar")).toBeInTheDocument();
  });

  it("renders event cards", () => {
    render(<HomePage />);
    const eventCards = screen.getAllByTestId("event-card");
    expect(eventCards.length).toBeGreaterThanOrEqual(1);
  });

  it("shows service areas section", () => {
    render(<HomePage />);
    expect(screen.getByText("Serving All of Texas")).toBeInTheDocument();
    expect(screen.getByText("Austin")).toBeInTheDocument();
    expect(screen.getByText("Kyle")).toBeInTheDocument();
    expect(screen.getByText("Round Rock")).toBeInTheDocument();
    expect(screen.getByText("San Antonio")).toBeInTheDocument();
    expect(screen.getByText("Dallas")).toBeInTheDocument();
    expect(screen.getByText("Houston")).toBeInTheDocument();
  });

  it("shows Dollar A Day CTA section", () => {
    render(<HomePage />);
    // Dollar A Day appears in quick links and CTA section
    expect(screen.getByText("$31/month — Join Now")).toBeInTheDocument();
    expect(screen.getByText("$365/year — Save $7")).toBeInTheDocument();
    expect(screen.getByText(/All donations are tax-deductible/)).toBeInTheDocument();
  });

  it("shows final CTA with WhatsApp and Donate", () => {
    render(<HomePage />);
    expect(screen.getByText("Ready to Book a Pooja?")).toBeInTheDocument();
    // "WhatsApp" appears in description text and button
    const whatsappMatches = screen.getAllByText(/WhatsApp/);
    expect(whatsappMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Donate Now")).toBeInTheDocument();
    expect(screen.getByText("Browse Services")).toBeInTheDocument();
  });

  it("WhatsApp link has correct href", () => {
    render(<HomePage />);
    // Find the WhatsApp link specifically (the anchor with WhatsApp text)
    const whatsappLinks = screen.getAllByText(/WhatsApp/);
    const whatsappLink = whatsappLinks
      .map((el) => el.closest("a"))
      .find((a) => a?.getAttribute("href")?.includes("wa.me"));
    expect(whatsappLink).toHaveAttribute("href", "https://wa.me/message/55G67NQ6CQENA1");
    expect(whatsappLink).toHaveAttribute("target", "_blank");
  });

  it("phone link has correct href", () => {
    render(<HomePage />);
    const phoneLink = screen.getByText("(512) 545-0473").closest("a");
    expect(phoneLink).toHaveAttribute("href", "tel:+15125450473");
  });
});
