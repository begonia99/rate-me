"use client";

import { useState } from "react";
import { I18nStrings } from "@/lib/i18n";

interface ShareModalProps {
  shareUrl: string;
  text: string;
  strings: I18nStrings;
  onClose: () => void;
}

const platforms = [
  {
    name: "Twitter / X",
    icon: "𝕏",
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: "f",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: "W",
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
  },
  {
    name: "Telegram",
    icon: "T",
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "Email",
    icon: "@",
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent("Rate Me")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
  },
];

export default function ShareModal({
  shareUrl,
  text,
  strings,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{strings.share}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="mb-3 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <span className="text-sm font-medium text-gray-700">
            {copied ? strings.copiedLink : strings.copyLink}
          </span>
        </button>

        {/* Platform buttons */}
        <div className="grid grid-cols-5 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => window.open(platform.getUrl(shareUrl, text), "_blank")}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-gray-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                {platform.icon}
              </span>
              <span className="text-[10px] text-gray-500">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
