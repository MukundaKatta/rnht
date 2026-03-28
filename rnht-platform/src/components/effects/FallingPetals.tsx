"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Flower2 } from "lucide-react";

type Petal = {
  id: number;
  left: number;       // % from left
  size: number;        // px
  duration: number;    // seconds
  delay: number;       // seconds
  swayAmount: number;  // px horizontal sway
  rotation: number;    // starting rotation
  type: "marigold" | "rose" | "jasmine" | "lotus";
  opacity: number;
};

const PETAL_COLORS = {
  marigold: ["#F59E0B", "#F97316", "#EAB308", "#FB923C"],
  rose: ["#FB7185", "#F43F5E", "#E11D48", "#FDA4AF"],
  jasmine: ["#FEFCE8", "#FEF9C3", "#FDE68A", "#FFFBEB"],
  lotus: ["#F9A8D4", "#F472B6", "#EC4899", "#FBCFE8", "#F0ABFC", "#D946EF"],
};

function PetalSVG({ type, color }: { type: Petal["type"]; color: string }) {
  switch (type) {
    case "marigold":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <circle cx="10" cy="10" r="4" fill={color} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="10"
              cy="3"
              rx="2.5"
              ry="3.5"
              fill={color}
              opacity="0.85"
              transform={`rotate(${angle} 10 10)`}
            />
          ))}
        </svg>
      );
    case "rose":
      return (
        <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
          <ellipse cx="8" cy="6" rx="5" ry="6" fill={color} opacity="0.8" />
          <ellipse cx="8" cy="7" rx="3.5" ry="4" fill={color} />
          <path d="M5 9 Q8 14 11 9" fill={color} opacity="0.6" />
        </svg>
      );
    case "jasmine":
      return (
        <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="8"
              cy="3"
              rx="2"
              ry="3.5"
              fill={color}
              opacity="0.9"
              transform={`rotate(${angle} 8 8)`}
            />
          ))}
          <circle cx="8" cy="8" r="2" fill="#FDE68A" />
        </svg>
      );
    case "lotus":
      return (
        <svg viewBox="0 0 40 36" fill="none" className="w-full h-full">
          {/* Outer petals - spread wide */}
          <ellipse cx="6" cy="20" rx="5" ry="12" fill={color} opacity="0.35" transform="rotate(-35 6 20)" />
          <ellipse cx="34" cy="20" rx="5" ry="12" fill={color} opacity="0.35" transform="rotate(35 34 20)" />
          {/* Mid-outer petals */}
          <ellipse cx="10" cy="17" rx="4.5" ry="11" fill={color} opacity="0.45" transform="rotate(-20 10 17)" />
          <ellipse cx="30" cy="17" rx="4.5" ry="11" fill={color} opacity="0.45" transform="rotate(20 30 17)" />
          {/* Mid petals */}
          <ellipse cx="14" cy="15" rx="4" ry="12" fill={color} opacity="0.6" transform="rotate(-10 14 15)" />
          <ellipse cx="26" cy="15" rx="4" ry="12" fill={color} opacity="0.6" transform="rotate(10 26 15)" />
          {/* Inner petals */}
          <ellipse cx="17" cy="14" rx="3.5" ry="11" fill={color} opacity="0.75" transform="rotate(-4 17 14)" />
          <ellipse cx="23" cy="14" rx="3.5" ry="11" fill={color} opacity="0.75" transform="rotate(4 23 14)" />
          {/* Center petal */}
          <ellipse cx="20" cy="13" rx="3" ry="10" fill={color} opacity="0.9" />
          {/* Golden center / seed pod */}
          <circle cx="20" cy="18" r="3.5" fill="#FDE68A" opacity="0.7" />
          <circle cx="20" cy="18" r="2" fill="#F59E0B" opacity="0.5" />
          {/* Petal veins - subtle */}
          <line x1="20" y1="5" x2="20" y2="16" stroke={color} strokeWidth="0.3" opacity="0.3" />
          <line x1="17" y1="5" x2="18" y2="16" stroke={color} strokeWidth="0.2" opacity="0.2" />
          <line x1="23" y1="5" x2="22" y2="16" stroke={color} strokeWidth="0.2" opacity="0.2" />
        </svg>
      );
  }
}

function generatePetals(count: number): Petal[] {
  // Lotus appears more frequently for spiritual look
  const types: Petal["type"][] = ["marigold", "rose", "jasmine", "lotus", "lotus", "lotus"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 18 + Math.random() * 24,
    duration: 22 + Math.random() * 28,
    delay: Math.random() * 20,
    swayAmount: 40 + Math.random() * 100,
    rotation: Math.random() * 360,
    type: types[Math.floor(Math.random() * types.length)],
    opacity: 0.08 + Math.random() * 0.12,
  }));
}

export function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    // Generate petals on client only (avoid SSR mismatch)
    setPetals(generatePetals(12));
  }, []);

  // Only show petals on the home page
  if (!isHomePage) return null;
  if (petals.length === 0) return null;

  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          {petals.map((petal) => {
            const colors = PETAL_COLORS[petal.type];
            const color = colors[Math.floor(petal.id % colors.length)];
            return (
              <div
                key={petal.id}
                className="absolute falling-petal"
                style={{
                  left: `${petal.left}%`,
                  top: "-30px",
                  width: petal.size,
                  height: petal.size,
                  opacity: petal.opacity,
                  animationDuration: `${petal.duration}s`,
                  animationDelay: `${petal.delay}s`,
                  // @ts-expect-error CSS custom properties
                  "--sway": `${petal.swayAmount}px`,
                  "--rotation": `${petal.rotation}deg`,
                }}
              >
                <PetalSVG type={petal.type} color={color} />
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed z-50 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))",
          left: "calc(1.25rem + env(safe-area-inset-left, 0px))",
          background: visible
            ? "linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #EC4899 100%)"
            : "rgba(0,0,0,0.5)",
        }}
        aria-label={visible ? "Stop falling petals" : "Start falling petals"}
        title={visible ? "Stop petals" : "Show petals"}
      >
        <Flower2 className={`h-5 w-5 ${visible ? "text-white" : "text-white/60"}`} />
      </button>
    </>
  );
}
