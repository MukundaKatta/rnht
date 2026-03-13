import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreateClient = vi.fn().mockReturnValue({ from: vi.fn() });

vi.mock("@supabase/supabase-js", () => ({
  createClient: mockCreateClient,
}));

describe("supabase", () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreateClient.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  });

  it("creates a supabase client with URL and anon key on module load", async () => {
    const { supabase } = await import("@/lib/supabase");

    expect(mockCreateClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key"
    );
    expect(supabase).toBeDefined();
  });

  it("exports a supabase client object", async () => {
    const mod = await import("@/lib/supabase");

    expect(mod.supabase).toBeDefined();
    expect(typeof mod.supabase).toBe("object");
  });

  it("exports getServiceSupabase function", async () => {
    const mod = await import("@/lib/supabase");

    expect(typeof mod.getServiceSupabase).toBe("function");
  });

  describe("getServiceSupabase", () => {
    it("creates a client with service role key", async () => {
      const { getServiceSupabase } = await import("@/lib/supabase");
      mockCreateClient.mockClear();

      const serviceClient = getServiceSupabase();

      expect(mockCreateClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-service-role-key"
      );
      expect(serviceClient).toBeDefined();
    });

    it("creates a new client on each call", async () => {
      const { getServiceSupabase } = await import("@/lib/supabase");
      mockCreateClient.mockClear();

      const firstReturn = { id: "first" };
      const secondReturn = { id: "second" };
      mockCreateClient
        .mockReturnValueOnce(firstReturn)
        .mockReturnValueOnce(secondReturn);

      const client1 = getServiceSupabase();
      const client2 = getServiceSupabase();

      expect(mockCreateClient).toHaveBeenCalledTimes(2);
      expect(client1).toEqual(firstReturn);
      expect(client2).toEqual(secondReturn);
    });

    it("uses the SUPABASE_SERVICE_ROLE_KEY env variable", async () => {
      process.env.SUPABASE_SERVICE_ROLE_KEY = "different-service-key";
      const { getServiceSupabase } = await import("@/lib/supabase");
      mockCreateClient.mockClear();

      getServiceSupabase();

      expect(mockCreateClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "different-service-key"
      );
    });

    it("uses the same URL as the default client", async () => {
      const { getServiceSupabase } = await import("@/lib/supabase");
      mockCreateClient.mockClear();

      getServiceSupabase();

      const callArgs = mockCreateClient.mock.calls[0];
      expect(callArgs[0]).toBe("https://test.supabase.co");
    });
  });
});
