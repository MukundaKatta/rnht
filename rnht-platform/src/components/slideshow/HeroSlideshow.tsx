"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react";
import { useSlideshowStore, type Slide } from "@/store/slideshow";

const gradients = [
  "from-temple-maroon-deep via-temple-maroon to-temple-red-dark",
  "from-temple-maroon via-[#6B1A2A] to-temple-red-dark",
  "from-[#1A0B2E] via-temple-maroon to-temple-red-dark",
  "from-temple-red-dark via-temple-maroon to-temple-maroon-deep",
];

export function HeroSlideshow() {
  const slides = useSlideshowStore((s) => s.slides);
  const activeSlides = slides
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slideCount = activeSlides.length || 1;

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(((index % slideCount) + slideCount) % slideCount);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [slideCount, isTransitioning]
  );

  const goNext = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [isPaused, goNext, slideCount]);

  if (activeSlides.length === 0) {
    return (
      <section className="relative overflow-hidden h-full bg-gradient-to-br from-temple-maroon-deep via-temple-maroon to-temple-red-dark">
        <div className="relative mx-auto flex h-full items-center max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Rudra Narayana
              <span className="block text-temple-gold-light">Hindu Temple</span>
            </h1>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = activeSlides[currentIndex];
  const gradient = gradients[currentIndex % gradients.length];

  return (
    <section
      className="relative overflow-hidden h-full"
      aria-roledescription="carousel"
      aria-label="Temple highlights"
    >
      {/* Slides */}
      <div className="relative h-full">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${
              index === currentIndex ? "relative h-full" : "absolute inset-0"
            } transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
            aria-hidden={index !== currentIndex}
          >
            {/* Background */}
            {slide.type === "video" && slide.url ? (
              <div className="absolute inset-0">
                <video
                  src={slide.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon-deep/90 via-temple-maroon/70 to-temple-maroon-deep/80" />
              </div>
            ) : slide.url ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-temple-maroon-deep/85 via-temple-maroon/65 to-temple-maroon-deep/75" />
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
              </div>
            )}

            {/* Content */}
            <div className="relative mx-auto flex h-full items-center max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-temple-gold/15 px-4 py-1.5 text-sm text-temple-gold-light backdrop-blur-sm border border-temple-gold/20">
                  <Shield className="h-4 w-4" />
                  <span className="font-accent">501(c)(3) Registered Nonprofit</span>
                </div>
                <h2 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {slide.title.includes("Hindu Temple") ? (
                    <>
                      {slide.title.replace(" Hindu Temple", "")}
                      <span className="block text-temple-gold-light">Hindu Temple</span>
                    </>
                  ) : (
                    slide.title
                  )}
                </h2>
                <p className="mt-4 text-lg sm:text-xl text-gray-200 leading-relaxed font-accent">
                  {slide.subtitle}
                </p>
                <p className="mt-3 text-sm sm:text-base text-temple-gold-light/80 italic tracking-[0.2em] font-accent">
                  &#x0964; DHARMO RAKSHATI RAKSHITAHA &#x0964;
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {slide.ctaText && slide.ctaLink && (
                    <Link
                      href={slide.ctaLink}
                      className="btn-primary bg-temple-gold text-temple-maroon-deep hover:bg-temple-gold-light font-bold"
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                  <a
                    href="https://wa.me/message/55G67NQ6CQENA1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary bg-green-600 text-white hover:bg-green-500"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Us
                  </a>
                  <Link
                    href="/calendar"
                    className="btn-primary bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20"
                  >
                    View Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {slideCount > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2.5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-black/40 hover:border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2.5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-black/40 hover:border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots + Pause */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-black/40"
              aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </button>
            <div className="flex gap-2">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-temple-gold shadow-gold-glow"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
