import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type SlideType = "image" | "video";

export type Slide = {
  id: string;
  type: SlideType;
  url: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  showText: boolean;
  sortOrder: number;
};

type SlideshowStore = {
  slides: Slide[];
  loading: boolean;
  fetchSlides: () => Promise<void>;
  addSlide: (slide: Slide) => Promise<void>;
  updateSlide: (id: string, updates: Partial<Slide>) => Promise<void>;
  removeSlide: (id: string) => Promise<void>;
  reorderSlides: (slides: Slide[]) => Promise<void>;
};

// Map DB row (snake_case) to app type (camelCase)
function rowToSlide(row: Record<string, unknown>): Slide {
  return {
    id: row.id as string,
    type: (row.type as SlideType) || "image",
    url: (row.url as string) || "",
    title: (row.title as string) || "",
    subtitle: (row.subtitle as string) || "",
    ctaText: (row.cta_text as string) || "Learn More",
    ctaLink: (row.cta_link as string) || "/services",
    isActive: row.is_active as boolean ?? true,
    showText: row.show_text as boolean ?? true,
    sortOrder: (row.sort_order as number) || 0,
  };
}

// Map app type to DB row
function slideToRow(slide: Partial<Slide>) {
  const row: Record<string, unknown> = {};
  if (slide.id !== undefined) row.id = slide.id;
  if (slide.type !== undefined) row.type = slide.type;
  if (slide.url !== undefined) row.url = slide.url;
  if (slide.title !== undefined) row.title = slide.title;
  if (slide.subtitle !== undefined) row.subtitle = slide.subtitle;
  if (slide.ctaText !== undefined) row.cta_text = slide.ctaText;
  if (slide.ctaLink !== undefined) row.cta_link = slide.ctaLink;
  if (slide.isActive !== undefined) row.is_active = slide.isActive;
  if (slide.showText !== undefined) row.show_text = slide.showText;
  if (slide.sortOrder !== undefined) row.sort_order = slide.sortOrder;
  return row;
}

export const useSlideshowStore = create<SlideshowStore>()((set) => ({
  slides: [],
  loading: true,

  fetchSlides: async () => {
    if (!supabase) {
      set({ loading: false });
      return;
    }
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      set({ slides: data.map(rowToSlide), loading: false });
    } else {
      set({ loading: false });
    }
  },

  addSlide: async (slide) => {
    if (!supabase) return;
    const row = slideToRow(slide);
    const { error } = await supabase.from("slides").insert(row);
    if (!error) {
      set((state) => ({ slides: [...state.slides, slide] }));
    }
  },

  updateSlide: async (id, updates) => {
    if (!supabase) return;
    const row = slideToRow(updates);
    const { error } = await supabase.from("slides").update(row).eq("id", id);
    if (!error) {
      set((state) => ({
        slides: state.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
    }
  },

  removeSlide: async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("slides").delete().eq("id", id);
    if (!error) {
      set((state) => ({ slides: state.slides.filter((s) => s.id !== id) }));
    }
  },

  reorderSlides: async (slides) => {
    set({ slides });
    if (!supabase) return;
    // Update sort_order for each slide in DB
    for (let i = 0; i < slides.length; i++) {
      await supabase.from("slides").update({ sort_order: i }).eq("id", slides[i].id);
    }
  },
}));
