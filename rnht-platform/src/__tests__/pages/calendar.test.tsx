import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Pin "today" to mid-March 2026 so the calendar page lands on the month
// where the seeded sample events live (Ugadi 2026 = 2026-03-29 etc).
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));
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
          single: () => ({ data: null }),
          order: () => ({ data: [], limit: () => ({ data: [] }) }),
        }),
        order: () => ({ data: [] }),
      }),
      insert: () => ({ then: vi.fn() }),
      update: () => ({ eq: () => ({ then: vi.fn() }) }),
      delete: () => ({ eq: () => ({ then: vi.fn() }) }),
    }),
    storage: {
      from: () => ({
        upload: vi.fn(),
        getPublicUrl: () => ({
          data: { publicUrl: "https://example.com/img.jpg" },
        }),
      }),
    },
  },
}));

vi.mock("@/store/cart", () => ({
  useCartStore: (selector: any) => {
    const state = {
      items: [],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateItem: vi.fn(),
      clearCart: vi.fn(),
      getTotal: () => 0,
      getItemCount: () => 0,
    };
    return typeof selector === "function" ? selector(state) : state;
  },
}));
vi.mock("@/store/language", () => ({
  useLanguageStore: (selector: any) => {
    const state = { locale: "en", setLocale: vi.fn() };
    return typeof selector === "function" ? selector(state) : state;
  },
}));
vi.mock("@/store/auth", () => ({
  useAuthStore: (selector: any) => {
    const state = {
      isAuthenticated: false,
      user: null,
      authUser: null,
      bookings: [],
      donations: [],
      activities: [],
      initialize: vi.fn(),
      sendOtp: vi.fn(),
      verifyOtp: vi.fn(),
      logout: vi.fn(),
      addDonation: vi.fn(),
      addBooking: vi.fn(),
    };
    return typeof selector === "function" ? selector(state) : state;
  },
}));

import CalendarPage from "@/app/calendar/page";

describe("CalendarPage", () => {
  it("renders without crashing", () => {
    render(<CalendarPage />);
    expect(screen.getByText("Temple Calendar")).toBeInTheDocument();
  });

  it("displays the page heading and subtitle", () => {
    render(<CalendarPage />);
    expect(
      screen.getByRole("heading", { name: /temple calendar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/stay connected with festivals/i)
    ).toBeInTheDocument();
  });

  // Filter buttons
  it("renders all filter buttons", () => {
    render(<CalendarPage />);
    expect(screen.getByText("All Events")).toBeInTheDocument();
    expect(screen.getByText("Festivals")).toBeInTheDocument();
    expect(screen.getByText("Regular Poojas")).toBeInTheDocument();
    // "Community" appears as both a filter button and an event category badge
    const communityElements = screen.getAllByText("Community");
    expect(communityElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Classes")).toBeInTheDocument();
  });

  it("renders view toggle buttons", () => {
    render(<CalendarPage />);
    expect(screen.getByText("List")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });

  // Default list view (pinned to March 2026 — Ugadi is the March festival)
  it("shows list view by default with event cards", () => {
    render(<CalendarPage />);
    expect(screen.getByText("Ugadi Celebrations 2026")).toBeInTheDocument();
  });

  // Filtering
  it("filters events when Festivals button is clicked", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Festivals"));
    // March 2026 only contains Ugadi among the festival rows.
    expect(screen.getByText("Ugadi Celebrations 2026")).toBeInTheDocument();
  });

  it("filters events when Classes button is clicked", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Classes"));
    expect(
      screen.getByText("Yoga & Meditation Session")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Ugadi Celebrations 2026")
    ).not.toBeInTheDocument();
  });

  it("filters events when Community button is clicked", () => {
    render(<CalendarPage />);
    // "Community" appears as a filter button and as event category badges
    const communityElements = screen.getAllByText("Community");
    // Click the filter button (first one, which is the button in the filter bar)
    const communityButton = communityElements.find(
      (el) => el.tagName.toLowerCase() === "button"
    );
    fireEvent.click(communityButton!);
    expect(screen.getByText("Community Annadanam")).toBeInTheDocument();
    expect(
      screen.queryByText("Ugadi Celebrations 2026")
    ).not.toBeInTheDocument();
  });

  it("shows all events again when 'All Events' is clicked after filtering", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Festivals"));
    expect(
      screen.queryByText("Weekly Bhajan Sandhya")
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("All Events"));
    expect(screen.getByText("Weekly Bhajan Sandhya")).toBeInTheDocument();
    expect(screen.getByText("Ugadi Celebrations 2026")).toBeInTheDocument();
  });

  // Calendar view
  it("switches to calendar view when Calendar button is clicked", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));
    // Should show day-of-week headers
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
  });

  it("displays month and year in calendar view", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));
    const now = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const expectedHeading = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    expect(screen.getByText(expectedHeading)).toBeInTheDocument();
  });

  it("navigates to previous month in calendar view", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));

    const now = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const prevMonth =
      now.getMonth() === 0 ? 11 : now.getMonth() - 1;

    // Click left arrow
    fireEvent.click(screen.getByText("←"));
    expect(
      screen.getByText(new RegExp(monthNames[prevMonth]))
    ).toBeInTheDocument();
  });

  it("navigates to next month in calendar view", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));

    const now = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const nextMonth =
      now.getMonth() === 11 ? 0 : now.getMonth() + 1;

    fireEvent.click(screen.getByText("→"));
    expect(
      screen.getByText(new RegExp(monthNames[nextMonth]))
    ).toBeInTheDocument();
  });

  it("switches back to list view from calendar view", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));
    expect(screen.getByText("Sun")).toBeInTheDocument();
    fireEvent.click(screen.getByText("List"));
    expect(screen.queryByText("Sun")).not.toBeInTheDocument();
    expect(screen.getByText("Ugadi Celebrations 2026")).toBeInTheDocument();
  });

  it("hides list view when calendar view is active", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));
    // The list grid should not be rendered; day headers should be
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("wraps month navigation from January to December", () => {
    render(<CalendarPage />);
    fireEvent.click(screen.getByText("Calendar"));

    const now = new Date();
    // Click left arrow enough times to wrap around
    const clicksToJanuary = now.getMonth();
    for (let i = 0; i < clicksToJanuary; i++) {
      fireEvent.click(screen.getByText("←"));
    }
    expect(screen.getByText(/January/)).toBeInTheDocument();
    // One more click should go to December
    fireEvent.click(screen.getByText("←"));
    expect(screen.getByText(/December/)).toBeInTheDocument();
  });
});
