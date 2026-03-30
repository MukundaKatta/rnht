"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Three-panel hero using deity-collage.png (2714×1294).
 * Each panel shows a different third of the collage via object-position,
 * with an independent CSS Ken Burns animation so no JavaScript timers are needed.
 *
 * Panels:
 *  Left   → object-position: 16% center  (Shiva lingam)
 *  Center → object-position: 50% center  (Goddess / Lakshmi)
 *  Right  → object-position: 84% center  (Narayana / third deity)
 */

const panels = [
  { pos: "16% center", animClass: "animate-kb-left",   delay: "0s"   },
  { pos: "50% center", animClass: "animate-kb-center",  delay: "0.8s" },
  { pos: "84% center", animClass: "animate-kb-right",   delay: "1.6s" },
];

export function HeroSlideshow() {
  return (
    <>
      {/* Ken Burns keyframes injected once */}
      <style>{`
        @keyframes kb-zoom-in {
          0%   { transform: scale(1.00) translate(0%,    0%);   }
          100% { transform: scale(1.10) translate(-1.5%, -1%);  }
        }
        @keyframes kb-zoom-out {
          0%   { transform: scale(1.10) translate(0%,   1%);  }
          100% { transform: scale(1.00) translate(1.5%, 0%);  }
        }
        @keyframes kb-pan {
          0%   { transform: scale(1.06) translate(-2%, 1.5%); }
          100% { transform: scale(1.06) translate(2%,  -1.5%); }
        }
        .animate-kb-left   { animation: kb-zoom-in  14s ease-in-out infinite alternate; }
        .animate-kb-center { animation: kb-zoom-out 16s ease-in-out infinite alternate; }
        .animate-kb-right  { animation: kb-pan      12s ease-in-out infinite alternate; }
      `}</style>

      <section className="relative z-[2] w-full h-[75vh] sm:h-screen overflow-hidden bg-[#2A0612]">
        {/* Top gold shimmer */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-temple-gold/0 via-temple-gold to-temple-gold/0 z-30" />

        {/* Three panels */}
        <div className="absolute inset-0 grid grid-cols-3">
          {panels.map((panel, i) => (
            <div key={i} className="relative overflow-hidden">
              <div
                className={`absolute inset-[-8%] ${panel.animClass}`}
                style={{ animationDelay: panel.delay, willChange: "transform" }}
              >
                <Image
                  src="/deity-collage.png"
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: panel.pos }}
                  sizes="34vw"
                  priority={i === 1}
                />
              </div>

              {/* Dim the side panels to make center deity pop */}
              {i !== 1 && (
                <div className="absolute inset-0 bg-[#2A0612]/20 pointer-events-none z-10" />
              )}

              {/* Inner shadow blending toward center */}
              {i === 0 && (
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#2A0612]/60 z-10 pointer-events-none" />
              )}
              {i === 2 && (
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-l from-transparent to-[#2A0612]/60 z-10 pointer-events-none" />
              )}

              {/* Gold dividers on center panel */}
              {i === 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-temple-gold/0 via-temple-gold/55 to-temple-gold/0 z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-temple-gold/0 via-temple-gold/55 to-temple-gold/0 z-20 pointer-events-none" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom gradient for CTA readability */}
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#2A0612]/90 via-[#2A0612]/50 to-transparent z-20 pointer-events-none" />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#2A0612]/25 to-transparent z-20 pointer-events-none" />

        {/* CTA Buttons */}
        <div className="absolute inset-x-0 bottom-10 sm:bottom-16 lg:bottom-20 z-30">
          <div className="flex justify-center gap-3 sm:gap-8">
            <Link
              href="/services"
              className="px-6 sm:px-14 py-3.5 sm:py-4 text-sm sm:text-lg font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #C5973E 0%, #E8D5A3 40%, #C5973E 100%)",
                color: "#2A0612",
                borderRadius: "4px",
                boxShadow: "0 6px 30px rgba(197,151,62,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              Book a Pooja
            </Link>
            <Link
              href="/donate"
              className="px-6 sm:px-14 py-3.5 sm:py-4 text-sm sm:text-lg font-bold tracking-wide transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "transparent",
                color: "#E8D5A3",
                border: "2px solid rgba(197,151,62,0.65)",
                borderRadius: "4px",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 20px rgba(197,151,62,0.12)",
              }}
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
