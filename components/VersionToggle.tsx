"use client";

import { I18nStrings } from "@/lib/i18n";

interface VersionToggleProps {
  isKoko: boolean;
  onChange: (isKoko: boolean) => void;
  strings: I18nStrings;
}

export default function VersionToggle({
  isKoko,
  onChange,
  strings,
}: VersionToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-sm">
      <button
        onClick={() => onChange(false)}
        className={`rounded-full px-3 py-1 transition-colors ${
          !isKoko
            ? "bg-white font-semibold text-gray-900 shadow-sm"
            : "text-gray-400 hover:text-gray-500"
        }`}
      >
        {strings.basic}
      </button>
      <button
        onClick={() => onChange(true)}
        className={`rounded-full px-3 py-1 transition-colors ${
          isKoko
            ? "bg-white font-semibold shadow-sm"
            : "text-gray-400 hover:text-gray-500"
        }`}
        style={isKoko ? { color: "#FF6B8A" } : {}}
      >
        {strings.kokoCollab}
      </button>
    </div>
  );
}
