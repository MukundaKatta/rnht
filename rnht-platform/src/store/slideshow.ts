import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  sortOrder: number;
};

type SlideshowStore = {
  slides: Slide[];
  addSlide: (slide: Slide) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  removeSlide: (id: string) => void;
  reorderSlides: (slides: Slide[]) => void;
};

const defaultSlides: Slide[] = [
  {
    id: "slide-1",
    type: "image",
    url: "/slideshow/slide-01.jpg",
    title: "Rudra Narayana Hindu Temple",
    subtitle: "A sacred haven for devotees seeking spiritual growth, peace, and connection with the divine.",
    ctaText: "Book a Pooja",
    ctaLink: "/services",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "slide-2",
    type: "image",
    url: "/slideshow/slide-02.jpg",
    title: "Community & Festivals",
    subtitle: "Join our vibrant community for festivals, Annadanam, education programs, and spiritual gatherings.",
    ctaText: "View Events",
    ctaLink: "/calendar",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "slide-3",
    type: "image",
    url: "/slideshow/slide-03.jpg",
    title: "Sri Rama Parivar Celebrations",
    subtitle: "Experience the grandeur of traditional festivals with beautifully decorated mandapams and divine darshan.",
    ctaText: "View Gallery",
    ctaLink: "/gallery",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "slide-4",
    type: "image",
    url: "/slideshow/slide-04.jpg",
    title: "Traditional Vedic Ceremonies",
    subtitle: "Authentic poojas, homams, and samskaras performed by experienced priests in the Austin, TX area.",
    ctaText: "View Services",
    ctaLink: "/services",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "slide-5",
    type: "image",
    url: "/slideshow/slide-05.jpg",
    title: "Home Pooja Services",
    subtitle: "Our priests travel to your home for personalized ceremonies across the greater Texas area.",
    ctaText: "Book Now",
    ctaLink: "/services",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "slide-6",
    type: "image",
    url: "/slideshow/slide-06.jpg",
    title: "Sacred Pooja Materials",
    subtitle: "Every ceremony prepared with authentic Vedic materials and proper traditional procedures.",
    ctaText: "Our Services",
    ctaLink: "/services",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "slide-7",
    type: "image",
    url: "/slideshow/slide-07.jpg",
    title: "Divine Darshan",
    subtitle: "Experience the divine presence of beautifully adorned deities at our temple ceremonies.",
    ctaText: "View Gallery",
    ctaLink: "/gallery",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "slide-8",
    type: "image",
    url: "/slideshow/slide-08.jpg",
    title: "Deity Worship & Abhishekam",
    subtitle: "Daily worship and special abhishekam services bringing devotees closer to the divine.",
    ctaText: "Learn More",
    ctaLink: "/about",
    isActive: true,
    sortOrder: 7,
  },
];

export const useSlideshowStore = create<SlideshowStore>()(
  persist(
    (set) => ({
      slides: defaultSlides,
      addSlide: (slide) =>
        set((state) => ({ slides: [...state.slides, slide] })),
      updateSlide: (id, updates) =>
        set((state) => ({
          slides: state.slides.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      removeSlide: (id) =>
        set((state) => ({
          slides: state.slides.filter((s) => s.id !== id),
        })),
      reorderSlides: (slides) => set({ slides }),
    }),
    { name: "rnht-slideshow-v2" }
  )
);
