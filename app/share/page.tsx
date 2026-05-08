"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { bowingCharacterImage, kokoAppIcon, kokoInstallLink } from "@/lib/constants";
import { getStrings } from "@/lib/i18n";
import type { Concept } from "@/lib/prompts";

function ShareContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");
  const concept = searchParams.get("concept") as Concept | null;
  const strings = getStrings();

  if (!text) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-500">No result to display.</p>
      </div>
    );
  }

  const isRoast = concept === "roast";

  return (
    <div className="flex min-h-screen flex-col bg-pink-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-center justify-center px-4 py-3">
          <h1 className="text-xl font-bold" style={{ color: "#FF6B8A" }}>
            {strings.title}
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Result card with character inside */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Character at top of card */}
            <div className="flex justify-center bg-gray-50 pt-6 pb-2">
              <img
                src={bowingCharacterImage}
                alt="Character"
                className="h-36 w-36 object-contain"
              />
            </div>

            {/* Text */}
            <div className="px-6 pb-6 pt-4">
              <p className="whitespace-pre-wrap text-left text-gray-700 leading-relaxed">
                {text}
              </p>
            </div>
          </div>

          {/* CTA button */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-colors hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#FF6B8A" }}
            >
              <img src={kokoAppIcon} alt="koko" className="h-5 w-5 rounded" />
              {isRoast ? strings.shareCtaRoast : strings.shareCtaToast}
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <a
          href={kokoInstallLink}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-500"
        >
          <img src={kokoAppIcon} alt="koko" className="h-4 w-4 rounded" />
          Powered by koko
        </a>
      </footer>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-pink-50">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
