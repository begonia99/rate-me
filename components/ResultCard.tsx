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

// 3 fixed slots: main (top-left), sub (top-right), sub (bottom-left)
const SLOT_POSITIONS: Array<{ top?: string; bottom?: string; left?: string; right?: string; isMain: boolean }> = [
  { top: "-20px", left: "-16px", isMain: true },    // main: top-left
  { top: "-12px", right: "-8px", isMain: false },   // sub: top-right (inside bounds)
  { bottom: "-20px", left: "-16px", isMain: false }, // sub: bottom-left
];

function generateLaughingPositions(): LaughingCharacter[] {
  const shuffled = [...laughingVideos].sort(() => Math.random() - 0.5);
  return SLOT_POSITIONS.map((slot, i) => {
    const { isMain, ...position } = slot;
    return {
      src: shuffled[i % shuffled.length],
      delay: i * 0.25,
      size: isMain ? 88 : 56,
      rotation: (Math.random() - 0.5) * 15,
      position,
    };
  });
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

  // Roast mode: structured chaos layout, vertically centered
  return (
    <div className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Title — above card with enough margin to avoid avatar overlap */}
        <h2 className="relative z-30 mb-6 text-center text-xl font-bold text-gray-900">
          {strings.roastResultTitle}
        </h2>

        {/* Card with everything inside */}
        <div className="relative z-10 overflow-visible rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Roast text */}
          <p className="whitespace-pre-wrap text-left text-gray-700 leading-relaxed">
            {text}
          </p>

          {/* Divider */}
          <hr className="my-4 border-gray-100" />

          {/* Primary CTA */}
          <a
            href={kokoInstallLink}
            className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#FF6B8A" }}
          >
            <img src={kokoAppIcon} alt="koko" className="h-5 w-5 rounded" />
            {strings.roastCta}
          </a>

          {/* Secondary CTAs */}
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={onTryAgain}
              className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              {strings.tryAgain}
            </button>
            <button
              onClick={onShare}
              className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              {strings.share}
            </button>
          </div>
        </div>

        {/* Laughing character videos — 3 avatars with size hierarchy */}
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

        <style jsx>{`
          @keyframes bounce-fade {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            30% {
              opacity: 1;
              transform: scale(1.1);
            }
            50% {
              transform: scale(0.95);
            }
            70% {
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          :global(.animate-bounce-fade) {
            animation: bounce-fade 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </div>
  );
}
