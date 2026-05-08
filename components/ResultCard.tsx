"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
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

// Generate positions around the card edges without overlapping each other
function generateLaughingPositions(): LaughingCharacter[] {
  const shuffled = [...laughingVideos].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 4); // 3-6

  // Candidate zones around the card (percentage-based offsets from card edges)
  const zones = [
    () => ({ top: `${-30 - Math.random() * 20}px`, left: `${Math.random() * 40}%` }),
    () => ({ top: `${-30 - Math.random() * 20}px`, right: `${Math.random() * 40}%` }),
    () => ({ bottom: `${-30 - Math.random() * 20}px`, left: `${Math.random() * 40}%` }),
    () => ({ bottom: `${-30 - Math.random() * 20}px`, right: `${Math.random() * 40}%` }),
    () => ({ top: `${20 + Math.random() * 40}%`, left: `${-40 - Math.random() * 20}px` }),
    () => ({ top: `${20 + Math.random() * 40}%`, right: `${-40 - Math.random() * 20}px` }),
  ];

  const shuffledZones = [...zones].sort(() => Math.random() - 0.5);

  return Array.from({ length: Math.min(count, shuffledZones.length) }, (_, i) => ({
    src: shuffled[i % shuffled.length],
    delay: i * 0.25 + Math.random() * 0.3,
    size: 50 + Math.floor(Math.random() * 45), // 50-94px
    rotation: (Math.random() - 0.5) * 20,
    position: shuffledZones[i](),
  }));
}

function getRandomHeroVideo(): string {
  return laughingVideos[Math.floor(Math.random() * laughingVideos.length)];
}

function LaughingAvatar({ char, onRemove }: { char: LaughingCharacter; onRemove: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Stagger entrance: wait for char.delay, then fade in and start playing
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      videoRef.current?.play().catch(() => {});
    }, char.delay * 1000);
    return () => clearTimeout(timer);
  }, [char.delay]);

  const handleEnded = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 25,
      origin: { x, y },
      colors: ["#FF6B9D", "#FFB6C1", "#FF1744", "#FFD700"],
    });
    setFadingOut(true);
    setTimeout(() => {
      setRemoved(true);
      onRemove();
    }, 300);
  }, [onRemove]);

  if (removed) return null;

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      onEnded={handleEnded}
      className="pointer-events-none absolute rounded-full"
      style={{
        ...char.position,
        width: char.size,
        height: char.size,
        objectFit: "cover" as const,
        transform: `rotate(${char.rotation}deg) scale(${visible && !fadingOut ? 1 : 0.8})`,
        zIndex: 20,
        opacity: fadingOut ? 0 : visible ? 1 : 0,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <source src={char.src} type="video/mp4" />
    </video>
  );
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
  const [laughingKey, setLaughingKey] = useState(0);
  const laughingChars = useMemo(
    () => (isRoast ? generateLaughingPositions() : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRoast, laughingKey]
  );
  const heroVideo = useMemo(
    () => (isRoast ? getRandomHeroVideo() : ""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRoast, laughingKey]
  );

  useEffect(() => {
    if (isRoast) {
      const timer = setTimeout(() => setShowLaughing(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isRoast, laughingKey]);

  const handleTryAgainWithReset = () => {
    setShowLaughing(false);
    setLaughingKey((k) => k + 1);
    onTryAgain();
  };

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

  // Roast mode: structured chaos layout
  return (
    <div className="w-full">
      <div className="relative w-full max-w-md mx-auto px-4">
        {/* Hero video — looping, 80% width */}
        <div className="mx-auto mb-6 w-4/5 overflow-hidden rounded-2xl">
          <video
            key={`hero-${laughingKey}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full object-cover"
            style={{ aspectRatio: "4/3" }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>

        {/* Title */}
        <h2 className="relative z-30 mb-4 text-center text-xl font-bold text-gray-900">
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
              onClick={handleTryAgainWithReset}
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

          {/* Laughing character videos — around the card, pop on end */}
          {showLaughing &&
            laughingChars.map((char, i) => (
              <LaughingAvatar
                key={`${laughingKey}-${i}`}
                char={char}
                onRemove={() => {}}
              />
            ))}
        </div>

      </div>
    </div>
  );
}
