"use client";

import { useEffect, useState, useMemo } from "react";
import { Concept } from "@/lib/prompts";
import { kokoAppIcon, kokoInstallLink, laughingVideos } from "@/lib/constants";
import { I18nStrings } from "@/lib/i18n";

interface ResultCardProps {
  text: string;
  characterImage: string;
  concept: Concept;
  isKoko: boolean;
  strings: I18nStrings;
  onTryAgain: () => void;
  onShare: () => void;
}

interface LaughingCharacter {
  src: string;
  delay: number;
  size: number;
  rotation: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

// Fixed slots around the speech bubble — no overlap with text or each other
const SLOT_POSITIONS: Array<{ top?: string; bottom?: string; left?: string; right?: string }> = [
  { top: "-40px", left: "-30px" },         // top-left
  { top: "-40px", right: "-30px" },        // top-right
  { bottom: "-40px", left: "-30px" },      // bottom-left
  { bottom: "-40px", right: "-30px" },     // bottom-right
  { top: "50%", left: "-60px" },           // mid-left
  { top: "50%", right: "-60px" },          // mid-right
];

function generateLaughingPositions(): LaughingCharacter[] {
  const shuffled = [...laughingVideos].sort(() => Math.random() - 0.5);
  const slots = [...SLOT_POSITIONS].sort(() => Math.random() - 0.5);
  const count = Math.min(3 + Math.floor(Math.random() * 3), slots.length);
  return shuffled.slice(0, count).map((src, i) => ({
    src,
    delay: i * 0.3,
    size: 80 + Math.random() * 30,
    rotation: (Math.random() - 0.5) * 20,
    position: slots[i],
  }));
}

export default function ResultCard({
  text,
  characterImage,
  concept,
  isKoko,
  strings,
  onTryAgain,
  onShare,
}: ResultCardProps) {
  const isRoast = concept === "roast";
  const [showLaughing, setShowLaughing] = useState(false);
  const laughingChars = useMemo(
    () => (isRoast ? generateLaughingPositions() : []),
    [isRoast]
  );

  useEffect(() => {
    if (isRoast) {
      const timer = setTimeout(() => setShowLaughing(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isRoast]);

  // Toast mode: unchanged layout
  if (!isRoast) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {strings.resultTitle}
        </h2>

        <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <img
              src={characterImage}
              alt="AI Character"
              className="h-40 w-40 rounded-xl object-cover"
            />
          </div>
          <div className="flex-1 text-left">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {text}
            </p>
          </div>
        </div>

        {isKoko && (
          <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-pink-50 p-4">
            <img
              src={kokoAppIcon}
              alt="koko app"
              className="h-12 w-12 rounded-xl"
            />
            <a
              href={kokoInstallLink}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#FF6B8A" }}
            >
              {strings.kokoInstall}
            </a>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onTryAgain}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
              isKoko
                ? "bg-[#FF6B8A] text-white hover:bg-[#e55a79]"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {strings.tryAgain}
          </button>
          <button
            onClick={onShare}
            className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {strings.share}
          </button>
        </div>
      </div>
    );
  }

  // Roast mode: chaotic layout
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        {strings.resultTitle}
      </h2>

      {/* Speech bubble with text + CTA inside */}
      <div className="relative z-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="whitespace-pre-wrap text-left text-gray-700 leading-relaxed">
          {text}
        </p>

        {/* CTA inside bubble */}
        <a
          href={kokoInstallLink}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          <img src={kokoAppIcon} alt="koko" className="h-5 w-5 rounded" />
          {strings.roastCta}
        </a>
      </div>

      {/* Laughing character videos — positioned around the bubble edges */}
      {showLaughing &&
        laughingChars.map((char, i) => (
          <video
            key={i}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute rounded-full animate-bounce-fade"
            style={{
              ...char.position,
              width: char.size,
              height: char.size,
              objectFit: "cover",
              animationDelay: `${char.delay}s`,
              transform: `rotate(${char.rotation}deg)`,
              zIndex: 20,
            }}
          >
            <source src={char.src} type="video/mp4" />
          </video>
        ))}

      {/* Bottom row: try again, share, koko icon */}
      <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
        <button
          onClick={onTryAgain}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
            isKoko
              ? "bg-[#FF6B8A] text-white hover:bg-[#e55a79]"
              : "bg-gray-900 text-white hover:bg-gray-700"
          }`}
        >
          {strings.tryAgain}
        </button>
        <button
          onClick={onShare}
          className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          {strings.share}
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce-fade {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(var(--rotation, 0deg));
          }
          30% {
            opacity: 1;
            transform: scale(1.15) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: scale(0.9) rotate(var(--rotation, 0deg));
          }
          70% {
            transform: scale(1.05) rotate(var(--rotation, 0deg));
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation, 0deg));
          }
        }
        :global(.animate-bounce-fade) {
          animation: bounce-fade 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
