import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/dashboard",
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
vi.mock("@/store/slideshow", () => ({ useSlideshowStore: (sel: any) => { const s = { slides: [], loading: false, fetchSlides: vi.fn(), addSlide: vi.fn(), updateSlide: vi.fn(), removeSlide: vi.fn(), reorderSlides: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));

const mockInitialize = vi.fn();
const mockSendOtp = vi.fn().mockResolvedValue({});
const mockVerifyOtp = vi.fn().mockResolvedValue({});
const mockLogout = vi.fn();
const mockUpdateProfile = vi.fn().mockResolvedValue(undefined);
const mockAddFamilyMember = vi.fn();
const mockRemoveFamilyMember = vi.fn();
const mockAddDonation = vi.fn();
const mockAddBooking = vi.fn();

let authStoreState: any;

vi.mock("@/store/auth", () => ({
  useAuthStore: (sel: any) => {
    return typeof sel === "function" ? sel(authStoreState) : authStoreState;
  },
}));

import DashboardPage from "@/app/dashboard/page";

const baseUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  phone: "555-1234",
  gotra: "Bharadwaj",
  nakshatra: "Ashwini",
  rashi: "Mesha",
  address: "123 Main St",
  city: "Houston",
  state: "TX",
  zip: "77001",
  familyMembers: [] as any[],
  createdAt: "2025-01-01",
};

const sampleBookings = [
  { id: "BK-001", serviceName: "Ganesh Puja", serviceEmoji: "🙏", date: "2026-04-01", time: "10:00 AM", location: "Main Hall", priest: "Pandit Ji", status: "confirmed", amount: 151 },
  { id: "BK-002", serviceName: "Satyanarayan Puja", serviceEmoji: "🪔", date: "2026-03-15", time: "9:00 AM", location: "Side Hall", priest: null, status: "pending", amount: 101 },
  { id: "BK-003", serviceName: "Archana", serviceEmoji: "🌸", date: "2025-12-01", time: "8:00 AM", location: "Main Hall", priest: "Pandit Ram", status: "completed", amount: 51 },
  { id: "BK-004", serviceName: "Cancelled Puja", serviceEmoji: "❌", date: "2025-11-01", time: "7:00 AM", location: "Main Hall", priest: null, status: "cancelled", amount: 21 },
];

const sampleDonations = [
  { id: "DON-001", fund: "General Temple Fund", amount: 101, date: "2026-01-15", method: "Stripe", recurring: false, receiptId: "REC-001", taxDeductible: true },
  { id: "DON-002", fund: "Annadanam Fund", amount: 51, date: "2026-02-01", method: "Stripe", recurring: true, frequency: "monthly", receiptId: "REC-002", taxDeductible: true },
];

const sampleActivities = [
  { id: "ACT-001", type: "donation", title: "Donated to Temple Fund", description: "General donation", amount: 101, date: "2026-01-15" },
  { id: "ACT-002", type: "booking", title: "Booked Ganesh Puja", description: "Main Hall service", amount: 151, date: "2026-01-10" },
  { id: "ACT-003", type: "profile", title: "Updated Profile", description: "Changed phone number", date: "2026-01-05" },
  { id: "ACT-004", type: "donation", title: "Monthly Donation", description: "Annadanam Fund", amount: 51, date: "2026-02-01" },
  { id: "ACT-005", type: "booking", title: "Booked Archana", description: "Weekly service", amount: 21, date: "2025-12-15" },
  { id: "ACT-006", type: "donation", title: "Extra donation", description: "Building fund", amount: 500, date: "2025-11-01" },
];

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStoreState = {
      isAuthenticated: false,
      user: null,
      authUser: null,
      bookings: [],
      donations: [],
      activities: [],
      loading: false,
      initialized: true,
      initialize: mockInitialize,
      sendOtp: mockSendOtp,
      verifyOtp: mockVerifyOtp,
      logout: mockLogout,
      addDonation: mockAddDonation,
      addBooking: mockAddBooking,
      updateProfile: mockUpdateProfile,
      addFamilyMember: mockAddFamilyMember,
      removeFamilyMember: mockRemoveFamilyMember,
      fetchUserData: vi.fn(),
    };
  });

  /* ─── Loading state ─── */
  describe("Loading state", () => {
    it("shows loading spinner when not initialized", () => {
      authStoreState.initialized = false;
      render(<DashboardPage />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  /* ─── Unauthenticated - LoginForm ─── */
  describe("Unauthenticated - LoginForm", () => {
    it("shows login form when not authenticated", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Devotee Portal")).toBeInTheDocument();
      expect(screen.getByText(/Sign in to manage your services/)).toBeInTheDocument();
    });

    it("shows name and email fields", () => {
      render(<DashboardPage />);
      expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    });

    it("shows continue with email button", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Continue with Email")).toBeInTheDocument();
    });

    it("shows WhatsApp contact link", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Contact via WhatsApp")).toBeInTheDocument();
    });

    it("shows terms and privacy links", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Terms")).toBeInTheDocument();
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });

    it("shows 'or' divider", () => {
      render(<DashboardPage />);
      expect(screen.getByText("or")).toBeInTheDocument();
    });

    it("calls sendOtp when form is submitted with valid inputs", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test User" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@example.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);
      expect(mockSendOtp).toHaveBeenCalledWith("test@example.com", "Test User");
    });

    it("does not call sendOtp when name is empty", async () => {
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@example.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);
      expect(mockSendOtp).not.toHaveBeenCalled();
    });

    it("does not call sendOtp when email is empty", async () => {
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);
      expect(mockSendOtp).not.toHaveBeenCalled();
    });

    it("shows loading state while sending OTP", async () => {
      let resolve: (v: any) => void;
      mockSendOtp.mockImplementation(() => new Promise((r) => { resolve = r; }));
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Sending OTP...")).toBeInTheDocument();
      });

      await act(async () => { resolve!({}); });
    });

    it("shows error when sendOtp fails", async () => {
      mockSendOtp.mockResolvedValue({ error: "Send failed" });
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Send failed")).toBeInTheDocument();
      });
    });

    it("transitions to OTP step after successful sendOtp", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText(/We sent a verification code to/)).toBeInTheDocument();
        expect(screen.getByText("t@t.com")).toBeInTheDocument();
        expect(screen.getByText("Enter OTP")).toBeInTheDocument();
        expect(screen.getByText("Verify & Sign In")).toBeInTheDocument();
        expect(screen.getByText("Use a different email")).toBeInTheDocument();
      });
    });

    it("OTP input strips non-numeric chars and limits to 6", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("------")).toBeInTheDocument();
      });

      const otpInput = screen.getByPlaceholderText("------");
      fireEvent.change(otpInput, { target: { value: "12ab34cd56ef78" } });
      expect(otpInput).toHaveValue("123456");
    });

    it("Verify & Sign In is disabled when OTP is less than 6 digits", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Verify & Sign In")).toBeInTheDocument();
      });

      const otpInput = screen.getByPlaceholderText("------");
      fireEvent.change(otpInput, { target: { value: "123" } });
      expect(screen.getByText("Verify & Sign In")).toBeDisabled();
    });

    it("calls verifyOtp when OTP form is submitted with 6 digits", async () => {
      mockSendOtp.mockResolvedValue({});
      mockVerifyOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("------")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("------"), { target: { value: "123456" } });
      fireEvent.submit(screen.getByText("Verify & Sign In").closest("form")!);

      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalledWith("t@t.com", "123456");
      });
    });

    it("does not call verifyOtp when OTP is less than 6 digits on submit", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("------")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("------"), { target: { value: "123" } });
      fireEvent.submit(screen.getByText("Verify & Sign In").closest("form")!);

      expect(mockVerifyOtp).not.toHaveBeenCalled();
    });

    it("shows error when verifyOtp fails", async () => {
      mockSendOtp.mockResolvedValue({});
      mockVerifyOtp.mockResolvedValue({ error: "Wrong OTP" });
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("------")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("------"), { target: { value: "123456" } });
      fireEvent.submit(screen.getByText("Verify & Sign In").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Wrong OTP")).toBeInTheDocument();
      });
    });

    it("shows verifying loading state", async () => {
      mockSendOtp.mockResolvedValue({});
      let resolve: (v: any) => void;
      mockVerifyOtp.mockImplementation(() => new Promise((r) => { resolve = r; }));
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("------")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("------"), { target: { value: "123456" } });
      fireEvent.submit(screen.getByText("Verify & Sign In").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Verifying...")).toBeInTheDocument();
      });

      await act(async () => { resolve!({}); });
    });

    it("'Use a different email' returns to form step", async () => {
      mockSendOtp.mockResolvedValue({});
      render(<DashboardPage />);
      fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
      fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
      fireEvent.submit(screen.getByText("Continue with Email").closest("form")!);

      await waitFor(() => {
        expect(screen.getByText("Use a different email")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Use a different email"));
      expect(screen.getByText("Continue with Email")).toBeInTheDocument();
    });
  });

  /* ─── Authenticated - Dashboard ─── */
  describe("Authenticated - Dashboard", () => {
    beforeEach(() => {
      authStoreState.isAuthenticated = true;
      authStoreState.user = { ...baseUser };
      authStoreState.bookings = [...sampleBookings];
      authStoreState.donations = [...sampleDonations];
      authStoreState.activities = [...sampleActivities];
    });

    it("renders all 4 tab buttons", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.getByText("Bookings")).toBeInTheDocument();
      expect(screen.getByText("Donations")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("calls initialize on mount", () => {
      render(<DashboardPage />);
      expect(mockInitialize).toHaveBeenCalled();
    });

    /* ── Overview Tab ── */
    describe("Overview Tab", () => {
      it("shows welcome message with first name", () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Namaste, Test!/)).toBeInTheDocument();
      });

      it("shows portal description", () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Welcome to your devotee portal/)).toBeInTheDocument();
      });

      it("shows Book a Service and Make a Donation links", () => {
        render(<DashboardPage />);
        const bookLink = screen.getByText("Book a Service");
        expect(bookLink.closest("a")).toHaveAttribute("href", "/services");
        const donateLink = screen.getByText("Make a Donation");
        expect(donateLink.closest("a")).toHaveAttribute("href", "/donate");
      });

      it("shows stats grid with correct values", () => {
        render(<DashboardPage />);
        // totalDonated = 101 + 51 = 152
        expect(screen.getByText("$152")).toBeInTheDocument();
        // totalBookings = 4
        expect(screen.getByText("4")).toBeInTheDocument();
        // upcoming = confirmed + pending = 2
        // recurring = 1
        expect(screen.getByText("Total Donated")).toBeInTheDocument();
        expect(screen.getByText("Services Booked")).toBeInTheDocument();
      });

      it("shows upcoming bookings section with confirmed/pending bookings", () => {
        render(<DashboardPage />);
        expect(screen.getByText("Upcoming Services")).toBeInTheDocument();
        expect(screen.getByText("Ganesh Puja")).toBeInTheDocument();
        expect(screen.getByText("Satyanarayan Puja")).toBeInTheDocument();
      });

      it("shows recent activity with all 3 activity types", () => {
        render(<DashboardPage />);
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
        expect(screen.getByText("Donated to Temple Fund")).toBeInTheDocument();
        expect(screen.getByText("Booked Ganesh Puja")).toBeInTheDocument();
        expect(screen.getByText("Updated Profile")).toBeInTheDocument();
      });

      it("limits recent activity to 5 items", () => {
        render(<DashboardPage />);
        // 6th activity should not appear (sliced to 5)
        expect(screen.queryByText("Extra donation")).not.toBeInTheDocument();
      });

      it("shows activity amounts and dates", () => {
        render(<DashboardPage />);
        expect(screen.getByText("$101")).toBeInTheDocument();
        expect(screen.getByText("$151")).toBeInTheDocument();
      });

      it("does not show upcoming services section when no upcoming bookings", () => {
        authStoreState.bookings = [sampleBookings[2], sampleBookings[3]]; // completed + cancelled
        render(<DashboardPage />);
        expect(screen.queryByText("Upcoming Services")).not.toBeInTheDocument();
      });
    });

    /* ── Bookings Tab ── */
    describe("Bookings Tab", () => {
      it("shows My Bookings heading and Book New Service link", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        expect(screen.getByText("My Bookings")).toBeInTheDocument();
        expect(screen.getByText("Book New Service").closest("a")).toHaveAttribute("href", "/services");
      });

      it("shows all bookings by default with filter buttons", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        expect(screen.getByText("All")).toBeInTheDocument();
        // "Completed" appears as both a filter button and a status badge
        expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
        // All 4 bookings shown
        expect(screen.getByText("Ganesh Puja")).toBeInTheDocument();
        expect(screen.getByText("Archana")).toBeInTheDocument();
        expect(screen.getByText("Cancelled Puja")).toBeInTheDocument();
      });

      it("shows booking details: date, time, location, priest, amount, id", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        expect(screen.getByText("2026-04-01")).toBeInTheDocument();
        expect(screen.getByText("10:00 AM")).toBeInTheDocument();
        expect(screen.getByText("Pandit Ji")).toBeInTheDocument();
        expect(screen.getByText("Booking ID: BK-001")).toBeInTheDocument();
      });

      it("shows status badges: Confirmed, Pending, Completed, Cancelled", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        expect(screen.getByText("Confirmed")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
        // "Completed" appears as both a filter button and a status badge
        expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText("Cancelled")).toBeInTheDocument();
      });

      it("shows Contact Priest link for confirmed/pending bookings", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        const contactLinks = screen.getAllByText("Contact Priest");
        expect(contactLinks.length).toBe(2); // confirmed + pending
      });

      it("filters to upcoming bookings", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        // Find and click the Upcoming filter button (not the stats one)
        const upcomingButtons = screen.getAllByText("Upcoming");
        // Click the filter button (last one)
        fireEvent.click(upcomingButtons[upcomingButtons.length - 1]);
        expect(screen.getByText("Ganesh Puja")).toBeInTheDocument();
        expect(screen.getByText("Satyanarayan Puja")).toBeInTheDocument();
        expect(screen.queryByText("Archana")).not.toBeInTheDocument();
        expect(screen.queryByText("Cancelled Puja")).not.toBeInTheDocument();
      });

      it("filters to completed bookings", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        // "Completed" appears as both a filter button and a status badge; click the filter button
        const completedButtons = screen.getAllByText("Completed");
        // Click the filter button (the one in the filter bar, not the status badge)
        fireEvent.click(completedButtons[0]);
        expect(screen.getByText("Archana")).toBeInTheDocument();
        expect(screen.queryByText("Ganesh Puja")).not.toBeInTheDocument();
      });

      it("shows empty state when no bookings match filter", () => {
        authStoreState.bookings = [];
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        expect(screen.getByText("No bookings found")).toBeInTheDocument();
        expect(screen.getByText("Browse Services").closest("a")).toHaveAttribute("href", "/services");
      });

      it("handles unknown status with fallback to pending style", () => {
        authStoreState.bookings = [{ ...sampleBookings[0], status: "unknown_status" }];
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Bookings"));
        // Falls back to pending config, showing "Pending" label
        expect(screen.getByText("Pending")).toBeInTheDocument();
      });
    });

    /* ── Donations Tab ── */
    describe("Donations Tab", () => {
      it("shows My Donations heading and Donate Now button", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        expect(screen.getByText("My Donations")).toBeInTheDocument();
        expect(screen.getByText("Donate Now")).toBeInTheDocument();
      });

      it("shows donation summary cards with correct totals", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        // total = 152, recurring = 51
        expect(screen.getByText("$152")).toBeInTheDocument();
        expect(screen.getByText("$51/mo")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // tax receipts count
        expect(screen.getByText("Tax Receipts")).toBeInTheDocument();
      });

      it("shows donation history with fund names, amounts, receipts", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        expect(screen.getByText("Donation History")).toBeInTheDocument();
        expect(screen.getByText("General Temple Fund")).toBeInTheDocument();
        expect(screen.getByText("Annadanam Fund")).toBeInTheDocument();
        expect(screen.getByText("REC-001")).toBeInTheDocument();
        expect(screen.getByText("REC-002")).toBeInTheDocument();
      });

      it("shows tax-deductible notice", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        expect(screen.getByText(/tax-deductible under 501/)).toBeInTheDocument();
      });

      it("toggles quick donate panel", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.getByText("Quick Donation")).toBeInTheDocument();
        expect(screen.getByText("Select Fund")).toBeInTheDocument();
        expect(screen.getByText("Amount")).toBeInTheDocument();
      });

      it("shows fund selection buttons in quick donate", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        // "Annadanam Fund" appears in both donation history and quick donate fund buttons
        expect(screen.getAllByText("Annadanam Fund").length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText("Priest Fund")).toBeInTheDocument();
        expect(screen.getByText("Building Fund")).toBeInTheDocument();
        expect(screen.getByText("Education Fund")).toBeInTheDocument();
      });

      it("shows amount buttons in quick donate", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.getByText("$11")).toBeInTheDocument();
        expect(screen.getByText("$21")).toBeInTheDocument();
        // "$101" appears in both donation history and quick donate amount buttons
        expect(screen.getAllByText("$101").length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText("$251")).toBeInTheDocument();
        expect(screen.getByText("$501")).toBeInTheDocument();
      });

      it("selects a different fund", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        fireEvent.click(screen.getByText("Priest Fund"));
        // Default amount is 51, so Donate button says Donate $51
        expect(screen.getByText("Donate $51")).toBeInTheDocument();
      });

      it("selects a different amount", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        fireEvent.click(screen.getByText("$251"));
        expect(screen.getByText("Donate $251")).toBeInTheDocument();
      });

      it("calls addDonation on quick donate submit", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        // Scope to the Quick Donation panel to avoid ambiguity with donation history
        const quickDonatePanel = screen.getByText("Quick Donation").closest("div")!;
        const qd = within(quickDonatePanel);
        fireEvent.click(qd.getByText("$101"));
        fireEvent.click(qd.getByText("Education Fund"));
        fireEvent.click(qd.getByText("Donate $101"));

        expect(mockAddDonation).toHaveBeenCalledWith(expect.objectContaining({
          fund: "Education Fund",
          amount: 101,
          method: "Stripe",
          recurring: false,
          taxDeductible: true,
        }));
      });

      it("closes quick donate panel after donation", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.getByText("Quick Donation")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Donate $51"));
        expect(screen.queryByText("Quick Donation")).not.toBeInTheDocument();
      });

      it("closes quick donate panel with cancel button", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.getByText("Quick Donation")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Cancel"));
        expect(screen.queryByText("Quick Donation")).not.toBeInTheDocument();
      });

      it("toggles quick donate off by clicking Donate Now again", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Donations"));
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.getByText("Quick Donation")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Donate Now"));
        expect(screen.queryByText("Quick Donation")).not.toBeInTheDocument();
      });
    });

    /* ── Profile Tab ── */
    describe("Profile Tab", () => {
      it("shows My Profile heading and personal info", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("My Profile")).toBeInTheDocument();
        expect(screen.getByText("Personal Information")).toBeInTheDocument();
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
        expect(screen.getByText("555-1234")).toBeInTheDocument();
      });

      it("shows vedic information", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("Vedic Information")).toBeInTheDocument();
        expect(screen.getByText("Bharadwaj")).toBeInTheDocument();
        expect(screen.getByText("Ashwini")).toBeInTheDocument();
        expect(screen.getByText("Mesha")).toBeInTheDocument();
      });

      it("shows family members section with empty state", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("Family Members")).toBeInTheDocument();
        expect(screen.getByText("No family members added yet")).toBeInTheDocument();
      });

      it("shows family members when they exist", () => {
        authStoreState.user = {
          ...baseUser,
          familyMembers: [
            { id: "fm-1", name: "Spouse Name", relationship: "Spouse", gotra: "Bharadwaj" },
            { id: "fm-2", name: "Child Name", relationship: "Son" },
          ],
        };
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("Spouse Name")).toBeInTheDocument();
        expect(screen.getByText("Child Name")).toBeInTheDocument();
      });

      it("shows Edit Profile button and switches to edit mode", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("Edit Profile")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Edit Profile"));
        // In edit mode, Save and Cancel buttons appear
        expect(screen.getByText("Save")).toBeInTheDocument();
        // There should be input fields now
        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThan(0);
      });

      it("cancels editing returns to view mode", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Edit Profile"));
        expect(screen.getByText("Save")).toBeInTheDocument();
        // Click the Cancel button next to Save (not the family member one)
        const cancelButtons = screen.getAllByText("Cancel");
        fireEvent.click(cancelButtons[0]);
        expect(screen.getByText("Edit Profile")).toBeInTheDocument();
      });

      it("saves profile by calling updateProfile", async () => {
        mockUpdateProfile.mockResolvedValue(undefined);
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Edit Profile"));

        // Change the name field (first input)
        const nameInput = screen.getAllByRole("textbox")[0];
        fireEvent.change(nameInput, { target: { value: "New Name" } });

        fireEvent.click(screen.getByText("Save"));

        await waitFor(() => {
          expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({
            name: "New Name",
          }));
        });
      });

      it("shows Sign Out button and calls logout", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        const signOutBtn = screen.getByText("Sign Out");
        expect(signOutBtn).toBeInTheDocument();
        fireEvent.click(signOutBtn);
        expect(mockLogout).toHaveBeenCalled();
      });

      it("shows Add Member button and form", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Relationship (e.g. Spouse)")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Gotra (optional)")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
      });

      it("adds a family member", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "New Member" } });
        fireEvent.change(screen.getByPlaceholderText("Relationship (e.g. Spouse)"), { target: { value: "Spouse" } });
        fireEvent.change(screen.getByPlaceholderText("Gotra (optional)"), { target: { value: "Kashyap" } });
        fireEvent.click(screen.getByText("Add"));

        expect(mockAddFamilyMember).toHaveBeenCalledWith(expect.objectContaining({
          name: "New Member",
          relationship: "Spouse",
          gotra: "Kashyap",
        }));
      });

      it("does not add family member without name", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        fireEvent.change(screen.getByPlaceholderText("Relationship (e.g. Spouse)"), { target: { value: "Spouse" } });
        fireEvent.click(screen.getByText("Add"));
        expect(mockAddFamilyMember).not.toHaveBeenCalled();
      });

      it("does not add family member without relationship", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Member" } });
        fireEvent.click(screen.getByText("Add"));
        expect(mockAddFamilyMember).not.toHaveBeenCalled();
      });

      it("adds family member without gotra (undefined)", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Member" } });
        fireEvent.change(screen.getByPlaceholderText("Relationship (e.g. Spouse)"), { target: { value: "Child" } });
        fireEvent.click(screen.getByText("Add"));

        expect(mockAddFamilyMember).toHaveBeenCalledWith(expect.objectContaining({
          name: "Member",
          relationship: "Child",
          gotra: undefined,
        }));
      });

      it("cancels add family member form", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
        // Cancel button in family add form
        const cancelButtons = screen.getAllByText("Cancel");
        fireEvent.click(cancelButtons[cancelButtons.length - 1]);
        expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();
      });

      it("removes a family member", () => {
        authStoreState.user = {
          ...baseUser,
          familyMembers: [
            { id: "fm-1", name: "Spouse Name", relationship: "Spouse", gotra: "Bharadwaj" },
          ],
        };
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        expect(screen.getByText("Spouse Name")).toBeInTheDocument();

        // Find the delete button (Trash2 icon button)
        const deleteButton = screen.getByText("Spouse Name").closest("div")!.parentElement!.querySelector("button")!;
        fireEvent.click(deleteButton);
        expect(mockRemoveFamilyMember).toHaveBeenCalledWith("fm-1");
      });

      it("returns null when user is null in ProfileTab", () => {
        authStoreState.user = null;
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        // ProfileTab returns null, so My Profile heading should not appear
        expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
      });

      it("shows dash for missing profile fields", () => {
        authStoreState.user = { ...baseUser, phone: "", gotra: "", nakshatra: "", rashi: "", address: "", city: "", state: "" };
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        // Empty fields show "—"
        const dashes = screen.getAllByText("—");
        expect(dashes.length).toBeGreaterThan(0);
      });

      it("toggles add family member panel off by clicking Add Member again", () => {
        render(<DashboardPage />);
        fireEvent.click(screen.getByText("Profile"));
        fireEvent.click(screen.getByText("Add Member"));
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Add Member"));
        expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();
      });
    });
  });
});
