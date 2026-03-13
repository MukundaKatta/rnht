import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin",
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
vi.mock("@/store/slideshow", () => ({ useSlideshowStore: (sel: any) => { const s = { slides: [], loading: false, fetchSlides: vi.fn(), addSlide: vi.fn(), updateSlide: vi.fn(), removeSlide: vi.fn(), reorderSlides: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));

import AdminDashboard from "@/app/admin/page";

describe("AdminDashboard", () => {
  it("renders without crashing", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("shows dashboard description", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Manage temple services, bookings, and events")).toBeInTheDocument();
  });

  it("displays stat cards", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    expect(screen.getByText("Revenue (MTD)")).toBeInTheDocument();
    expect(screen.getByText("Active Services")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("$3,245")).toBeInTheDocument();
  });

  it("shows change indicators", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("+12% from last month")).toBeInTheDocument();
    expect(screen.getByText("+8% from last month")).toBeInTheDocument();
  });

  it("renders quick link cards", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Hero Slideshow")).toBeInTheDocument();
    expect(screen.getByText("Manage Services")).toBeInTheDocument();
    expect(screen.getByText("View Bookings")).toBeInTheDocument();
    expect(screen.getByText("Manage Events")).toBeInTheDocument();
  });

  it("has correct quick link hrefs", () => {
    render(<AdminDashboard />);
    const slideshowLink = screen.getByText("Hero Slideshow").closest("a");
    expect(slideshowLink).toHaveAttribute("href", "/admin/slideshow");
    const servicesLink = screen.getByText("Manage Services").closest("a");
    expect(servicesLink).toHaveAttribute("href", "/admin/services");
    const bookingsLink = screen.getByText("View Bookings").closest("a");
    expect(bookingsLink).toHaveAttribute("href", "/admin/bookings");
    const eventsLink = screen.getByText("Manage Events").closest("a");
    expect(eventsLink).toHaveAttribute("href", "/admin/events");
  });

  it("shows recent bookings table", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Recent Bookings")).toBeInTheDocument();
    expect(screen.getByText("View all")).toBeInTheDocument();
  });

  it("shows booking table headers", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Booking ID")).toBeInTheDocument();
    // "Service" appears multiple times (header + quick links)
    const serviceHeaders = screen.getAllByText("Service");
    expect(serviceHeaders.length).toBeGreaterThanOrEqual(1);
  });

  it("displays booking rows", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("RNHT-A1B2C")).toBeInTheDocument();
    expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    expect(screen.getByText("Ramesh Kumar")).toBeInTheDocument();
  });

  it("shows booking status badges", () => {
    render(<AdminDashboard />);
    expect(screen.getAllByText("confirmed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("completed").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("shows today's schedule section", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Today's Schedule")).toBeInTheDocument();
    expect(screen.getByText("Temple Opening & Morning Aarti")).toBeInTheDocument();
    expect(screen.getByText("Temple Closing")).toBeInTheDocument();
  });

  it("distinguishes booking items in schedule", () => {
    render(<AdminDashboard />);
    const bookingBadges = screen.getAllByText("Booking");
    expect(bookingBadges.length).toBe(2);
  });
});
