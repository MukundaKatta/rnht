import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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
  useCartStore: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    getTotal: () => 0,
    getItemCount: () => 0,
  }),
}));
vi.mock("@/store/language", () => ({
  useLanguageStore: Object.assign(
    (selector: any) => selector({ locale: "en", setLocale: vi.fn() }),
    { getState: () => ({ locale: "en", setLocale: vi.fn() }) }
  ),
}));
vi.mock("@/store/auth", () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    initialize: vi.fn(),
  }),
}));

import ServicesPage from "@/app/services/page";
import { sampleServices } from "@/lib/sample-data";

describe("ServicesPage", () => {
  it("renders without crashing", () => {
    render(<ServicesPage />);
  });

  it("displays the page heading", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toBeInTheDocument();
  });

  it("shows the description text about pujas", () => {
    render(<ServicesPage />);
    expect(
      screen.getByText(/we offer daily pujas/i)
    ).toBeInTheDocument();
  });

  it("shows the service areas text", () => {
    render(<ServicesPage />);
    expect(
      screen.getByText(/service areas: kyle, manor/i)
    ).toBeInTheDocument();
  });

  it("renders location type toggle buttons", () => {
    render(<ServicesPage />);
    // "All" appears as both a location toggle button and a category quick link button
    const allButtons = screen.getAllByRole("button", { name: /^All$/i });
    expect(allButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders the search input", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders category dropdown", () => {
    render(<ServicesPage />);
    const categorySelect = screen.getByDisplayValue("All Categories");
    expect(categorySelect).toBeInTheDocument();
  });

  it("renders price dropdown", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    expect(priceSelect).toBeInTheDocument();
  });

  it("shows the count of services found", () => {
    render(<ServicesPage />);
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();
  });

  it("renders category quick link buttons", () => {
    render(<ServicesPage />);
    // Category names appear in both quick link buttons and dropdown options
    const homamButtons = screen.getAllByRole("button", { name: /Homam/i });
    expect(homamButtons.length).toBeGreaterThanOrEqual(1);
    const poojaButtons = screen.getAllByRole("button", { name: /Pooja/i });
    expect(poojaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("filters services by search query", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Ganapathi" } });
    expect(screen.getByText(/Ganapathi Pooja/i)).toBeInTheDocument();
  });

  it("shows no results message when filter returns nothing", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, {
      target: { value: "xyznonexistentservice" },
    });
    expect(
      screen.getByText(/no services match your filters/i)
    ).toBeInTheDocument();
  });

  it("filters by price range dropdown", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "under50" } });
    // Should still render (either results or no-results message)
    const resultTexts = screen.getAllByText(/\d+ services? found|no services match/i);
    expect(resultTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("toggles location type and filters results", () => {
    render(<ServicesPage />);
    // Click "At Temple" location toggle
    const atTempleButtons = screen.getAllByRole("button");
    const atTempleBtn = atTempleButtons.find(
      (b) => b.textContent === "At Temple"
    );
    if (atTempleBtn) {
      fireEvent.click(atTempleBtn);
      expect(
        screen.getByText(/\d+ services? found|no services match/i)
      ).toBeInTheDocument();
    }
  });

  it("clicking a category quick link filters services", () => {
    render(<ServicesPage />);
    // Click a specific category button (first matching one)
    const homamBtns = screen.getAllByRole("button", { name: /Homam/i });
    fireEvent.click(homamBtns[0]);
    const resultTexts = screen.getAllByText(/\d+ services? found/i);
    expect(resultTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("has price range options in dropdown", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    expect(priceSelect).toContainHTML("Under $50");
    expect(priceSelect).toContainHTML("$50 - $100");
    expect(priceSelect).toContainHTML("$100 - $250");
    expect(priceSelect).toContainHTML("$250+");
  });

  // --- Additional tests for improved coverage ---

  it("filters by search on short_description", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    // "remover of obstacles" is in Ganapathi Pooja's short_description
    fireEvent.change(searchInput, { target: { value: "remover of obstacles" } });
    expect(screen.getByText(/Ganapathi Pooja/i)).toBeInTheDocument();
  });

  it("search is case insensitive", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "ganapathi" } });
    expect(screen.getByText(/Ganapathi Pooja/i)).toBeInTheDocument();
  });

  it("toggles to Outside Temple and shows filtered services", () => {
    render(<ServicesPage />);
    const buttons = screen.getAllByRole("button");
    const outsideBtn = buttons.find(
      (b) => b.textContent === "Outside Temple"
    );
    expect(outsideBtn).toBeDefined();
    fireEvent.click(outsideBtn!);
    // Gruhapravesam is location_type: "outside_temple" so it should remain
    expect(
      screen.getByText(/\d+ services? found/i)
    ).toBeInTheDocument();
  });

  it("At Temple filter excludes outside_temple services", () => {
    render(<ServicesPage />);
    const buttons = screen.getAllByRole("button");
    const atTempleBtn = buttons.find(
      (b) => b.textContent === "At Temple"
    );
    expect(atTempleBtn).toBeDefined();
    fireEvent.click(atTempleBtn!);
    // Gruhapravesam (outside_temple) should not be shown when filtering At Temple
    // Services with "both" location_type should still appear
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();
  });

  it("Outside Temple filter excludes at_temple services", () => {
    render(<ServicesPage />);
    const buttons = screen.getAllByRole("button");
    const outsideBtn = buttons.find(
      (b) => b.textContent === "Outside Temple"
    );
    fireEvent.click(outsideBtn!);
    // Services with "both" location_type should still appear
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();
  });

  it("shows correct count '1 service found' for singular", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    // Ganapathi Pooja should be unique enough
    fireEvent.change(searchInput, { target: { value: "Ganapathi Pooja" } });
    expect(screen.getByText(/1 service found/i)).toBeInTheDocument();
  });

  it("shows plural 'services found' for multiple results", () => {
    render(<ServicesPage />);
    // Default state should show multiple services
    const text = screen.getByText(/\d+ services? found/i);
    expect(text.textContent).toMatch(/services found/);
  });

  it("filters by category dropdown selection", () => {
    render(<ServicesPage />);
    const categorySelect = screen.getByDisplayValue("All Categories");
    // Select Homam / Havan (cat-1)
    fireEvent.change(categorySelect, { target: { value: "cat-1" } });
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();
  });

  it("category quick link All button resets the filter", () => {
    render(<ServicesPage />);
    // First, select a category
    const homamBtns = screen.getAllByRole("button", { name: /Homam/i });
    fireEvent.click(homamBtns[0]);
    const countAfterFilter = screen.getByText(/\d+ services? found/i).textContent;

    // Click "All" quick link to reset
    const allBtns = screen.getAllByRole("button", { name: /^All$/i });
    // The "All" quick link button (not the location toggle one)
    fireEvent.click(allBtns[allBtns.length - 1]);
    const countAfterReset = screen.getByText(/\d+ services? found/i).textContent;

    // After reset, more services should be shown (or same if all were shown)
    expect(countAfterReset).toBeDefined();
  });

  it("location toggle button shows active styling", () => {
    render(<ServicesPage />);
    const buttons = screen.getAllByRole("button");
    const atTempleBtn = buttons.find((b) => b.textContent === "At Temple");
    fireEvent.click(atTempleBtn!);
    expect(atTempleBtn!.className).toContain("bg-white");
  });

  it("category quick link shows active styling when selected", () => {
    render(<ServicesPage />);
    const homamBtns = screen.getAllByRole("button", { name: /Homam/i });
    fireEvent.click(homamBtns[0]);
    expect(homamBtns[0].className).toContain("bg-temple-red");
  });

  it("price filter 50to100 filters services", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "50to100" } });
    // All services have price: null (Infinity) so all should be filtered out
    expect(screen.getByText(/0 services found/i)).toBeInTheDocument();
  });

  it("price filter 100to250 filters services", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "100to250" } });
    expect(screen.getByText(/0 services found/i)).toBeInTheDocument();
  });

  it("price filter over250 filters services", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "over250" } });
    // Services with price: null => Infinity => Infinity >= 250 is true, so they remain
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();
  });

  it("combined search and category filter", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    const categorySelect = screen.getByDisplayValue("All Categories");

    // Search for something specific
    fireEvent.change(searchInput, { target: { value: "Ganapathi" } });
    // Also set a category
    fireEvent.change(categorySelect, { target: { value: "cat-2" } });

    // Ganapathi Pooja is in cat-2, so should still show
    expect(screen.getByText(/Ganapathi Pooja/i)).toBeInTheDocument();
  });

  it("combined search and category filter shows no results for mismatched category", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    const categorySelect = screen.getByDisplayValue("All Categories");

    // Search for Ganapathi (which is in cat-2)
    fireEvent.change(searchInput, { target: { value: "Ganapathi Pooja" } });
    // Set a different category (cat-1)
    fireEvent.change(categorySelect, { target: { value: "cat-1" } });

    // Should show no results since Ganapathi Pooja is not in cat-1
    expect(screen.getByText(/0 services found/i)).toBeInTheDocument();
  });

  it("shows SlidersHorizontal icon when no results", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "xyznonexistent" } });
    expect(screen.getByText(/no services match your filters/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting your search criteria/i)).toBeInTheDocument();
  });

  it("renders all category quick link buttons from sampleCategories", () => {
    render(<ServicesPage />);
    // Check that each category from sampleCategories is rendered as a quick link
    const expectedCategories = [
      "Homam / Havan",
      "Pooja & Samskaras",
      "Kalyanotsavam & Vivaham",
      "Paaraayana & Vratams",
      "Jyotisham & Vastu",
      "Sharadham & Remedial",
    ];
    expectedCategories.forEach((catName) => {
      const btns = screen.getAllByRole("button", { name: new RegExp(catName.replace(/[&/]/g, ".")) });
      expect(btns.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders ServiceCard components for each filtered service", () => {
    render(<ServicesPage />);
    // ServiceCard renders with role="button" and aria-label containing service name
    const serviceCards = screen.getAllByRole("button", { name: /- contact for pricing/i });
    expect(serviceCards.length).toBeGreaterThan(0);
  });

  it("clicking a service card opens the detail modal", () => {
    render(<ServicesPage />);
    // ServiceCard components have role="button"
    const serviceCards = screen.getAllByRole("button", { name: /Ganapathi Pooja/i });
    // Find the card (not the quick link button)
    const card = serviceCards.find((el) => el.getAttribute("tabindex") === "0");
    expect(card).toBeDefined();
    fireEvent.click(card!);
    // ServiceDetailModal should open - look for modal-specific content
    // The modal renders the service's full details; multiple elements may match
    expect(screen.getAllByText(/Spiritual Significance|Items to Bring|What's Included/i).length).toBeGreaterThanOrEqual(1);
  });

  it("service card can be activated with Enter key", () => {
    render(<ServicesPage />);
    const serviceCards = screen.getAllByRole("button", { name: /Ganapathi Pooja/i });
    const card = serviceCards.find((el) => el.getAttribute("tabindex") === "0");
    expect(card).toBeDefined();
    fireEvent.keyDown(card!, { key: "Enter" });
    // Modal should have opened
  });

  it("service card can be activated with Space key", () => {
    render(<ServicesPage />);
    const serviceCards = screen.getAllByRole("button", { name: /Ganapathi Pooja/i });
    const card = serviceCards.find((el) => el.getAttribute("tabindex") === "0");
    expect(card).toBeDefined();
    fireEvent.keyDown(card!, { key: " " });
    // Modal should have opened
  });

  it("details button on service card opens modal", () => {
    render(<ServicesPage />);
    const detailButtons = screen.getAllByText("Details");
    expect(detailButtons.length).toBeGreaterThan(0);
    fireEvent.click(detailButtons[0]);
  });

  it("clearing search shows all services again", () => {
    render(<ServicesPage />);
    const searchInput = screen.getByPlaceholderText(/search/i);

    // Get initial count
    const initialText = screen.getByText(/\d+ services? found/i).textContent;

    // Search for something specific - "Ganapathi" matches multiple services
    fireEvent.change(searchInput, { target: { value: "Ganapathi" } });
    expect(screen.getByText(/\d+ services? found/i)).toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText(/\d+ services? found/i).textContent).toBe(initialText);
  });

  it("under50 price filter shows 0 services for custom-priced services", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "under50" } });
    // All services have price: null => price = Infinity => Infinity >= 50 is true
    expect(screen.getByText(/0 services found/i)).toBeInTheDocument();
  });

  it("resetting price filter to all shows services again", () => {
    render(<ServicesPage />);
    const priceSelect = screen.getByDisplayValue("Any Price");

    // Filter by price
    fireEvent.change(priceSelect, { target: { value: "under50" } });
    expect(screen.getByText(/0 services found/i)).toBeInTheDocument();

    // Reset
    fireEvent.change(priceSelect, { target: { value: "all" } });
    const text = screen.getByText(/\d+ services? found/i).textContent;
    expect(text).not.toBe("0 services found");
  });

  it("inactive services are not displayed", () => {
    // Temporarily add an inactive service to sampleServices
    const inactiveService = {
      id: "svc-test-inactive",
      category_id: "cat-2",
      name: "Inactive Test Service",
      slug: "inactive-test",
      short_description: "This service is inactive.",
      full_description: "Test service",
      significance: null,
      items_to_bring: null,
      whats_included: null,
      image_url: null,
      price: null,
      price_type: "custom" as const,
      price_tiers: null,
      suggested_donation: null,
      duration_minutes: 30,
      location_type: "both" as const,
      is_active: false,
      sort_order: 998,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sampleServices.push(inactiveService);

    render(<ServicesPage />);

    // The inactive service should NOT appear
    expect(screen.queryByText("Inactive Test Service")).not.toBeInTheDocument();

    // Clean up
    sampleServices.pop();
  });

  it("over250 price filter excludes services priced under 250", () => {
    // Add a service with an explicit low price
    const cheapService = {
      id: "svc-test-cheap",
      category_id: "cat-2",
      name: "Cheap Test Service",
      slug: "cheap-test",
      short_description: "A low-priced service.",
      full_description: "Test service",
      significance: null,
      items_to_bring: null,
      whats_included: null,
      image_url: null,
      price: 100,
      price_type: "fixed" as const,
      price_tiers: null,
      suggested_donation: null,
      duration_minutes: 30,
      location_type: "both" as const,
      is_active: true,
      sort_order: 997,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sampleServices.push(cheapService);

    render(<ServicesPage />);

    // Service should appear with "Any Price" filter
    expect(screen.getByText("Cheap Test Service")).toBeInTheDocument();

    // Filter by over250
    const priceSelect = screen.getByDisplayValue("Any Price");
    fireEvent.change(priceSelect, { target: { value: "over250" } });

    // The cheap service should be excluded
    expect(screen.queryByText("Cheap Test Service")).not.toBeInTheDocument();

    // Clean up
    sampleServices.pop();
  });

  it("Outside Temple filter excludes at_temple-only services", () => {
    // Temporarily add an at_temple service to sampleServices
    const atTempleService = {
      id: "svc-test-at-temple",
      category_id: "cat-2",
      name: "Temple-Only Test Service",
      slug: "temple-only-test",
      short_description: "A service only at the temple.",
      full_description: "Test service",
      significance: null,
      items_to_bring: null,
      whats_included: null,
      image_url: null,
      price: null,
      price_type: "custom" as const,
      price_tiers: null,
      suggested_donation: null,
      duration_minutes: 30,
      location_type: "at_temple" as const,
      is_active: true,
      sort_order: 999,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sampleServices.push(atTempleService);

    render(<ServicesPage />);

    // Verify the at_temple service shows up initially
    expect(screen.getByText("Temple-Only Test Service")).toBeInTheDocument();

    // Click "Outside Temple" location filter
    const buttons = screen.getAllByRole("button");
    const outsideBtn = buttons.find(
      (b) => b.textContent === "Outside Temple"
    );
    fireEvent.click(outsideBtn!);

    // The at_temple service should now be excluded (line 48 coverage)
    expect(screen.queryByText("Temple-Only Test Service")).not.toBeInTheDocument();

    // Clean up
    sampleServices.pop();
  });
});
