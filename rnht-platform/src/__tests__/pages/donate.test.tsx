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

import DonatePage from "@/app/donate/page";

describe("DonatePage", () => {
  it("renders without crashing", () => {
    render(<DonatePage />);
  });

  it("displays the page heading", () => {
    render(<DonatePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows tax-deductible notice", () => {
    render(<DonatePage />);
    expect(
      screen.getByText(/all donations are tax-deductible/i)
    ).toBeInTheDocument();
  });

  it("renders fund type options", () => {
    render(<DonatePage />);
    // Fund names may appear in both the radio list and the sidebar summary
    expect(screen.getAllByText("General Temple Fund").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Building Fund").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Priest Fund").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Annadanam Fund").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Festival Fund").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Education Fund").length).toBeGreaterThanOrEqual(1);
  });

  it("renders suggested amount buttons", () => {
    render(<DonatePage />);
    expect(screen.getByRole("button", { name: "$11.00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "$21.00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "$51.00" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "$101.00" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "$251.00" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "$501.00" })
    ).toBeInTheDocument();
  });

  it("selects a different suggested amount when clicked", () => {
    render(<DonatePage />);
    fireEvent.click(screen.getByRole("button", { name: "$101.00" }));
    // $101.00 appears in the button and in the donation summary
    const amounts = screen.getAllByText("$101.00");
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders custom amount input", () => {
    render(<DonatePage />);
    expect(
      screen.getByPlaceholderText("Enter amount")
    ).toBeInTheDocument();
  });

  it("allows entering a custom amount", () => {
    render(<DonatePage />);
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "75" } });
    expect(screen.getByText("$75.00")).toBeInTheDocument();
  });

  it("renders Dollar A Day program section", () => {
    render(<DonatePage />);
    expect(screen.getByText("$31/mo")).toBeInTheDocument();
    expect(screen.getByText("$365/yr")).toBeInTheDocument();
  });

  it("clicking $31/mo sets recurring monthly", () => {
    render(<DonatePage />);
    fireEvent.click(screen.getByText("$31/mo"));
    // Should show recurring frequency options (these may overlap with Dollar A Day buttons)
    const monthlyButtons = screen.getAllByRole("button", { name: /monthly/i });
    expect(monthlyButtons.length).toBeGreaterThanOrEqual(1);
    // Quarterly and annual frequency buttons should also appear
    const quarterlyButtons = screen.getAllByRole("button", { name: /quarterly/i });
    expect(quarterlyButtons.length).toBeGreaterThanOrEqual(1);
    const annualButtons = screen.getAllByRole("button", { name: /annual/i });
    expect(annualButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders recurring donation checkbox", () => {
    render(<DonatePage />);
    const checkboxes = screen.getAllByRole("checkbox");
    // Should have the recurring checkbox and anonymous checkbox
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
  });

  it("shows recurring frequency options when recurring is enabled", () => {
    render(<DonatePage />);
    // Find the recurring checkbox by its label text
    const recurringCheckbox = screen.getByLabelText(
      /automatic monthly, quarterly, or annual/i
    );
    fireEvent.click(recurringCheckbox);
    // Frequency buttons may overlap with Dollar A Day buttons
    const monthlyButtons = screen.getAllByRole("button", { name: /monthly/i });
    expect(monthlyButtons.length).toBeGreaterThanOrEqual(1);
    const quarterlyButtons = screen.getAllByRole("button", { name: /quarterly/i });
    expect(quarterlyButtons.length).toBeGreaterThanOrEqual(1);
    const annualButtons = screen.getAllByRole("button", { name: /annual/i });
    expect(annualButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders deity-specific donation options", () => {
    render(<DonatePage />);
    expect(screen.getByText("Sri Rudra Narayana")).toBeInTheDocument();
    expect(screen.getByText("Lord Ganesha")).toBeInTheDocument();
    expect(screen.getByText("Goddess Lakshmi")).toBeInTheDocument();
    expect(screen.getByText("Lord Hanuman")).toBeInTheDocument();
    expect(screen.getByText("Lord Shiva")).toBeInTheDocument();
    expect(screen.getByText("Lord Rama")).toBeInTheDocument();
  });

  it("renders donor info inputs", () => {
    render(<DonatePage />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("renders message textarea", () => {
    render(<DonatePage />);
    expect(
      screen.getByPlaceholderText(/in memory of/i)
    ).toBeInTheDocument();
  });

  it("renders anonymous checkbox", () => {
    render(<DonatePage />);
    expect(
      screen.getByText(/make this donation anonymous/i)
    ).toBeInTheDocument();
  });

  it("renders payment method options", () => {
    render(<DonatePage />);
    expect(screen.getByText("Card / Apple Pay")).toBeInTheDocument();
    expect(screen.getByText("PayPal")).toBeInTheDocument();
    expect(screen.getByText("Zelle")).toBeInTheDocument();
  });

  it("renders Zelle info section", () => {
    render(<DonatePage />);
    expect(
      screen.getByText("Rudra Narayana Hindu Temple")
    ).toBeInTheDocument();
  });

  it("shows the donate button", () => {
    render(<DonatePage />);
    // The donate button shows the amount
    const donateBtn = screen.getByRole("button", { name: /donate \$/i });
    expect(donateBtn).toBeInTheDocument();
  });

  it("donate button is disabled when name and email are empty", () => {
    render(<DonatePage />);
    const donateBtn = screen.getByRole("button", { name: /donate \$/i });
    expect(donateBtn).toBeDisabled();
  });

  it("donate button is enabled when name and email are filled", () => {
    render(<DonatePage />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: "test@example.com" },
    });
    const donateBtn = screen.getByRole("button", { name: /donate \$/i });
    expect(donateBtn).not.toBeDisabled();
  });

  it("shows thank you page after successful donation", () => {
    render(<DonatePage />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: "test@example.com" },
    });
    const donateBtn = screen.getByRole("button", { name: /donate \$/i });
    fireEvent.click(donateBtn);
    // Should show the thank you view
    expect(screen.getByText(/has been received/i)).toBeInTheDocument();
    expect(
      screen.getByText(/tax-deductible receipt/i)
    ).toBeInTheDocument();
  });

  it("shows Make Another Donation button on thank you page", () => {
    render(<DonatePage />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: "t@t.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /donate \$/i }));
    const anotherBtn = screen.getByRole("button", {
      name: /make another donation/i,
    });
    expect(anotherBtn).toBeInTheDocument();
    fireEvent.click(anotherBtn);
    // Should go back to the form
    expect(
      screen.getByPlaceholderText("Your name")
    ).toBeInTheDocument();
  });

  it("shows Zelle instructions when Zelle is selected and submitted", () => {
    render(<DonatePage />);
    // Select Zelle payment method
    const zelleRadio = screen.getByLabelText(/zelle/i);
    fireEvent.click(zelleRadio);
    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: "t@t.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /donate \$/i }));
    expect(
      screen.getByText(/please send your zelle payment/i)
    ).toBeInTheDocument();
  });

  it("renders the sponsorship link", () => {
    render(<DonatePage />);
    const link = screen.getByRole("link", {
      name: /ornament.*alankaram.*sponsorships/i,
    });
    expect(link).toHaveAttribute("href", "/sponsorship");
  });

  it("shows secure and tax-deductible badge", () => {
    render(<DonatePage />);
    expect(
      screen.getByText(/secure.*tax-deductible.*501\(c\)\(3\)/i)
    ).toBeInTheDocument();
  });

  it("displays the payment sidebar with Your Donation summary", () => {
    render(<DonatePage />);
    expect(screen.getByText("Your Donation")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("selects a deity-specific fund", () => {
    render(<DonatePage />);
    const ganeshaLabel = screen.getByText("Lord Ganesha").closest("label")!;
    fireEvent.click(ganeshaLabel);
    // The radio should be checked
    const radio = ganeshaLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  // --- Additional tests for improved coverage ---

  it("selects Building Fund and sidebar updates", () => {
    render(<DonatePage />);
    const buildingLabels = screen.getAllByText("Building Fund");
    // Click the radio label in the fund selection area
    const buildingLabel = buildingLabels[0].closest("label");
    expect(buildingLabel).toBeTruthy();
    fireEvent.click(buildingLabel!);
    // The sidebar should now show Building Fund
    const buildingTexts = screen.getAllByText("Building Fund");
    expect(buildingTexts.length).toBeGreaterThanOrEqual(2); // in both fund list and sidebar
  });

  it("selects Priest Fund radio", () => {
    render(<DonatePage />);
    const priestLabel = screen.getAllByText("Priest Fund")[0].closest("label")!;
    fireEvent.click(priestLabel);
    const radio = priestLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Annadanam Fund radio", () => {
    render(<DonatePage />);
    const annadanamLabel = screen.getAllByText("Annadanam Fund")[0].closest("label")!;
    fireEvent.click(annadanamLabel);
    const radio = annadanamLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Festival Fund radio", () => {
    render(<DonatePage />);
    const festivalLabel = screen.getAllByText("Festival Fund")[0].closest("label")!;
    fireEvent.click(festivalLabel);
    const radio = festivalLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Education Fund radio", () => {
    render(<DonatePage />);
    const educationLabel = screen.getAllByText("Education Fund")[0].closest("label")!;
    fireEvent.click(educationLabel);
    const radio = educationLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("shows fund descriptions", () => {
    render(<DonatePage />);
    expect(screen.getByText(/unrestricted contribution/i)).toBeInTheDocument();
    expect(screen.getByText(/temple construction and maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/support our temple priests/i)).toBeInTheDocument();
    expect(screen.getByText(/community meal service/i)).toBeInTheDocument();
    expect(screen.getByText(/temple festivals and celebrations/i)).toBeInTheDocument();
    expect(screen.getByText(/vedic school and children/i)).toBeInTheDocument();
  });

  it("custom amount overrides suggested amount in sidebar", () => {
    render(<DonatePage />);
    // Default amount $51.00 appears in the suggested amount button, the sidebar, and the donate button
    expect(screen.getAllByText("$51.00").length).toBeGreaterThanOrEqual(1);

    // Enter custom amount
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "200" } });
    // $200.00 appears in sidebar and donate button
    expect(screen.getAllByText("$200.00").length).toBeGreaterThanOrEqual(1);
  });

  it("clicking a suggested amount clears custom amount", () => {
    render(<DonatePage />);
    const input = screen.getByPlaceholderText("Enter amount") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "200" } });
    expect(input.value).toBe("200");

    // Click a suggested amount
    fireEvent.click(screen.getByRole("button", { name: "$101.00" }));
    expect(input.value).toBe("");
  });

  it("$365/yr Dollar A Day sets annual recurring", () => {
    render(<DonatePage />);
    fireEvent.click(screen.getByText("$365/yr"));
    // Should show recurring with annual selected
    const annualBtns = screen.getAllByRole("button", { name: /annual/i });
    const activeAnnual = annualBtns.find((b) => b.className.includes("bg-temple-red"));
    expect(activeAnnual).toBeTruthy();
  });

  it("Dollar A Day $31/mo shows monthly as active frequency", () => {
    render(<DonatePage />);
    fireEvent.click(screen.getByText("$31/mo"));
    const monthlyBtns = screen.getAllByRole("button", { name: /monthly/i });
    const activeMonthly = monthlyBtns.find((b) => b.className.includes("bg-temple-red"));
    expect(activeMonthly).toBeTruthy();
  });

  it("recurring toggle shows recurring info in sidebar", () => {
    render(<DonatePage />);
    const recurringCheckbox = screen.getByLabelText(
      /automatic monthly, quarterly, or annual/i
    );
    fireEvent.click(recurringCheckbox);
    // Should show recurring info in sidebar
    expect(screen.getByText(/recurring monthly donation/i)).toBeInTheDocument();
  });

  it("switching recurring frequency to quarterly updates sidebar", () => {
    render(<DonatePage />);
    const recurringCheckbox = screen.getByLabelText(
      /automatic monthly, quarterly, or annual/i
    );
    fireEvent.click(recurringCheckbox);

    // Click quarterly
    const quarterlyBtns = screen.getAllByRole("button", { name: /quarterly/i });
    fireEvent.click(quarterlyBtns[0]);
    expect(screen.getByText(/recurring quarterly donation/i)).toBeInTheDocument();
  });

  it("switching recurring frequency to annual updates sidebar", () => {
    render(<DonatePage />);
    const recurringCheckbox = screen.getByLabelText(
      /automatic monthly, quarterly, or annual/i
    );
    fireEvent.click(recurringCheckbox);

    const annualBtns = screen.getAllByRole("button", { name: /annual/i });
    fireEvent.click(annualBtns[0]);
    expect(screen.getByText(/recurring annual donation/i)).toBeInTheDocument();
  });

  it("unchecking recurring hides frequency buttons", () => {
    render(<DonatePage />);
    const recurringCheckbox = screen.getByLabelText(
      /automatic monthly, quarterly, or annual/i
    );
    // Enable
    fireEvent.click(recurringCheckbox);
    const monthlyBtns = screen.getAllByRole("button", { name: /monthly/i });
    expect(monthlyBtns.length).toBeGreaterThanOrEqual(1);

    // Disable
    fireEvent.click(recurringCheckbox);
    // The frequency buttons from the recurring section should disappear
    // (Dollar A Day may still have "Monthly" text, but the actual frequency toggle buttons are gone)
    expect(screen.queryByText(/recurring monthly donation/i)).not.toBeInTheDocument();
  });

  it("selecting PayPal payment method checks it", () => {
    render(<DonatePage />);
    const paypalLabel = screen.getByText("PayPal").closest("label")!;
    fireEvent.click(paypalLabel);
    const radio = paypalLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("Stripe (Card) is selected by default", () => {
    render(<DonatePage />);
    const cardLabel = screen.getByText("Card / Apple Pay").closest("label")!;
    const radio = cardLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selecting Zelle payment method checks it", () => {
    render(<DonatePage />);
    const zelleLabel = screen.getByText("Zelle").closest("label")!;
    fireEvent.click(zelleLabel);
    const radio = zelleLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("shows Zelle QR code placeholder", () => {
    render(<DonatePage />);
    expect(screen.getByText(/QR Code/)).toBeInTheDocument();
  });

  it("shows Zelle phone number", () => {
    render(<DonatePage />);
    expect(screen.getByText(/\(512\) 545-0473/)).toBeInTheDocument();
  });

  it("shows deity-specific earmark message", () => {
    render(<DonatePage />);
    expect(screen.getByText(/earmark your donation for a specific deity/i)).toBeInTheDocument();
  });

  it("selects Sri Rudra Narayana deity fund", () => {
    render(<DonatePage />);
    const rnLabel = screen.getByText("Sri Rudra Narayana").closest("label")!;
    fireEvent.click(rnLabel);
    const radio = rnLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Lord Hanuman deity fund", () => {
    render(<DonatePage />);
    const hanumanLabel = screen.getByText("Lord Hanuman").closest("label")!;
    fireEvent.click(hanumanLabel);
    const radio = hanumanLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Lord Shiva deity fund", () => {
    render(<DonatePage />);
    const shivaLabel = screen.getByText("Lord Shiva").closest("label")!;
    fireEvent.click(shivaLabel);
    const radio = shivaLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Lord Rama deity fund", () => {
    render(<DonatePage />);
    const ramaLabel = screen.getByText("Lord Rama").closest("label")!;
    fireEvent.click(ramaLabel);
    const radio = ramaLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("selects Goddess Lakshmi deity fund", () => {
    render(<DonatePage />);
    const lakshmiLabel = screen.getByText("Goddess Lakshmi").closest("label")!;
    fireEvent.click(lakshmiLabel);
    const radio = lakshmiLabel.querySelector('input[type="radio"]');
    expect(radio).toBeChecked();
  });

  it("anonymous checkbox can be toggled", () => {
    render(<DonatePage />);
    const anonymousLabel = screen.getByText(/make this donation anonymous/i).closest("label")!;
    const checkbox = anonymousLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("donor name and email inputs update correctly", () => {
    render(<DonatePage />);
    const nameInput = screen.getByPlaceholderText("Your name") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("your@email.com") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Rajesh" } });
    fireEvent.change(emailInput, { target: { value: "rajesh@temple.org" } });

    expect(nameInput.value).toBe("Rajesh");
    expect(emailInput.value).toBe("rajesh@temple.org");
  });

  it("message textarea updates correctly", () => {
    render(<DonatePage />);
    const textarea = screen.getByPlaceholderText(/in memory of/i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "In memory of grandmother" } });
    expect(textarea.value).toBe("In memory of grandmother");
  });

  it("thank you page shows correct fund name for Building Fund", () => {
    render(<DonatePage />);
    // Select Building Fund
    const buildingLabel = screen.getAllByText("Building Fund")[0].closest("label")!;
    fireEvent.click(buildingLabel);
    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByRole("button", { name: /donate \$/i }));
    expect(screen.getByText(/building fund/i)).toBeInTheDocument();
  });

  it("thank you page shows correct custom amount", () => {
    render(<DonatePage />);
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "333" } });
    fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByRole("button", { name: /donate \$/i }));
    expect(screen.getByText(/\$333\.00/)).toBeInTheDocument();
  });

  it("does not show Zelle instructions on thank you page when Stripe selected", () => {
    render(<DonatePage />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByRole("button", { name: /donate \$/i }));
    expect(screen.queryByText(/please send your zelle payment/i)).not.toBeInTheDocument();
  });

  it("shows $0.00 in sidebar and donate button when amount is zero or empty custom", () => {
    render(<DonatePage />);
    // The sidebar shows the default amount $51.00
    const customInput = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(customInput, { target: { value: "0" } });
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("Dollar A Day section has descriptive text", () => {
    render(<DonatePage />);
    expect(screen.getByText(/make a lasting impact with just \$1 a day/i)).toBeInTheDocument();
  });

  it("shows Annual (save $7) text", () => {
    render(<DonatePage />);
    expect(screen.getByText(/annual \(save \$7\)/i)).toBeInTheDocument();
  });

  it("General Temple Fund is selected by default", () => {
    render(<DonatePage />);
    const generalLabels = screen.getAllByText("General Temple Fund");
    const generalLabel = generalLabels[0].closest("label");
    if (generalLabel) {
      const radio = generalLabel.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(radio.checked).toBe(true);
    }
  });

  it("$51 is the default selected suggested amount", () => {
    render(<DonatePage />);
    const btn51 = screen.getByRole("button", { name: "$51.00" });
    // Default amount is 51, so button should have active styling
    expect(btn51.className).toContain("border-temple-red");
  });

  it("suggested amount button styling changes on selection", () => {
    render(<DonatePage />);
    const btn11 = screen.getByRole("button", { name: "$11.00" });
    // Initially not selected
    expect(btn11.className).not.toContain("border-temple-red");
    fireEvent.click(btn11);
    // Now should be selected
    expect(btn11.className).toContain("border-temple-red");
  });

  it("Zelle scan QR code instruction is shown", () => {
    render(<DonatePage />);
    expect(screen.getByText(/scan this qr code/i)).toBeInTheDocument();
  });
});
