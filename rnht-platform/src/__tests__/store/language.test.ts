import { describe, it, expect, beforeEach } from "vitest";
import { useLanguageStore } from "@/store/language";

describe("useLanguageStore", () => {
  beforeEach(() => {
    useLanguageStore.setState({ locale: "en" });
  });

  it("defaults to English", () => {
    expect(useLanguageStore.getState().locale).toBe("en");
  });

  it("changes locale", () => {
    useLanguageStore.getState().setLocale("te");
    expect(useLanguageStore.getState().locale).toBe("te");
  });

  it("changes locale multiple times", () => {
    useLanguageStore.getState().setLocale("hi");
    useLanguageStore.getState().setLocale("ta");
    expect(useLanguageStore.getState().locale).toBe("ta");
  });
});
