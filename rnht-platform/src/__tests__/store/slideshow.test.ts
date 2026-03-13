import { describe, it, expect, beforeEach } from "vitest";
import { useSlideshowStore, type Slide } from "@/store/slideshow";

const testSlide: Slide = {
  id: "test-slide",
  type: "image",
  url: "https://example.com/photo.jpg",
  title: "Test Slide",
  subtitle: "Test subtitle",
  ctaText: "Learn More",
  ctaLink: "/test",
  isActive: true,
  showText: true,
  sortOrder: 10,
};

describe("useSlideshowStore", () => {
  beforeEach(() => {
    // Reset to default slides
    useSlideshowStore.setState({
      slides: [
        {
          id: "slide-1",
          type: "image",
          url: "",
          title: "Rudra Narayana Hindu Temple",
          subtitle: "A sacred haven for devotees.",
          ctaText: "Book a Pooja",
          ctaLink: "/services",
          isActive: true,
          showText: true,
          sortOrder: 0,
        },
      ],
    });
  });

  it("has slides", () => {
    expect(useSlideshowStore.getState().slides.length).toBeGreaterThan(0);
  });

  it("adds a slide", () => {
    const initial = useSlideshowStore.getState().slides.length;
    useSlideshowStore.getState().addSlide(testSlide);
    expect(useSlideshowStore.getState().slides.length).toBe(initial + 1);
    expect(
      useSlideshowStore.getState().slides.find((s) => s.id === "test-slide")
    ).toBeDefined();
  });

  it("updates a slide", () => {
    useSlideshowStore.getState().updateSlide("slide-1", { title: "Updated" });
    expect(useSlideshowStore.getState().slides[0].title).toBe("Updated");
  });

  it("removes a slide", () => {
    useSlideshowStore.getState().addSlide(testSlide);
    useSlideshowStore.getState().removeSlide("test-slide");
    expect(
      useSlideshowStore.getState().slides.find((s) => s.id === "test-slide")
    ).toBeUndefined();
  });

  it("reorders slides", () => {
    const reordered = [testSlide, ...useSlideshowStore.getState().slides];
    useSlideshowStore.getState().reorderSlides(reordered);
    expect(useSlideshowStore.getState().slides[0].id).toBe("test-slide");
  });
});
