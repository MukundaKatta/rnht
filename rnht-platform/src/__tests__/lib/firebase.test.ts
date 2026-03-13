import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApp = { name: "test-app" };
const mockStorage = { app: mockApp };

const mockInitializeApp = vi.fn().mockReturnValue(mockApp);
const mockGetApps = vi.fn().mockReturnValue([]);
const mockGetStorage = vi.fn().mockReturnValue(mockStorage);

vi.mock("firebase/app", () => ({
  initializeApp: mockInitializeApp,
  getApps: mockGetApps,
}));

vi.mock("firebase/storage", () => ({
  getStorage: mockGetStorage,
}));

describe("firebase", () => {
  beforeEach(() => {
    vi.resetModules();
    mockInitializeApp.mockClear();
    mockGetApps.mockClear();
    mockGetStorage.mockClear();
    mockGetApps.mockReturnValue([]);
    mockInitializeApp.mockReturnValue(mockApp);
    mockGetStorage.mockReturnValue(mockStorage);
  });

  it("exports a storage instance", async () => {
    const mod = await import("@/lib/firebase");
    expect(mod.storage).toBeDefined();
  });

  it("initializes a new app when no apps exist", async () => {
    mockGetApps.mockReturnValue([]);

    await import("@/lib/firebase");

    expect(mockGetApps).toHaveBeenCalled();
    expect(mockInitializeApp).toHaveBeenCalledWith({
      projectId: "rnht-platform",
      appId: "1:323074034442:web:4627b3af30d86be9af88f3",
      storageBucket: "rnht-platform.firebasestorage.app",
      apiKey: "AIzaSyALuttMkBcN_fVDlj2vbLVj5lz6MawY7U0",
      authDomain: "rnht-platform.firebaseapp.com",
      messagingSenderId: "323074034442",
    });
  });

  it("reuses existing app when apps already exist", async () => {
    const existingApp = { name: "existing-app" };
    mockGetApps.mockReturnValue([existingApp]);

    await import("@/lib/firebase");

    expect(mockGetApps).toHaveBeenCalled();
    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(mockGetStorage).toHaveBeenCalledWith(existingApp);
  });

  it("calls getStorage with the app instance", async () => {
    mockGetApps.mockReturnValue([]);

    await import("@/lib/firebase");

    expect(mockGetStorage).toHaveBeenCalledWith(mockApp);
  });

  it("passes the correct firebase config to initializeApp", async () => {
    mockGetApps.mockReturnValue([]);

    await import("@/lib/firebase");

    const config = mockInitializeApp.mock.calls[0][0];
    expect(config).toHaveProperty("projectId", "rnht-platform");
    expect(config).toHaveProperty("storageBucket", "rnht-platform.firebasestorage.app");
    expect(config).toHaveProperty("authDomain", "rnht-platform.firebaseapp.com");
    expect(config).toHaveProperty("messagingSenderId", "323074034442");
    expect(config).toHaveProperty("apiKey");
    expect(config).toHaveProperty("appId");
  });

  it("returns the storage object from getStorage", async () => {
    const mod = await import("@/lib/firebase");
    expect(mod.storage).toBe(mockStorage);
  });
});
