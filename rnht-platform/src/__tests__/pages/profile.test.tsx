import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/profile",
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
vi.mock("@/store/auth", () => ({ useAuthStore: (sel: any) => { const s = { isAuthenticated: false, user: null, authUser: null, bookings: [], donations: [], activities: [], loading: false, initialized: true, initialize: vi.fn(), sendOtp: vi.fn().mockResolvedValue({}), verifyOtp: vi.fn().mockResolvedValue({}), logout: vi.fn(), addDonation: vi.fn(), addBooking: vi.fn(), updateProfile: vi.fn(), addFamilyMember: vi.fn(), removeFamilyMember: vi.fn(), fetchUserData: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/slideshow", () => ({ useSlideshowStore: (sel: any) => { const s = { slides: [], loading: false, fetchSlides: vi.fn(), addSlide: vi.fn(), updateSlide: vi.fn(), removeSlide: vi.fn(), reorderSlides: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));

import ProfilePage from "@/app/profile/page";

describe("ProfilePage", () => {
  it("renders without crashing", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Rajesh Sharma")).toBeInTheDocument();
  });

  it("displays user info in the header", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/rajesh\.sharma@email\.com/)).toBeInTheDocument();
    expect(screen.getByText(/Gotra: Bharadwaja/)).toBeInTheDocument();
    expect(screen.getByText(/Nakshatra: Pushya/)).toBeInTheDocument();
    expect(screen.getByText(/Rashi: Karka/)).toBeInTheDocument();
  });

  it("shows sign out link", () => {
    render(<ProfilePage />);
    const signOut = screen.getByText("Sign Out");
    expect(signOut).toBeInTheDocument();
    expect(signOut.closest("a")).toHaveAttribute("href", "/login");
  });

  it("displays quick stats", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
    expect(screen.getByText("Total Donated")).toBeInTheDocument();
    expect(screen.getByText("Family Members")).toBeInTheDocument();
    expect(screen.getByText("Seva Points")).toBeInTheDocument();
  });

  it("renders all tab buttons", () => {
    render(<ProfilePage />);
    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Family")).toBeInTheDocument();
    expect(screen.getByText("Bookings")).toBeInTheDocument();
    expect(screen.getByText("Donations")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("shows profile tab content by default with personal details form", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rajesh Sharma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("rajesh.sharma@email.com")).toBeInTheDocument();
  });

  it("switches to family tab and shows family members", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();
    expect(screen.getByText("Spouse")).toBeInTheDocument();
    expect(screen.getByText("Son")).toBeInTheDocument();
  });

  it("shows add family member modal when clicking Add Member", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByText("Add Family Member")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
  });

  it("closes add family modal on Cancel", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByText("Add Family Member")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add Family Member")).not.toBeInTheDocument();
  });

  it("shows spiritual milestones in family tab", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("Family Spiritual Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/Aksharabhyasam/)).toBeInTheDocument();
    expect(screen.getByText(/Upanayanam/)).toBeInTheDocument();
  });

  it("switches to bookings tab and shows booking data", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    expect(screen.getByText("Abhishekam")).toBeInTheDocument();
    expect(screen.getByText("Satyanarayana Vratam")).toBeInTheDocument();
  });

  it("shows status badges for bookings", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getAllByText("Completed").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Reschedule/Cancel for confirmed bookings", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("Reschedule")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows Rebook for completed bookings", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getAllByText("Rebook this service").length).toBeGreaterThanOrEqual(1);
  });

  it("switches to donations tab and shows donation data", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("General Temple Fund")).toBeInTheDocument();
    expect(screen.getByText("Annadanam Fund")).toBeInTheDocument();
    expect(screen.getByText(/Tax Summary/)).toBeInTheDocument();
    expect(screen.getByText(/Tax-deductible under 501/)).toBeInTheDocument();
  });

  it("shows recurring badge for recurring donations", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("switches to preferences tab", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Preferred Language")).toBeInTheDocument();
    expect(screen.getByText("Communication Preferences")).toBeInTheDocument();
    expect(screen.getByText("Spiritual Preferences")).toBeInTheDocument();
    expect(screen.getByText("Data & Privacy")).toBeInTheDocument();
  });

  it("shows deity checkboxes in preferences", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Lord Ganesha")).toBeInTheDocument();
    expect(screen.getByText("Lord Vishnu")).toBeInTheDocument();
    expect(screen.getByText("Lord Shiva")).toBeInTheDocument();
  });

  it("shows data privacy buttons", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Export My Data")).toBeInTheDocument();
    expect(screen.getByText("Delete Account")).toBeInTheDocument();
  });

  it("shows booking filter buttons", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    // "Completed" button text
    const completedButtons = screen.getAllByText("Completed");
    expect(completedButtons.length).toBeGreaterThanOrEqual(1);
  });

  // --- Additional tests for improved coverage ---

  it("displays initials RS in profile avatar", () => {
    render(<ProfilePage />);
    expect(screen.getByText("RS")).toBeInTheDocument();
  });

  it("shows phone number in profile header", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/\+1 \(555\) 123-4567/)).toBeInTheDocument();
  });

  it("shows quick stats with correct booking count", () => {
    render(<ProfilePage />);
    // 4 sample bookings
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("shows quick stats with correct family member count", () => {
    render(<ProfilePage />);
    // 2 family members
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows quick stats with correct seva points", () => {
    render(<ProfilePage />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows total donated amount in quick stats", () => {
    render(<ProfilePage />);
    // totalDonated = 101 + 51 + 251 + 501 = 904
    expect(screen.getByText("$904.00")).toBeInTheDocument();
  });

  it("profile tab shows address field", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("123 Desert View Dr, Las Vegas, NV 89101")).toBeInTheDocument();
  });

  it("profile tab shows phone field", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("+1 (555) 123-4567")).toBeInTheDocument();
  });

  it("profile tab shows date of birth field", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("1990-01-15")).toBeInTheDocument();
  });

  it("profile tab shows gotra field", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("Bharadwaja")).toBeInTheDocument();
  });

  it("profile tab shows nakshatra dropdown with correct default", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("Pushya")).toBeInTheDocument();
  });

  it("profile tab shows rashi dropdown with correct default", () => {
    render(<ProfilePage />);
    expect(screen.getByDisplayValue("Karka (Cancer)")).toBeInTheDocument();
  });

  it("deletes a family member when trash button is clicked", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();

    // Find and click the first trash/delete button
    const deleteButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg") && btn.className.includes("hover:text-red-500")
    );
    expect(deleteButtons.length).toBe(2); // One for each family member
    fireEvent.click(deleteButtons[0]);

    // After deletion, first family member should be gone
    expect(screen.queryByText("Priya Sharma")).not.toBeInTheDocument();
    // Second should still be there
    expect(screen.getByText("Aarav Sharma")).toBeInTheDocument();
  });

  it("deletes second family member", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));

    const deleteButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg") && btn.className.includes("hover:text-red-500")
    );
    fireEvent.click(deleteButtons[1]);

    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    expect(screen.queryByText("Aarav Sharma")).not.toBeInTheDocument();
  });

  it("family member card shows gotra, nakshatra, rashi, dob", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    // Priya's details
    expect(screen.getByText("Rohini")).toBeInTheDocument();
    expect(screen.getByText("Vrishabha (Taurus)")).toBeInTheDocument();
    expect(screen.getByText("1992-06-15")).toBeInTheDocument();
  });

  it("family member card shows Aarav's details", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("2018-03-22")).toBeInTheDocument();
  });

  it("family tab shows sankalp message", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText(/add family members for quick sankalp/i)).toBeInTheDocument();
  });

  it("add family modal has relationship dropdown", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByDisplayValue("Relationship")).toBeInTheDocument();
  });

  it("add family modal has nakshatra dropdown", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByDisplayValue("Nakshatra")).toBeInTheDocument();
  });

  it("add family modal has rashi dropdown", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByDisplayValue("Rashi")).toBeInTheDocument();
  });

  it("add family modal has gotra input", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByPlaceholderText("Gotra")).toBeInTheDocument();
  });

  it("add family modal closes on Add Member button click", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    fireEvent.click(screen.getByText("Add Member"));
    expect(screen.getByText("Add Family Member")).toBeInTheDocument();
    // Find the modal's "Add Member" button - it's inside the modal dialog (fixed overlay)
    const modal = screen.getByText("Add Family Member").closest(".fixed")!;
    const modalAddBtn = Array.from(modal.querySelectorAll("button")).find(
      (b) => b.textContent === "Add Member"
    );
    expect(modalAddBtn).toBeTruthy();
    fireEvent.click(modalAddBtn!);
    expect(screen.queryByText("Add Family Member")).not.toBeInTheDocument();
  });

  it("spiritual milestones show Done status", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("spiritual milestones show Book link for upcoming events", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    const bookLink = screen.getByRole("link", { name: "Book" });
    expect(bookLink).toHaveAttribute("href", "/services?category=astrology-vastu");
  });

  it("spiritual milestones show future event reminder", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText(/shasti poorthi/i)).toBeInTheDocument();
    expect(screen.getByText(/in 2050/i)).toBeInTheDocument();
  });

  it("bookings show priest name", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    // "Priest: Pandit Sharma" appears in multiple bookings
    expect(screen.getAllByText(/Priest: Pandit Sharma/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Priest: Pandit Iyer/i)).toBeInTheDocument();
  });

  it("bookings show booking IDs", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText(/BK-2026-001/)).toBeInTheDocument();
    expect(screen.getByText(/BK-2026-002/)).toBeInTheDocument();
    expect(screen.getByText(/BK-2025-015/)).toBeInTheDocument();
    expect(screen.getByText(/BK-2025-010/)).toBeInTheDocument();
  });

  it("bookings show dates and times", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("2026-03-15")).toBeInTheDocument();
    // "10:00 AM" appears in multiple bookings
    expect(screen.getAllByText("10:00 AM").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("9:00 AM")).toBeInTheDocument();
  });

  it("bookings show amounts", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("$101.00")).toBeInTheDocument();
    expect(screen.getAllByText("$51.00").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("$11.00")).toBeInTheDocument();
  });

  it("Archana booking shows as completed", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("Archana")).toBeInTheDocument();
  });

  it("donations tab shows donation IDs", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText(/DN-2026-001/)).toBeInTheDocument();
    expect(screen.getByText(/DN-2026-002/)).toBeInTheDocument();
    expect(screen.getByText(/DN-2025-010/)).toBeInTheDocument();
    expect(screen.getByText(/DN-2025-005/)).toBeInTheDocument();
  });

  it("donations tab shows payment methods", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    // "via Stripe" appears in multiple donations
    expect(screen.getAllByText(/via Stripe/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/via Zelle/)).toBeInTheDocument();
    expect(screen.getByText(/via PayPal/)).toBeInTheDocument();
  });

  it("donations tab shows donation dates", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("2026-03-01")).toBeInTheDocument();
    expect(screen.getByText("2026-02-15")).toBeInTheDocument();
  });

  it("donations tab shows Download Receipt buttons", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    const receiptBtns = screen.getAllByText("Download Receipt");
    expect(receiptBtns.length).toBe(4); // One for each donation
  });

  it("donations tab shows total donated amount at top", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    // Total: 101 + 51 + 251 + 501 = 904
    // "$904.00" appears in both the quick stats and the donations tab header
    expect(screen.getAllByText("$904.00").length).toBeGreaterThanOrEqual(1);
  });

  it("preferences tab shows communication preference items", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Push Notifications")).toBeInTheDocument();
    expect(screen.getByText("Email Notifications")).toBeInTheDocument();
    expect(screen.getByText("SMS Alerts")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Updates")).toBeInTheDocument();
  });

  it("preferences tab shows communication preference descriptions", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText(/daily panchangam, event reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/booking confirmations, donation receipts/i)).toBeInTheDocument();
    expect(screen.getByText(/booking reminders, festival alerts/i)).toBeInTheDocument();
    expect(screen.getByText(/temple announcements, community news/i)).toBeInTheDocument();
  });

  it("preferences tab shows all deity checkboxes", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Lord Ganesha")).toBeInTheDocument();
    expect(screen.getByText("Lord Vishnu")).toBeInTheDocument();
    expect(screen.getByText("Lord Shiva")).toBeInTheDocument();
    expect(screen.getByText("Goddess Lakshmi")).toBeInTheDocument();
    expect(screen.getByText("Lord Hanuman")).toBeInTheDocument();
    expect(screen.getByText("Lord Rama")).toBeInTheDocument();
  });

  it("preferences tab shows dietary restrictions dropdown", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText(/dietary restrictions/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("None")).toBeInTheDocument();
  });

  it("preferences tab shows language dropdown with options", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByDisplayValue("English")).toBeInTheDocument();
  });

  it("preferences tab shows GDPR compliance notice", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/export or delete your data/i)).toBeInTheDocument();
  });

  it("tab button styling changes when selected", () => {
    render(<ProfilePage />);
    const profileTab = screen.getByText("My Profile");
    expect(profileTab.className).toContain("bg-white");
    expect(profileTab.className).toContain("text-temple-red");

    const familyTab = screen.getByText("Family");
    expect(familyTab.className).toContain("text-gray-600");
    expect(familyTab.className).not.toContain("bg-white");
  });

  it("switching tabs updates styling", () => {
    render(<ProfilePage />);
    const familyTab = screen.getByText("Family");
    fireEvent.click(familyTab);
    expect(familyTab.className).toContain("bg-white");
    expect(familyTab.className).toContain("text-temple-red");

    const profileTab = screen.getByText("My Profile");
    expect(profileTab.className).toContain("text-gray-600");
  });

  it("can navigate through all tabs sequentially", () => {
    render(<ProfilePage />);

    // Profile (default) - already shown
    expect(screen.getByText("Personal Details")).toBeInTheDocument();

    // Family
    fireEvent.click(screen.getByText("Family"));
    expect(screen.getByText("Priya Sharma")).toBeInTheDocument();

    // Bookings
    fireEvent.click(screen.getByText("Bookings"));
    expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();

    // Donations
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("General Temple Fund")).toBeInTheDocument();

    // Preferences
    fireEvent.click(screen.getByText("Preferences"));
    expect(screen.getByText("Preferred Language")).toBeInTheDocument();
  });

  it("profile tab hides when switching to another tab", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Family"));
    expect(screen.queryByText("Personal Details")).not.toBeInTheDocument();
  });

  it("bookings tab shows 4 booking cards", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    // 4 sample bookings
    expect(screen.getByText("Ganapathi Homam")).toBeInTheDocument();
    expect(screen.getByText("Abhishekam")).toBeInTheDocument();
    expect(screen.getByText("Satyanarayana Vratam")).toBeInTheDocument();
    expect(screen.getByText("Archana")).toBeInTheDocument();
  });

  it("confirmed booking does not show Rebook button", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Bookings"));
    // Ganapathi Homam is confirmed - should have Reschedule/Cancel but not Rebook
    expect(screen.getByText("Reschedule")).toBeInTheDocument();
    // Rebook count should equal completed bookings count (2)
    expect(screen.getAllByText("Rebook this service").length).toBe(2);
  });

  it("donations tab shows Festival Fund", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("Festival Fund")).toBeInTheDocument();
  });

  it("donations tab shows Building Fund", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("Building Fund")).toBeInTheDocument();
  });

  it("donations tab shows donation amounts", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Donations"));
    expect(screen.getByText("$101.00")).toBeInTheDocument();
    expect(screen.getByText("$251.00")).toBeInTheDocument();
    expect(screen.getByText("$501.00")).toBeInTheDocument();
  });
});
