import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceDetailModal } from "@/components/services/ServiceDetailModal";
import type { Service } from "@/types/database";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: () => ({ data: null }) }) }),
    }),
  },
}));

vi.mock("@/store/panditji", () => ({
  usePanditjiWhatsApp: () => "https://wa.me/15125450473",
}));

function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: "svc-1",
    category_id: "cat-2",
    name: "Ganapathi Homam",
    slug: "ganapathi-homam",
    short_description: "Offering to Lord Ganesha",
    full_description: "A traditional fire ritual performed to invoke Lord Ganesha.",
    significance: "Removes obstacles and brings wisdom",
    items_to_bring: null,
    whats_included: null,
    image_url: null,
    price: null,
    price_type: "custom",
    price_tiers: null,
    suggested_donation: null,
    duration_minutes: 60,
    location_type: "at_temple",
    is_active: true,
    sort_order: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  } as unknown as Service;
}

describe("ServiceDetailModal", () => {
  let onClose: () => void;

  beforeEach(() => {
    onClose = vi.fn() as unknown as () => void;
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders as a dialog with the service name", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ganapathi Homam", level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the full description if present, else the short description", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    expect(
      screen.getByText(
        "A traditional fire ritual performed to invoke Lord Ganesha."
      )
    ).toBeInTheDocument();

    onClose = vi.fn() as unknown as () => void;
    render(
      <ServiceDetailModal
        service={makeService({ full_description: null })}
        onClose={onClose}
      />
    );
    // Two dialogs are mounted after the second render; assert we can find
    // the short description somewhere on the page.
    expect(
      screen.getAllByText("Offering to Lord Ganesha").length
    ).toBeGreaterThan(0);
  });

  it("renders the spiritual significance block when provided", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    expect(screen.getByText("Spiritual Significance")).toBeInTheDocument();
    expect(
      screen.getByText("Removes obstacles and brings wisdom")
    ).toBeInTheDocument();
  });

  it("shows 'Contact Panditji for details' with WhatsApp and phone CTAs", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    expect(
      screen.getByText(/Contact Panditji for details/i)
    ).toBeInTheDocument();

    const waLink = screen.getByRole("link", { name: /whatsapp panditji/i });
    expect(waLink.getAttribute("href")).toContain("https://wa.me/15125450473");

    const callLink = screen.getByRole("link", { name: /call.*545-0473/i });
    expect(callLink.getAttribute("href")).toBe("tel:+15125450473");
  });

  it("does not render any pricing, duration, location, or booking form UI", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    expect(screen.queryByText(/Pricing/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Book Online/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Add to Cart/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/What's Included/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Items to Bring/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/minutes/)).not.toBeInTheDocument();
    expect(screen.queryByText(/At Temple/i)).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is pressed", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    render(<ServiceDetailModal service={makeService()} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll while open and restores it on unmount", () => {
    const { unmount } = render(
      <ServiceDetailModal service={makeService()} onClose={onClose} />
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
