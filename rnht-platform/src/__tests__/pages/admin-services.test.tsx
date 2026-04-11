import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/admin/services",
  useSearchParams: () => new URLSearchParams(),
}));

const servicesMock = [
  {
    id: "svc-1",
    category_id: "cat-1",
    name: "Ganapathi Homam",
    slug: "ganapathi-homam",
    short_description: "Fire ritual for Lord Ganesha",
    full_description: "Traditional homam",
    significance: "Removes obstacles",
    is_active: true,
    sort_order: 1,
  },
];

const categoriesMock = [
  { id: "cat-1", name: "Homam / Havan", slug: "homam", sort_order: 1 },
  { id: "cat-2", name: "Pooja & Samskaras", slug: "pooja", sort_order: 2 },
];

const updateCalls: Array<{ id: string; payload: Record<string, unknown> }> = [];
const insertCalls: Array<Record<string, unknown>> = [];

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "services") {
        return {
          select: () => ({
            order: () => ({
              order: () => Promise.resolve({ data: servicesMock, error: null }),
            }),
          }),
          update: (payload: Record<string, unknown>) => ({
            eq: (_col: string, id: string) => {
              updateCalls.push({ id, payload });
              return Promise.resolve({ error: null });
            },
          }),
          insert: (payload: Record<string, unknown>) => {
            insertCalls.push(payload);
            return Promise.resolve({ error: null });
          },
          delete: () => ({
            eq: () => Promise.resolve({ error: null }),
          }),
        };
      }
      if (table === "service_categories") {
        return {
          select: () => ({
            order: () => Promise.resolve({ data: categoriesMock, error: null }),
          }),
        };
      }
      return { select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) };
    },
  },
}));

import AdminServicesPage from "@/app/admin/services/page";

describe("Admin /admin/services", () => {
  beforeEach(() => {
    updateCalls.length = 0;
    insertCalls.length = 0;
  });

  it("renders the page heading and primary actions", async () => {
    render(<AdminServicesPage />);
    expect(
      screen.getByRole("heading", { name: /Manage Services/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add service/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /upload pdf/i })).toBeInTheDocument();
  });

  it("loads services from Supabase and renders them in a table", async () => {
    render(<AdminServicesPage />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    // Category resolved by id → name
    expect(screen.getByText("Homam / Havan")).toBeInTheDocument();
  });

  it("does NOT render price / duration / location columns (removed)", async () => {
    render(<AdminServicesPage />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    expect(screen.queryByText(/^Price$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Duration$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Location$/)).not.toBeInTheDocument();
  });

  it("opens the new-service form with only content fields (no price inputs)", async () => {
    render(<AdminServicesPage />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /add service/i }));

    expect(screen.getByRole("heading", { name: "New Service" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ganapathi Homam")).toBeInTheDocument();

    // Removed per product direction
    expect(screen.queryByText(/^Price$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Duration$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Location$/)).not.toBeInTheDocument();
  });

  it("inserts a new service with only the simplified fields", async () => {
    render(<AdminServicesPage />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /add service/i }));

    // "Ganapathi Homam" is the placeholder for the Name input.
    const nameInput = screen.getByPlaceholderText("Ganapathi Homam");
    fireEvent.change(nameInput, { target: { value: "Rudra Abhishekam" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(insertCalls.length).toBe(1);
    });
    const payload = insertCalls[0];
    expect(payload.name).toBe("Rudra Abhishekam");
    expect(payload.slug).toBe("rudra-abhishekam");
    expect(payload).not.toHaveProperty("price");
    expect(payload).not.toHaveProperty("duration_minutes");
    expect(payload).not.toHaveProperty("location_type");
  });

  it("toggles active state via the eye button", async () => {
    render(<AdminServicesPage />);
    await waitFor(() => {
      expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    });
    const hideBtn = screen.getByTitle("Hide");
    fireEvent.click(hideBtn);
    await waitFor(() => {
      expect(updateCalls.length).toBe(1);
    });
    expect(updateCalls[0].payload).toEqual({ is_active: false });
  });
});
