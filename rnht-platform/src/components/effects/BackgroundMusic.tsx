"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-play after first user interaction on the page
  useEffect(() => {
    function handleFirstInteraction() {
      if (!hasInteracted) {
        setHasInteracted(true);
        // Try to play on first interaction
        if (audioRef.current) {
          audioRef.current.volume = 0.15;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Browser blocked autoplay — user can click the button
          });
        }
      }
    }

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.15;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop preload="none" />
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-[0_4px_20px_rgba(197,151,62,0.4)] transition-all duration-300 hover:shadow-[0_6px_28px_rgba(197,151,62,0.6)] hover:-translate-y-0.5 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #C5973E 0%, #E8C34A 50%, #C5973E 100%)",
        }}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        title={isPlaying ? "Mute music" : "Play devotional music"}
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 text-white" />
        ) : (
          <VolumeX className="h-5 w-5 text-white/70" />
        )}
        <span className="text-xs font-semibold text-white tracking-wide hidden sm:inline">
          {isPlaying ? "Music On" : "Play Music"}
        </span>
        {isPlaying && (
          <span className="flex gap-[2px] items-end h-4">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-white/80"
                style={{
                  animation: `musicBar 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </span>
        )}
      </button>
    </>
  );
}
