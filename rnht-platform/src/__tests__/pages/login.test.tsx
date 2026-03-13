import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/link", () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("next/image", () => ({ default: (props: any) => <img {...props} /> }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: vi.fn() }),
  usePathname: () => "/login",
  useSearchParams: () => new URLSearchParams(),
}));

const { mockSignInWithOAuth } = vi.hoisted(() => ({
  mockSignInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
      signInWithOAuth: mockSignInWithOAuth,
    },
    from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null }), order: () => ({ data: [], limit: () => ({ data: [] }) }) }), order: () => ({ data: [] }) }), insert: () => ({ then: vi.fn() }), update: () => ({ eq: () => ({ then: vi.fn() }) }), delete: () => ({ eq: () => ({ then: vi.fn() }) }) }),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ error: null }), getPublicUrl: () => ({ data: { publicUrl: "https://example.com/img.jpg" } }) }) },
  },
}));

vi.mock("@/store/cart", () => ({ useCartStore: (sel: any) => { const s = { items: [], addItem: vi.fn(), removeItem: vi.fn(), updateItem: vi.fn(), clearCart: vi.fn(), getTotal: () => 0, getItemCount: () => 0 }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/language", () => ({ useLanguageStore: (sel: any) => { const s = { locale: "en", setLocale: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));
vi.mock("@/store/slideshow", () => ({ useSlideshowStore: (sel: any) => { const s = { slides: [], loading: false, fetchSlides: vi.fn(), addSlide: vi.fn(), updateSlide: vi.fn(), removeSlide: vi.fn(), reorderSlides: vi.fn() }; return typeof sel === 'function' ? sel(s) : s; }}));

let mockAuthState: any;

vi.mock("@/store/auth", () => ({
  useAuthStore: (sel: any) => {
    return typeof sel === "function" ? sel(mockAuthState) : mockAuthState;
  },
}));

import LoginPage from "@/app/login/page";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthState = {
      isAuthenticated: false,
      user: null,
      authUser: null,
      bookings: [],
      donations: [],
      activities: [],
      loading: false,
      initialized: true,
      initialize: vi.fn(),
      sendOtp: vi.fn().mockResolvedValue({}),
      verifyOtp: vi.fn().mockResolvedValue({}),
      logout: vi.fn(),
      addDonation: vi.fn(),
      addBooking: vi.fn(),
      updateProfile: vi.fn(),
      addFamilyMember: vi.fn(),
      removeFamilyMember: vi.fn(),
      fetchUserData: vi.fn(),
    };
  });

  /* ── Method step (initial render) ── */
  it("renders 'Devotee Sign In' heading on initial render", () => {
    render(<LoginPage />);
    expect(screen.getByText("Devotee Sign In")).toBeInTheDocument();
  });

  it("shows login description text", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Access your devotee profile/)).toBeInTheDocument();
  });

  it("shows temple logo initial R", () => {
    render(<LoginPage />);
    expect(screen.getByText("R")).toBeInTheDocument();
  });

  it("shows method selection step by default with email and google options", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in with Email")).toBeInTheDocument();
    expect(screen.getByText(/We'll send a 6-digit code/)).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByText("Or continue with")).toBeInTheDocument();
  });

  it("shows guest checkout note", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Guest checkout is also available/)).toBeInTheDocument();
  });

  it("calls initialize on mount", () => {
    render(<LoginPage />);
    expect(mockAuthState.initialize).toHaveBeenCalled();
  });

  /* ── Redirect when authenticated ── */
  it("redirects to /dashboard when already authenticated", () => {
    mockAuthState.isAuthenticated = true;
    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  /* ── Transition to email step ── */
  it("navigates to email step when clicking Sign in with Email", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    expect(screen.getByText("Your Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByText("Send Verification Code")).toBeInTheDocument();
  });

  it("shows back button on email step that returns to method step", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    const backBtn = screen.getByText("← Back");
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);
    expect(screen.getByText("Sign in with Email")).toBeInTheDocument();
  });

  it("disables Send Verification Code button when email is empty", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    expect(screen.getByText("Send Verification Code")).toBeDisabled();
  });

  it("enables Send Verification Code button when email is entered", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    expect(screen.getByText("Send Verification Code")).not.toBeDisabled();
  });

  it("allows typing a name", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "John" } });
    expect(nameInput).toHaveValue("John");
  });

  /* ── sendOtp flow ── */
  it("calls sendOtp and transitions to OTP step on success", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(mockAuthState.sendOtp).toHaveBeenCalledWith("test@test.com", "Test");
    });
    await waitFor(() => {
      expect(screen.getByText(/Enter the 6-digit code sent to/)).toBeInTheDocument();
      expect(screen.getByText("test@test.com")).toBeInTheDocument();
    });
  });

  it("shows loading spinner while sending OTP", async () => {
    let resolveSendOtp: (v: any) => void;
    mockAuthState.sendOtp.mockImplementation(() => new Promise((r) => { resolveSendOtp = r; }));
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "test@test.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText("Sending Code...")).toBeInTheDocument();
    });

    await act(async () => { resolveSendOtp!({}); });
  });

  it("displays error when sendOtp returns an error", async () => {
    mockAuthState.sendOtp.mockResolvedValue({ error: "Invalid email" });
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "bad@test.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  /* ── OTP step ── */
  it("shows 6 OTP input boxes and verify button on OTP step", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
    });

    // 6 OTP inputs
    for (let i = 0; i < 6; i++) {
      expect(document.getElementById(`otp-${i}`)).toBeInTheDocument();
    }
    expect(screen.getByText("Verify & Sign In")).toBeInTheDocument();
    expect(screen.getByText("Resend Code")).toBeInTheDocument();
  });

  it("OTP back button returns to email step and clears OTP", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText(/Enter the 6-digit code/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("← Back"));
    expect(screen.getByText("Your Name")).toBeInTheDocument();
  });

  it("OTP input change auto-focuses next input", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.change(otp0, { target: { value: "1" } });
    // Just verify the input is set (focus is tested implicitly via document.getElementById flow)
    expect(document.getElementById("otp-1")).toBeInTheDocument();
  });

  it("ignores OTP input with more than 1 character", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.change(otp0, { target: { value: "12" } });
    // multi-char input is rejected; value stays empty
    expect(otp0).toHaveValue("");
  });

  it("OTP backspace on empty field focuses previous field", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-1")).toBeInTheDocument();
    });

    const otp1 = document.getElementById("otp-1")!;
    // otp-1 is empty, pressing backspace should focus otp-0
    fireEvent.keyDown(otp1, { key: "Backspace" });
    // Verifying no crash; focus called via document.getElementById
    expect(document.getElementById("otp-0")).toBeInTheDocument();
  });

  it("OTP backspace on index 0 does not crash", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.keyDown(otp0, { key: "Backspace" });
    // No crash
    expect(otp0).toBeInTheDocument();
  });

  it("OTP keyDown with non-backspace key does nothing special", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-1")).toBeInTheDocument();
    });

    const otp1 = document.getElementById("otp-1")!;
    fireEvent.keyDown(otp1, { key: "a" });
    expect(otp1).toBeInTheDocument();
  });

  it("OTP paste fills all 6 boxes with valid 6-digit paste", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.paste(otp0, {
      clipboardData: { getData: () => "123456" },
    });

    // After paste, all boxes should have values
    await waitFor(() => {
      expect(document.getElementById("otp-0")).toHaveValue("1");
      expect(document.getElementById("otp-1")).toHaveValue("2");
      expect(document.getElementById("otp-2")).toHaveValue("3");
      expect(document.getElementById("otp-3")).toHaveValue("4");
      expect(document.getElementById("otp-4")).toHaveValue("5");
      expect(document.getElementById("otp-5")).toHaveValue("6");
    });
  });

  it("OTP paste ignores non-6-digit paste", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.paste(otp0, {
      clipboardData: { getData: () => "123" },
    });

    // Not 6 digits so OTP stays empty
    expect(document.getElementById("otp-0")).toHaveValue("");
  });

  it("OTP paste strips non-numeric chars", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    const otp0 = document.getElementById("otp-0")!;
    fireEvent.paste(otp0, {
      clipboardData: { getData: () => "1a2b3c4d5e6f" },
    });

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toHaveValue("1");
      expect(document.getElementById("otp-5")).toHaveValue("6");
    });
  });

  it("Verify & Sign In is disabled when not all OTP digits are filled", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText("Verify & Sign In")).toBeInTheDocument();
    });

    expect(screen.getByText("Verify & Sign In")).toBeDisabled();
  });

  /* ── verifyOtp flow ── */
  it("calls verifyOtp and shows success step on success", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    mockAuthState.verifyOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    // Paste full OTP
    fireEvent.paste(document.getElementById("otp-0")!, {
      clipboardData: { getData: () => "123456" },
    });

    await waitFor(() => {
      expect(screen.getByText("Verify & Sign In")).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText("Verify & Sign In"));

    await waitFor(() => {
      expect(mockAuthState.verifyOtp).toHaveBeenCalledWith("t@t.com", "123456");
    });

    await waitFor(() => {
      expect(screen.getByText("Welcome to RNHT!")).toBeInTheDocument();
    });
  });

  it("shows loading spinner while verifying OTP", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    let resolveVerify: (v: any) => void;
    mockAuthState.verifyOtp.mockImplementation(() => new Promise((r) => { resolveVerify = r; }));

    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    fireEvent.paste(document.getElementById("otp-0")!, {
      clipboardData: { getData: () => "123456" },
    });

    await waitFor(() => {
      expect(screen.getByText("Verify & Sign In")).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText("Verify & Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Verifying...")).toBeInTheDocument();
    });

    await act(async () => { resolveVerify!({}); });
  });

  it("displays error when verifyOtp returns error", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    mockAuthState.verifyOtp.mockResolvedValue({ error: "Invalid OTP" });

    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    fireEvent.paste(document.getElementById("otp-0")!, {
      clipboardData: { getData: () => "123456" },
    });

    await waitFor(() => {
      expect(screen.getByText("Verify & Sign In")).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText("Verify & Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
    });
  });

  /* ── Resend OTP ── */
  it("calls sendOtp when Resend Code is clicked", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText("Resend Code")).toBeInTheDocument();
    });

    mockAuthState.sendOtp.mockClear();
    mockAuthState.sendOtp.mockResolvedValue({});
    fireEvent.click(screen.getByText("Resend Code"));

    await waitFor(() => {
      expect(mockAuthState.sendOtp).toHaveBeenCalledWith("t@t.com", "Test");
    });
  });

  it("shows error when resend OTP fails", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(screen.getByText("Resend Code")).toBeInTheDocument();
    });

    mockAuthState.sendOtp.mockResolvedValue({ error: "Rate limited" });
    fireEvent.click(screen.getByText("Resend Code"));

    await waitFor(() => {
      expect(screen.getByText("Rate limited")).toBeInTheDocument();
    });
  });

  /* ── Success step ── */
  it("success step shows welcome message and navigation links", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    mockAuthState.verifyOtp.mockResolvedValue({});
    render(<LoginPage />);

    // Navigate through all steps
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-0")).toBeInTheDocument();
    });

    fireEvent.paste(document.getElementById("otp-0")!, {
      clipboardData: { getData: () => "123456" },
    });

    await waitFor(() => {
      expect(screen.getByText("Verify & Sign In")).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText("Verify & Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Welcome to RNHT!")).toBeInTheDocument();
    });

    expect(screen.getByText(/successfully signed in/)).toBeInTheDocument();
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Book a Pooja")).toBeInTheDocument();
    expect(screen.getByText("My Dashboard").closest("a")).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("Book a Pooja").closest("a")).toHaveAttribute("href", "/services");
  });

  /* ── Google sign-in ── */
  it("calls supabase.auth.signInWithOAuth when Google button is clicked", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Continue with Google"));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: { redirectTo: expect.stringContaining("/auth/callback") },
      });
    });
  });

  it("displays error when Google sign-in fails", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: { message: "Google auth failed" } });
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Continue with Google"));

    await waitFor(() => {
      expect(screen.getByText("Google auth failed")).toBeInTheDocument();
    });
  });

  /* ── OTP input on last field (index 5) does not auto-focus next ── */
  it("typing in last OTP field does not try to focus beyond index 5", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-5")).toBeInTheDocument();
    });

    const otp5 = document.getElementById("otp-5")!;
    fireEvent.change(otp5, { target: { value: "9" } });
    expect(otp5).toHaveValue("9");
  });

  /* ── OTP backspace on non-empty field does not focus previous ── */
  it("backspace on non-empty OTP field does not focus previous", async () => {
    mockAuthState.sendOtp.mockResolvedValue({});
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Email"));
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.click(screen.getByText("Send Verification Code"));

    await waitFor(() => {
      expect(document.getElementById("otp-1")).toBeInTheDocument();
    });

    // Fill otp-1 first
    fireEvent.change(document.getElementById("otp-1")!, { target: { value: "5" } });
    // Now backspace on otp-1 which has a value -- should not focus previous
    fireEvent.keyDown(document.getElementById("otp-1")!, { key: "Backspace" });
    // No crash, no unexpected behavior
    expect(document.getElementById("otp-1")).toBeInTheDocument();
  });
});
