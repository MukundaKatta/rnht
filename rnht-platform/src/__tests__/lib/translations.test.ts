import { describe, it, expect } from "vitest";
import {
  translations,
  localeNames,
  localeLabels,
  t,
  type Locale,
} from "@/lib/i18n/translations";

const ALL_LOCALES: Locale[] = [
  "en", "te", "hi", "ta", "kn", "mr", "ml", "gu", "bn", "pa",
];

const ALL_TRANSLATION_KEYS = [
  // Navigation
  "nav.home",
  "nav.gallery",
  "nav.services",
  "nav.priests",
  "nav.aboutUs",
  "nav.contactUs",
  "nav.calendar",
  "nav.panchangam",
  "nav.donate",
  "nav.donateNow",
  "nav.more",
  "nav.login",
  "nav.language",
  // Home
  "home.title",
  "home.subtitle",
  "home.bookPooja",
  "home.viewCalendar",
  "home.templeHours",
  "home.ourServices",
  "home.upcomingEvents",
  "home.supportTemple",
  "home.donateNow",
  // Services
  "services.title",
  "services.atTemple",
  "services.outsideTemple",
  "services.all",
  "services.search",
  "services.bookNow",
  "services.inquire",
  "services.duration",
  "services.price",
  // Donate
  "donate.title",
  "donate.subtitle",
  "donate.amount",
  "donate.fund",
  "donate.recurring",
  "donate.dollarADay",
  "donate.zelle",
  "donate.thankYou",
  // Common
  "common.submit",
  "common.cancel",
  "common.save",
  "common.close",
  "common.loading",
  "common.learnMore",
] as const;

describe("translations", () => {
  describe("localeNames", () => {
    it("contains entries for all 10 locales", () => {
      expect(Object.keys(localeNames)).toHaveLength(10);
      for (const locale of ALL_LOCALES) {
        expect(localeNames[locale]).toBeDefined();
        expect(typeof localeNames[locale]).toBe("string");
        expect(localeNames[locale].length).toBeGreaterThan(0);
      }
    });

    it("has English as 'English'", () => {
      expect(localeNames.en).toBe("English");
    });

    it("has native script names for non-English locales", () => {
      // Telugu should be in Telugu script
      expect(localeNames.te).toBe("\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41");
      // Hindi should be in Devanagari script
      expect(localeNames.hi).toBe("\u0939\u093F\u0928\u094D\u0926\u0940");
    });

    it("contains all expected locales", () => {
      const keys = Object.keys(localeNames);
      for (const locale of ALL_LOCALES) {
        expect(keys).toContain(locale);
      }
    });
  });

  describe("localeLabels", () => {
    it("contains entries for all 10 locales", () => {
      expect(Object.keys(localeLabels)).toHaveLength(10);
      for (const locale of ALL_LOCALES) {
        expect(localeLabels[locale]).toBeDefined();
        expect(typeof localeLabels[locale]).toBe("string");
        expect(localeLabels[locale].length).toBeGreaterThan(0);
      }
    });

    it("has English labels in English for all locales", () => {
      expect(localeLabels.en).toBe("English");
      expect(localeLabels.te).toBe("Telugu");
      expect(localeLabels.hi).toBe("Hindi");
      expect(localeLabels.ta).toBe("Tamil");
      expect(localeLabels.kn).toBe("Kannada");
      expect(localeLabels.mr).toBe("Marathi");
      expect(localeLabels.ml).toBe("Malayalam");
      expect(localeLabels.gu).toBe("Gujarati");
      expect(localeLabels.bn).toBe("Bengali");
      expect(localeLabels.pa).toBe("Punjabi");
    });
  });

  describe("translations object", () => {
    it("contains all 10 locales", () => {
      expect(Object.keys(translations)).toHaveLength(10);
      for (const locale of ALL_LOCALES) {
        expect(translations[locale]).toBeDefined();
      }
    });

    it.each(ALL_LOCALES)(
      "locale '%s' contains all translation keys",
      (locale) => {
        const localeTranslations = translations[locale];
        for (const key of ALL_TRANSLATION_KEYS) {
          expect(
            localeTranslations[key],
            `Missing key '${key}' for locale '${locale}'`
          ).toBeDefined();
          expect(
            typeof localeTranslations[key],
            `Key '${key}' for locale '${locale}' should be a string`
          ).toBe("string");
          expect(
            localeTranslations[key].length,
            `Key '${key}' for locale '${locale}' should not be empty`
          ).toBeGreaterThan(0);
        }
      }
    );

    it("all locales have the same number of keys", () => {
      const enKeyCount = Object.keys(translations.en).length;
      for (const locale of ALL_LOCALES) {
        expect(Object.keys(translations[locale])).toHaveLength(enKeyCount);
      }
    });

    it("all locales have exactly the same set of keys as English", () => {
      const enKeys = Object.keys(translations.en).sort();
      for (const locale of ALL_LOCALES) {
        const localeKeys = Object.keys(translations[locale]).sort();
        expect(localeKeys).toEqual(enKeys);
      }
    });

    it("non-English locales have different values from English for locale-specific keys", () => {
      const nonEnLocales = ALL_LOCALES.filter((l) => l !== "en");
      for (const locale of nonEnLocales) {
        // At minimum, nav.home should differ from English
        expect(translations[locale]["nav.home"]).not.toBe(
          translations.en["nav.home"]
        );
      }
    });

    it("English locale has expected values for key sections", () => {
      expect(translations.en["nav.home"]).toBe("Home");
      expect(translations.en["nav.gallery"]).toBe("Gallery");
      expect(translations.en["nav.services"]).toBe("Services");
      expect(translations.en["home.title"]).toBe("Rudra Narayana Hindu Temple");
      expect(translations.en["home.subtitle"]).toBe(
        "Your spiritual home in Austin, Texas"
      );
      expect(translations.en["services.bookNow"]).toBe("Book Now");
      expect(translations.en["donate.title"]).toBe("Support Our Temple");
      expect(translations.en["common.submit"]).toBe("Submit");
      expect(translations.en["common.cancel"]).toBe("Cancel");
      expect(translations.en["common.loading"]).toBe("Loading...");
    });
  });

  describe("t() function", () => {
    it("returns the English translation by default", () => {
      expect(t("nav.home")).toBe("Home");
      expect(t("home.title")).toBe("Rudra Narayana Hindu Temple");
      expect(t("common.submit")).toBe("Submit");
    });

    it("returns the translation for a specified locale", () => {
      expect(t("nav.home", "te")).toBe("\u0C39\u0C4B\u0C2E\u0C4D");
      expect(t("nav.home", "hi")).toBe("\u0939\u094B\u092E");
    });

    it("returns English translation for each key when locale is 'en'", () => {
      for (const key of ALL_TRANSLATION_KEYS) {
        expect(t(key, "en")).toBe(translations.en[key]);
      }
    });

    it.each(ALL_LOCALES)(
      "returns correct translations for locale '%s'",
      (locale) => {
        for (const key of ALL_TRANSLATION_KEYS) {
          const result = t(key, locale);
          expect(result).toBe(translations[locale][key]);
        }
      }
    );

    it("falls back to English when locale translation is missing", () => {
      // Use a cast to simulate an invalid locale
      const result = t("nav.home", "xx" as Locale);
      // The nullish coalescing should fall through to translations.en
      expect(result).toBe("Home");
    });

    it("returns the key itself as final fallback", () => {
      // If both the locale and English translation are missing, return the key
      // This tests the `?? key` part of the fallback chain
      const result = t("nonexistent.key" as any, "xx" as Locale);
      expect(result).toBe("nonexistent.key");
    });

    it("defaults locale parameter to 'en' when not provided", () => {
      const withDefault = t("nav.home");
      const withExplicit = t("nav.home", "en");
      expect(withDefault).toBe(withExplicit);
    });

    it("returns a string for every valid key and locale combination", () => {
      for (const locale of ALL_LOCALES) {
        for (const key of ALL_TRANSLATION_KEYS) {
          const result = t(key, locale);
          expect(typeof result).toBe("string");
          expect(result.length).toBeGreaterThan(0);
        }
      }
    });

    it("works correctly with navigation keys", () => {
      expect(t("nav.donate", "en")).toBe("Donate");
      expect(t("nav.login", "en")).toBe("Sign In");
      expect(t("nav.language", "en")).toBe("Language");
    });

    it("works correctly with service keys", () => {
      expect(t("services.title", "en")).toBe("Pooja & Spiritual Services");
      expect(t("services.atTemple", "en")).toBe("At Temple");
      expect(t("services.outsideTemple", "en")).toBe("Outside Temple");
    });

    it("works correctly with donation keys", () => {
      expect(t("donate.dollarADay", "en")).toBe("Dollar A Day Program");
      expect(t("donate.zelle", "en")).toBe("Donate via Zelle");
      expect(t("donate.thankYou", "en")).toBe(
        "Thank You for Your Generosity!"
      );
    });

    it("works correctly with common keys", () => {
      expect(t("common.save", "en")).toBe("Save");
      expect(t("common.close", "en")).toBe("Close");
      expect(t("common.learnMore", "en")).toBe("Learn More");
    });
  });
});
