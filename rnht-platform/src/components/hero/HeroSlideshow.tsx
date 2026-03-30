"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Three-panel Ken Burns hero using deity-collage.png (2714 × 1294).
 *
 * With object-cover on a tall narrow panel the image renders at:
 *   rendered_width = panel_height × (2714/1294)
 *
 * Each deity sits at 1/6, 3/6, 5/6 of the original 2714px width.
 * CSS object-position formula to center deity in its panel:
 *   x% = (deity_center_rendered – panel_center) / (rendered_width – panel_width) × 100
 *
 * At a typical viewport (1440 × 900 → panel 480 × 900, rendered_w ≈ 1887):
 *   Left  deity center ≈ 314 px → x ≈  5 %
 *   Mid   deity center ≈ 943 px → x = 50 %
 *   Right deity center ≈ 1572px → x ≈ 95 %
 *
 * These percentages are viewport-independent because object-position % is
 * calculated relative to (image_width – container_width), which always keeps
 * the same deity centered regardless of viewport size.
 */

const panels = [
  {
    objectPos: "5% center",
    animName:  "kb-left",
    delay:     "0s",
    label:     "Shiva lingam adorned with flowers",
  },
  {
    objectPos: "50% center",
    animName:  "kb-center",
    delay:     "1s",
    label:     "Goddess Lakshmi in full regalia",
  },
  {
    objectPos: "95% center",
    animName:  "kb-right",
    delay:     "2s",
    label:     "Narayana with garlands",
  },
] as const;

export function HeroSlideshow() {
  return (
    <>
      <style>{`
        /* Left: slow zoom-in with slight drift right */
        @keyframes kb-left {
          0%   { transform: scale(1.00) translate(0%,    0%);    }
          100% { transform: scale(1.07) translate(-1.5%, -1%);   }
        }
        /* Center: slow zoom-out with upward drift */
        @keyframes kb-center {
          0%   { transform: scale(1.07) translate(0%,  1%);   }
          100% { transform: scale(1.00) translate(0%, -0.5%); }
        }
        /* Right: gentle horizontal pan */
        @keyframes kb-right {
          0%   { transform: scale(1.04) translate(1.5%,  0.5%); }
          100% { transform: scale(1.04) translate(-1.5%, -0.5%); }
        }
        .kb-left   { animation: kb-left   14s ease-in-out infinite alternate; }
        .kb-center { animation: kb-center 16s ease-in-out infinite alternate; }
        .kb-right  { animation: kb-right  12s ease-in-out infinite alternate; }
      `}</style>

      <section className="relative z-[2] w-full h-[75vh] sm:h-screen overflow-hidden bg-[#2A0612]">
        {/* Gold top border */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-temple-gold/0 via-temple-gold to-temple-gold/0 z-30" />

        {/* Three equal panels */}
        <div className="absolute inset-0 grid grid-cols-3">
          {panels.map((panel, i) => (
            <div key={i} className="relative overflow-hidden">
              {/* Ken Burns wrapper — same size as panel, let overflow-hidden clip the zoom */}
              <div className={`absolute inset-0 ${panel.animName === "kb-left" ? "kb-left" : panel.animName === "kb-center" ? "kb-center" : "kb-right"}`}
                style={{ animationDelay: panel.delay, willChange: "transform" }}
              >
                <Image
                  src="/deity-collage.png"
                  alt={panel.label}
                  fill
                  className="object-cover"
                  style={{ objectPosition: panel.objectPos }}
                  sizes="34vw"
                  priority={i === 1}
                />
              </div>

              {/* Dim side panels to emphasise center */}
              {i !== 1 && (
                <div className="absolute inset-0 bg-[#2A0612]/15 pointer-events-none z-10" />
              )}

              {/* Inner shadow blending toward center on sides */}
              {i === 0 && (
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-[#2A0612]/55 pointer-events-none z-10" />
              )}
              {i === 2 && (
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-l from-transparent to-[#2A0612]/55 pointer-events-none z-10" />
              )}

              {/* Gold dividers flanking center */}
              {i === 1 && (
                <>
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-temple-gold/0 via-temple-gold/60 to-temple-gold/0 z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-temple-gold/0 via-temple-gold/60 to-temple-gold/0 z-20 pointer-events-none" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom gradient — CTA readability */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#2A0612]/90 via-[#2A0612]/45 to-transparent z-20 pointer-events-none" />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#2A0612]/20 to-transparent z-20 pointer-events-none" />

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
