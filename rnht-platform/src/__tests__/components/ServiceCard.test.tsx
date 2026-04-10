import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Service } from "@/types/database";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Clock: (props: any) => <svg data-testid="clock-icon" {...props} />,
  MapPin: (props: any) => <svg data-testid="map-icon" {...props} />,
  MessageCircle: (props: any) => <svg data-testid="message-icon" {...props} />,
  X: (props: any) => <svg data-testid="x-icon" {...props} />,
  CheckCircle: (props: any) => <svg data-testid="check-icon" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="alert-icon" {...props} />,
  Phone: (props: any) => <svg data-testid="phone-icon" {...props} />,
}));

// Mock the ServiceDetailModal to isolate ServiceCard tests
vi.mock("@/components/services/ServiceDetailModal", () => ({
  ServiceDetailModal: ({ service, onClose }: any) => (
    <div data-testid="service-modal">
      <span>{service.name} Modal</span>
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

// Mock cart store
vi.mock("@/store/cart", () => ({
  useCartStore: vi.fn((selector: any) =>
    selector({
      items: [],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateItem: vi.fn(),
      clearCart: vi.fn(),
      getTotal: () => 0,
      getItemCount: () => 0,
    })
  ),
}));

const makeService = (overrides: Partial<Service> = {}): Service => ({
  id: "svc-1",
  category_id: "cat-homam",
  name: "Ganapathi Homam",
  slug: "ganapathi-homam",
  short_description: "Invoke Lord Ganesha's blessings for new beginnings",
  full_description: "Full description of the homam",
  significance: "Removes obstacles from your path",
  items_to_bring: null,
  whats_included: null,
  image_url: null,
  price: 151,
  price_type: "fixed",
  price_tiers: null,
  suggested_donation: null,
  duration_minutes: 60,
  location_type: "at_temple",
  is_active: true,
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe("ServiceCard", () => {
  it("renders the service name", () => {
    render(<ServiceCard service={makeService()} />);
    expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
  });

  it("renders the short description", () => {
    render(<ServiceCard service={makeService()} />);
    expect(screen.getByText("Invoke Lord Ganesha's blessings for new beginnings")).toBeInTheDocument();
  });

  it("renders the duration", () => {
    render(<ServiceCard service={makeService()} />);
    expect(screen.getByText("60 min")).toBeInTheDocument();
  });

  it("displays fixed price formatted as currency", () => {
    render(<ServiceCard service={makeService()} />);
    expect(screen.getByText("$151.00")).toBeInTheDocument();
  });

  it("displays tiered pricing with 'From' prefix", () => {
    render(
      <ServiceCard
        service={makeService({
          price_type: "tiered",
          price: null,
          price_tiers: [
            { name: "Basic", price: 51, description: "Basic package" },
            { name: "Premium", price: 151, description: "Premium package" },
          ],
        })}
      />
    );
    expect(screen.getByText("From $51.00")).toBeInTheDocument();
  });

  it("displays 'Contact for pricing' for tiered with no tiers", () => {
    render(
      <ServiceCard
        service={makeService({
          price_type: "tiered",
          price: null,
          price_tiers: [],
        })}
      />
    );
    expect(screen.getByText("Contact for pricing")).toBeInTheDocument();
  });

  it("displays donation-based pricing with suggested amount", () => {
    render(
      <ServiceCard
        service={makeService({
          price_type: "donation",
          price: null,
          suggested_donation: 21,
        })}
      />
    );
    expect(screen.getByText("Suggested: $21.00")).toBeInTheDocument();
  });

  it("displays 'Donation based' when no suggested donation", () => {
    render(
      <ServiceCard
        service={makeService({
          price_type: "donation",
          price: null,
          suggested_donation: null,
        })}
      />
    );
    expect(screen.getByText("Donation based")).toBeInTheDocument();
  });

  it("displays 'Contact for Pricing' for custom pricing", () => {
    render(
      <ServiceCard
        service={makeService({
          price_type: "custom",
          price: null,
        })}
      />
    );
    expect(screen.getByText("Contact for Pricing")).toBeInTheDocument();
  });

  it("shows 'At Temple' for at_temple location", () => {
    render(<ServiceCard service={makeService({ location_type: "at_temple" })} />);
    expect(screen.getByText("At Temple")).toBeInTheDocument();
  });

  it("shows 'Outside Temple' for outside_temple location", () => {
    render(<ServiceCard service={makeService({ location_type: "outside_temple" })} />);
    expect(screen.getByText("Outside Temple")).toBeInTheDocument();
  });

  it("shows 'At Temple / Outside' for both location", () => {
    render(<ServiceCard service={makeService({ location_type: "both" })} />);
    expect(screen.getByText("At Temple / Outside")).toBeInTheDocument();
  });

  it("renders category icon for homam", () => {
    const { container } = render(<ServiceCard service={makeService({ category_id: "cat-1" })} />);
    expect(container.textContent).toContain("\u{1F525}"); // fire emoji
  });

  it("renders default icon for unknown category", () => {
    const { container } = render(<ServiceCard service={makeService({ category_id: "cat-unknown" })} />);
    expect(container.textContent).toContain("\u{1F64F}"); // prayer emoji
  });

  it("has correct aria-label on the card", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    expect(card).toHaveAttribute("aria-label", "Ganapathi Homam - $151.00");
  });

  it("card is keyboard accessible with tabIndex", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("opens modal when card is clicked", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    fireEvent.click(card);
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();
  });

  it("opens modal on Enter key press", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    fireEvent.keyDown(card, { key: "Enter" });
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();
  });

  it("opens modal on Space key press", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    fireEvent.keyDown(card, { key: " " });
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();
  });

  it("opens modal when Details button is clicked", () => {
    render(<ServiceCard service={makeService()} />);
    const detailsButton = screen.getByText("Details");
    fireEvent.click(detailsButton);
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();
  });

  it("closes modal via onClose callback", () => {
    render(<ServiceCard service={makeService()} />);
    const card = screen.getByRole("button", { name: /Ganapathi Homam/ });
    fireEvent.click(card);
    expect(screen.getByTestId("service-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("service-modal")).not.toBeInTheDocument();
  });

  it("WhatsApp link has correct href with encoded message", () => {
    render(<ServiceCard service={makeService()} />);
    const whatsappLink = screen.getByLabelText("Book Ganapathi Homam via WhatsApp");
    expect(whatsappLink).toHaveAttribute("href");
    expect(whatsappLink.getAttribute("href")).toContain("https://wa.me/15125450473");
    expect(whatsappLink.getAttribute("href")).toContain("Ganapathi%20Homam");
  });

  it("WhatsApp link opens in new tab", () => {
    render(<ServiceCard service={makeService()} />);
    const whatsappLink = screen.getByLabelText("Book Ganapathi Homam via WhatsApp");
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("WhatsApp link click does not trigger card click", () => {
    render(<ServiceCard service={makeService()} />);
    const whatsappLink = screen.getByLabelText("Book Ganapathi Homam via WhatsApp");
    fireEvent.click(whatsappLink);
    // Modal should not open from WhatsApp click due to stopPropagation
    expect(screen.queryByTestId("service-modal")).not.toBeInTheDocument();
  });
});
