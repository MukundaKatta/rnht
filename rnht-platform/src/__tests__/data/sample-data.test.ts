import { describe, it, expect } from "vitest";
import {
  sampleCategories,
  sampleServices,
  sampleEvents,
} from "@/lib/sample-data";

describe("sampleCategories", () => {
  it("has at least one category", () => {
    expect(sampleCategories.length).toBeGreaterThan(0);
  });

  it("each category has required fields", () => {
    for (const cat of sampleCategories) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(typeof cat.sort_order).toBe("number");
    }
  });

  it("has unique IDs", () => {
    const ids = sampleCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique slugs", () => {
    const slugs = sampleCategories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("sampleServices", () => {
  it("has at least one service", () => {
    expect(sampleServices.length).toBeGreaterThan(0);
  });

  it("each service has required fields", () => {
    for (const svc of sampleServices) {
      expect(svc.id).toBeTruthy();
      expect(svc.name).toBeTruthy();
      expect(svc.slug).toBeTruthy();
      expect(svc.short_description).toBeTruthy();
      expect(svc.duration_minutes).toBeGreaterThan(0);
      expect(["fixed", "tiered", "custom", "donation"]).toContain(
        svc.price_type
      );
      expect(["at_temple", "outside_temple", "both"]).toContain(
        svc.location_type
      );
    }
  });

  it("has unique IDs", () => {
    const ids = sampleServices.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("references valid category IDs", () => {
    const catIds = new Set(sampleCategories.map((c) => c.id));
    for (const svc of sampleServices) {
      expect(catIds.has(svc.category_id)).toBe(true);
    }
  });

  it("fixed-price services have a price", () => {
    for (const svc of sampleServices.filter((s) => s.price_type === "fixed")) {
      expect(svc.price).toBeGreaterThan(0);
    }
  });

  it("tiered-price services have price tiers", () => {
    for (const svc of sampleServices.filter((s) => s.price_type === "tiered")) {
      expect(svc.price_tiers).not.toBeNull();
      expect(svc.price_tiers!.length).toBeGreaterThan(0);
      for (const tier of svc.price_tiers!) {
        expect(tier.name).toBeTruthy();
        expect(tier.price).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("sampleEvents", () => {
  it("has at least one event", () => {
    expect(sampleEvents.length).toBeGreaterThan(0);
  });

  it("each event has required fields", () => {
    for (const evt of sampleEvents) {
      expect(evt.id).toBeTruthy();
      expect(evt.title).toBeTruthy();
      expect(evt.start_date).toBeTruthy();
      expect(["festival", "regular_pooja", "community", "class"]).toContain(
        evt.event_type
      );
    }
  });

  it("has unique IDs", () => {
    const ids = sampleEvents.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
