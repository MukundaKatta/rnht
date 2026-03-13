import { describe, it, expect, vi, beforeEach } from "vitest";

const mockLoadStripe = vi.fn().mockResolvedValue({ elements: vi.fn() });

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: mockLoadStripe,
}));

describe("stripe", () => {
  beforeEach(() => {
    vi.resetModules();
    mockLoadStripe.mockClear();
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123";
  });

  it("exports getStripe function", async () => {
    const mod = await import("@/lib/stripe");
    expect(typeof mod.getStripe).toBe("function");
  });

  it("calls loadStripe with the publishable key on first call", async () => {
    const { getStripe } = await import("@/lib/stripe");

    getStripe();

    expect(mockLoadStripe).toHaveBeenCalledWith("pk_test_123");
    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });

  it("returns a promise from loadStripe", async () => {
    const mockStripeInstance = { elements: vi.fn() };
    mockLoadStripe.mockResolvedValue(mockStripeInstance);

    const { getStripe } = await import("@/lib/stripe");
    const result = getStripe();

    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toEqual(mockStripeInstance);
  });

  it("returns the same promise on subsequent calls (singleton)", async () => {
    const { getStripe } = await import("@/lib/stripe");

    const first = getStripe();
    const second = getStripe();
    const third = getStripe();

    expect(first).toBe(second);
    expect(second).toBe(third);
    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });

  it("only calls loadStripe once even with multiple calls", async () => {
    const { getStripe } = await import("@/lib/stripe");

    getStripe();
    getStripe();
    getStripe();
    getStripe();
    getStripe();

    expect(mockLoadStripe).toHaveBeenCalledTimes(1);
  });

  it("uses the correct environment variable", async () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_live_abc";
    const { getStripe } = await import("@/lib/stripe");

    getStripe();

    expect(mockLoadStripe).toHaveBeenCalledWith("pk_live_abc");
  });

  it("lazy-loads stripe (does not call loadStripe on module import)", async () => {
    // Just importing the module should NOT call loadStripe
    await import("@/lib/stripe");

    expect(mockLoadStripe).not.toHaveBeenCalled();
  });
});
