import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
  useLanguageStore: () => ({ locale: "en", setLocale: vi.fn() }),
}));
vi.mock("@/store/auth", () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    initialize: vi.fn(),
  }),
}));

import ContactPage from "@/app/contact/page";

describe("ContactPage", () => {
  it("renders without crashing", () => {
    render(<ContactPage />);
  });

  it("displays the page heading", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /contact us/i })
    ).toBeInTheDocument();
  });

  it("shows the subtitle text", () => {
    render(<ContactPage />);
    expect(
      screen.getByText(/reach out to our priests/i)
    ).toBeInTheDocument();
  });

  it("displays Pt. Aditya Sharma card", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /Pt\. Aditya Sharma/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Founder & Head Priest/i)).toBeInTheDocument();
  });

  it("displays Pt. Raghurama Sharma card", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /Pt\. Raghurama Sharma/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Senior Priest/i)).toBeInTheDocument();
  });

  it("shows Aditya Sharma phone number", () => {
    render(<ContactPage />);
    // Phone number appears in the contact card and Zelle donation section
    const matches = screen.getAllByText("(512) 545-0473");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("shows Raghurama Sharma phone number", () => {
    render(<ContactPage />);
    expect(screen.getByText("(512) 998-0112")).toBeInTheDocument();
  });

  it("has a WhatsApp link for Aditya Sharma", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", {
      name: /\(512\) 545-0473.*whatsapp/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/message/55G67NQ6CQENA1"
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("has a phone link for Raghurama Sharma", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", {
      name: /\(512\) 998-0112.*phone/i,
    });
    expect(link).toHaveAttribute("href", "tel:+15129980112");
  });

  it("shows Join Temple WhatsApp Group link", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", {
      name: /join temple whatsapp group/i,
    });
    // Routes to the temple's wa.me deep link rather than a chat.whatsapp.com URL
    expect(link).toHaveAttribute("href", "https://wa.me/message/55G67NQ6CQENA1");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows Book a Temple Service link pointing to /services", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", {
      name: /book a temple service/i,
    });
    expect(link).toHaveAttribute("href", "/services");
  });

  it("displays Service Areas in Texas heading", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /service areas in texas/i })
    ).toBeInTheDocument();
  });

  it("lists service area cities", () => {
    render(<ContactPage />);
    const areas = screen.getByText(/Kyle, Manor, Austin/i);
    expect(areas).toBeInTheDocument();
    expect(areas.textContent).toContain("Round Rock");
    expect(areas.textContent).toContain("San Antonio");
    expect(areas.textContent).toContain("Dripping Springs");
  });

  it("shows Zelle donation section", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("heading", { name: /donate via zelle/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/send donations directly via zelle/i)
    ).toBeInTheDocument();
  });

  it("shows the WhatsApp label text", () => {
    render(<ContactPage />);
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
  });

  it("shows the Phone label text", () => {
    render(<ContactPage />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
  });

  it("shows stay updated text for WhatsApp group", () => {
    render(<ContactPage />);
    expect(
      screen.getByText(/stay updated with temple activities/i)
    ).toBeInTheDocument();
  });

  it("shows browse and book poojas text", () => {
    render(<ContactPage />);
    expect(
      screen.getByText(/browse and book poojas online/i)
    ).toBeInTheDocument();
  });
});
