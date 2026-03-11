import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, type CartItem } from "@/store/cart";
import type { Service } from "@/types/database";

const mockService: Service = {
  id: "svc-1",
  category_id: "cat-1",
  name: "Test Pooja",
  slug: "test-pooja",
  short_description: "A test service",
  full_description: null,
  significance: null,
  items_to_bring: null,
  whats_included: null,
  image_url: null,
  price: 51,
  price_type: "fixed",
  price_tiers: null,
  suggested_donation: null,
  duration_minutes: 60,
  location_type: "at_temple",
  is_active: true,
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "item-1",
    service: mockService,
    selectedTier: null,
    quantity: 1,
    bookingDate: "2026-03-15",
    bookingTime: "10:00",
    devoteeName: "Test User",
    devoteeEmail: "test@example.com",
    devoteePhone: "5125550000",
    gotra: "",
    nakshatra: "",
    rashi: "",
    specialInstructions: "",
    familyMembers: [],
    ...overrides,
  };
}

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("starts with an empty cart", () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });

  it("adds an item", () => {
    const item = createCartItem();
    useCartStore.getState().addItem(item);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe("item-1");
  });

  it("removes an item", () => {
    useCartStore.getState().addItem(createCartItem({ id: "item-1" }));
    useCartStore.getState().addItem(createCartItem({ id: "item-2" }));
    useCartStore.getState().removeItem("item-1");
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].id).toBe("item-2");
  });

  it("updates an item", () => {
    useCartStore.getState().addItem(createCartItem());
    useCartStore.getState().updateItem("item-1", { quantity: 3 });
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("clears the cart", () => {
    useCartStore.getState().addItem(createCartItem({ id: "item-1" }));
    useCartStore.getState().addItem(createCartItem({ id: "item-2" }));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("calculates total from fixed price", () => {
    useCartStore.getState().addItem(createCartItem({ quantity: 2 }));
    expect(useCartStore.getState().getTotal()).toBe(102);
  });

  it("calculates total from selected tier", () => {
    useCartStore.getState().addItem(
      createCartItem({
        selectedTier: { name: "Premium", price: 101, description: "Premium" },
        quantity: 1,
      })
    );
    expect(useCartStore.getState().getTotal()).toBe(101);
  });

  it("returns correct item count", () => {
    useCartStore.getState().addItem(createCartItem({ id: "a" }));
    useCartStore.getState().addItem(createCartItem({ id: "b" }));
    useCartStore.getState().addItem(createCartItem({ id: "c" }));
    expect(useCartStore.getState().getItemCount()).toBe(3);
  });
});
