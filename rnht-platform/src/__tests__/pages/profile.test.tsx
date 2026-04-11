import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/profile",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

const authState: any = {
  isAuthenticated: false,
  authUser: null,
  user: null,
  bookings: [],
  donations: [],
  activities: [],
  loading: false,
  initialized: true,
  initialize: vi.fn(),
  sendOtp: vi.fn().mockResolvedValue({}),
  verifyOtp: vi.fn().mockResolvedValue({}),
  sendPhoneOtp: vi.fn().mockResolvedValue({}),
  verifyPhoneOtp: vi.fn().mockResolvedValue({}),
  logout: vi.fn(),
  updateProfile: vi.fn().mockResolvedValue({}),
  addFamilyMember: vi.fn(),
  removeFamilyMember: vi.fn(),
  fetchUserData: vi.fn(),
};

vi.mock("@/store/auth", () => ({
  useAuthStore: (sel: any) => (typeof sel === "function" ? sel(authState) : authState),
}));

vi.mock("@/store/language", () => ({
  useLanguageStore: (sel: any) => {
    const s = { locale: "en", setLocale: vi.fn() };
    return typeof sel === "function" ? sel(s) : s;
  },
}));

import ProfilePage from "@/app/profile/page";

function setSignedOut() {
  authState.isAuthenticated = false;
  authState.authUser = null;
  authState.user = null;
  authState.bookings = [];
  authState.donations = [];
  authState.activities = [];
}

function setSignedIn() {
  authState.isAuthenticated = true;
  authState.authUser = { id: "user-1", email: "devotee@example.com" };
  authState.user = {
    id: "user-1",
    name: "Rajesh Sharma",
    email: "devotee@example.com",
    phone: "+15125550123",
    gotra: "Bharadwaja",
    nakshatra: "Pushya",
    rashi: "Karka",
    familyMembers: [],
    createdAt: "2026-01-01T00:00:00Z",
  };
  authState.bookings = [];
  authState.donations = [];
  authState.activities = [];
}

describe("ProfilePage", () => {
  beforeEach(() => {
    setSignedOut();
  });

  it("renders without crashing when the user is signed out", () => {
    const { container } = render(<ProfilePage />);
    // The component should render *something* and not throw. In the signed-
    // out state it typically shows a sign-in prompt or redirects via the
    // router mock. We only assert it mounted.
    expect(container).toBeTruthy();
  });

  it("shows the devotee profile heading when signed in", () => {
    setSignedIn();
    render(<ProfilePage />);
    // The page should surface the user's name somewhere in the header.
    expect(screen.getAllByText("Rajesh Sharma").length).toBeGreaterThan(0);
  });

  it("surfaces the devotee email when signed in", () => {
    setSignedIn();
    render(<ProfilePage />);
    expect(
      screen.getAllByText(/devotee@example\.com/).length
    ).toBeGreaterThan(0);
  });
});
