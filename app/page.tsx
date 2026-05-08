"use client";

import { useState, useCallback } from "react";
import { Concept } from "@/lib/prompts";
import { getRandomCharacterImage } from "@/lib/constants";
import { getStrings } from "@/lib/i18n";
import VersionToggle from "@/components/VersionToggle";
import ConceptSelector from "@/components/ConceptSelector";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import ShareModal from "@/components/ShareModal";

export default function Home() {
  const [isKoko, setIsKoko] = useState(true);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    characterImage: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const strings = getStrings();

  const handleFileSelect = useCallback((_file: File, base64: string) => {
    setImageBase64(base64);
    setPreview(base64);
    setResult(null);
    setError(null);
  }, []);

  const handleEvaluate = async () => {
    if (!imageBase64 || !concept) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64,
          concept,
          isKoko,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setResult({
        text: data.text,
        characterImage: getRandomCharacterImage(concept),
      });
    } catch {
      setError(strings.apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setImageBase64(null);
    setPreview(null);
    setConcept(null);
    setError(null);
  };

  const getShareUrl = () => {
    if (!result || !concept) return "";
    const params = new URLSearchParams({
      text: result.text,
      concept,
    });
    return `${window.location.origin}/share?${params.toString()}`;
  };

  const handleShare = () => {
    if (!result || !concept) return;
    const shareUrl = getShareUrl();
    const isMobile = window.innerWidth < 768;

    if (isMobile && navigator.share) {
      navigator.share({
        title: "Rate Me",
        text: result.text,
        url: shareUrl,
      }).catch(() => {});
    } else {
      setShowShareModal(true);
    }
  };

  const canEvaluate = imageBase64 && concept && !loading;

  return (
    <div
      className={`min-h-screen transition-colors ${
        isKoko ? "bg-pink-50" : "bg-white"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1
            className="text-xl font-bold"
            style={isKoko ? { color: "#FF6B8A" } : {}}
          >
            {strings.title}
          </h1>
          <VersionToggle
            isKoko={isKoko}
            onChange={setIsKoko}
            strings={strings}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        {result ? (
          <ResultCard
            text={result.text}
            characterImage={result.characterImage}
            concept={concept!}
            isKoko={isKoko}
            strings={strings}
            onTryAgain={handleTryAgain}
            onShare={handleShare}
          />
        ) : (
          <div className="flex flex-col items-center gap-8">
            <ConceptSelector
              selected={concept}
              onChange={setConcept}
              isKoko={isKoko}
              strings={strings}
            />

            <UploadZone
              onFileSelect={handleFileSelect}
              preview={preview}
              strings={strings}
              isKoko={isKoko}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              onClick={handleEvaluate}
              disabled={!canEvaluate}
              className={`w-full max-w-xs rounded-full px-8 py-3 text-base font-semibold text-white transition-all ${
                canEvaluate
                  ? isKoko
                    ? "bg-[#FF6B8A] hover:bg-[#e55a79] active:scale-95"
                    : "bg-gray-900 hover:bg-gray-700 active:scale-95"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {strings.evaluating}
                </span>
              ) : (
                strings.evaluate
              )}
            </button>
          </div>
        )}
      </main>

      {/* Share modal (desktop) */}
      {showShareModal && result && (
        <ShareModal
          shareUrl={getShareUrl()}
          text={result.text}
          strings={strings}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
