import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      signInWithOtp: vi.fn(),
      verifyOtp: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

vi.mock("@/store/language", () => ({
  useLanguageStore: (sel: any) => {
    const s = { locale: "en", setLocale: vi.fn() };
    return typeof sel === "function" ? sel(s) : s;
  },
}));

vi.mock("@/components/hero/HeroSlideshow", () => ({
  HeroSlideshow: () => <div data-testid="hero-slideshow" />,
}));
vi.mock("@/components/home/StaticHeroImages", () => ({
  StaticHeroImages: () => (
    <section data-testid="static-hero">A Sacred Space for Every Devotee</section>
  ),
}));
vi.mock("@/components/home/HomeTempleCalendar", () => ({
  HomeTempleCalendar: () => (
    <section data-testid="temple-calendar">
      <h2>Upcoming Events & Festivals</h2>
      <p>Next Up</p>
    </section>
  ),
}));
vi.mock("@/components/home/NewsAndUpdates", () => ({
  NewsAndUpdates: () => (
    <section data-testid="news-updates">
      <h2>News & Updates</h2>
    </section>
  ),
}));
vi.mock("@/components/home/ServiceAreas", () => ({
  ServiceAreas: () => (
    <section data-testid="service-areas">Serving All of Texas</section>
  ),
}));
vi.mock("@/components/home/ReadyToBookPriests", () => ({
  ReadyToBookPriests: () => (
    <div data-testid="ready-to-book-priests">priest cards</div>
  ),
}));
vi.mock("@/components/services/ServiceCard", () => ({
  ServiceCard: ({ service }: any) => (
    <div data-testid="service-card">{service.name}</div>
  ),
}));

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the hero slideshow", () => {
    render(<HomePage />);
    expect(screen.getByTestId("hero-slideshow")).toBeInTheDocument();
  });

  it("renders the new static-image sacred-space section", () => {
    render(<HomePage />);
    expect(screen.getByTestId("static-hero")).toBeInTheDocument();
    expect(
      screen.getByText("A Sacred Space for Every Devotee")
    ).toBeInTheDocument();
  });

  it("renders the temple calendar + News & Updates sections", () => {
    render(<HomePage />);
    expect(screen.getByTestId("temple-calendar")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Events & Festivals")).toBeInTheDocument();
    expect(screen.getByText("Next Up")).toBeInTheDocument();
    expect(screen.getByTestId("news-updates")).toBeInTheDocument();
    expect(screen.getByText("News & Updates")).toBeInTheDocument();
  });

  it("renders the Service Areas section and Ready-to-Book priest cards", () => {
    render(<HomePage />);
    expect(screen.getByTestId("service-areas")).toBeInTheDocument();
    expect(screen.getByText("Serving All of Texas")).toBeInTheDocument();
    expect(screen.getByTestId("ready-to-book-priests")).toBeInTheDocument();
  });

  it("renders the Quick Info bar with address + phone (but no temple hours)", () => {
    render(<HomePage />);
    expect(screen.getByText("Georgetown, TX 78628")).toBeInTheDocument();
    expect(screen.getByText("(512) 545-0473")).toBeInTheDocument();
    // Temple hours were intentionally removed from the home page
    expect(screen.queryByText(/9 AM . 12 PM/)).not.toBeInTheDocument();
    expect(screen.queryByText(/9 AM - 12 PM/)).not.toBeInTheDocument();
  });

  it("does NOT render the falling-petals control or the old PanchangamWidget", () => {
    render(<HomePage />);
    expect(
      screen.queryByRole("button", { name: /falling petals/i })
    ).not.toBeInTheDocument();
    // "Daily Panchangam" would be the widget header; only the footer link
    // (if any) is outside <main>.
    expect(screen.queryByTestId("panchangam-widget")).not.toBeInTheDocument();
  });

  it("renders 4 featured service cards", () => {
    render(<HomePage />);
    expect(screen.getAllByTestId("service-card").length).toBe(4);
  });

  it("renders the 'Ready to Book a Pooja' CTA section", () => {
    render(<HomePage />);
    expect(screen.getByText(/Ready to Book a Pooja\?/)).toBeInTheDocument();
  });
});
