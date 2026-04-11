import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin",
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "bookings") {
        return {
          select: (_cols: string, opts?: { count?: string; head?: boolean }) => {
            if (opts?.head) {
              return Promise.resolve({ count: 47, error: null });
            }
            return {
              eq: () => ({
                gte: () => Promise.resolve({ data: [{ total_amount: 101 }, { total_amount: 51 }], error: null }),
              }),
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [
                      {
                        id: "booking-1",
                        devotee_name: "Ramesh Kumar",
                        booking_date: "2026-03-15",
                        total_amount: 101,
                        status: "confirmed",
                        services: { name: "Ganapathi Homam" },
                      },
                    ],
                    error: null,
                  }),
              }),
            };
          },
        };
      }
      if (table === "donations") {
        return {
          select: () => ({
            eq: () => ({
              gte: () =>
                Promise.resolve({ data: [{ amount: 200 }, { amount: 150 }], error: null }),
            }),
          }),
        };
      }
      if (table === "services") {
        return {
          select: (_cols: string, opts?: { count?: string; head?: boolean }) => {
            if (opts?.head) {
              return {
                eq: () => Promise.resolve({ count: 12, error: null }),
              };
            }
            return Promise.resolve({ data: [], error: null });
          },
        };
      }
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      };
    },
  },
}));

import AdminDashboard from "@/app/admin/page";

describe("Admin dashboard", () => {
  it("renders the dashboard heading and description", () => {
    render(<AdminDashboard />);
    expect(
      screen.getByRole("heading", { name: /Admin Dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Manage temple services/i)).toBeInTheDocument();
  });

  it("renders the four stat cards", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    });
    expect(screen.getByText("Donations (YTD)")).toBeInTheDocument();
    expect(screen.getByText("Service Revenue (YTD)")).toBeInTheDocument();
    expect(screen.getByText("Active Services")).toBeInTheDocument();
  });

  it("renders real numbers from Supabase", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      // 47 bookings total
      expect(screen.getByText("47")).toBeInTheDocument();
    });
    // Active services count from the services.head query
    expect(screen.getByText("12")).toBeInTheDocument();
    // Donation sum 200 + 150 = $350.00
    expect(screen.getByText("$350.00")).toBeInTheDocument();
    // Service sum 101 + 51 = $152.00
    expect(screen.getByText("$152.00")).toBeInTheDocument();
  });

  it("renders quick links to the major admin areas", async () => {
    render(<AdminDashboard />);
    expect(screen.getByRole("link", { name: /News & Updates/i })).toHaveAttribute(
      "href",
      "/admin/news"
    );
    expect(screen.getByRole("link", { name: /Manage Services/i })).toHaveAttribute(
      "href",
      "/admin/services"
    );
    expect(screen.getByRole("link", { name: /Donations/i, exact: false } as any)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Volunteers/i })).toHaveAttribute(
      "href",
      "/admin/volunteers"
    );
  });

  it("renders the most recent booking from the DB", async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    expect(screen.getByText("Ramesh Kumar")).toBeInTheDocument();
    expect(screen.getByText("$101.00")).toBeInTheDocument();
  });
});
