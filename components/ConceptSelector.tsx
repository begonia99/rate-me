"use client";

import { Concept } from "@/lib/prompts";
import { I18nStrings } from "@/lib/i18n";

interface ConceptSelectorProps {
  selected: Concept | null;
  onChange: (concept: Concept) => void;
  isKoko: boolean;
  strings: I18nStrings;
}

interface ConceptOption {
  id: Concept;
  emoji: string;
  nameKey: keyof I18nStrings;
  descKey: keyof I18nStrings;
}

const concepts: ConceptOption[] = [
  { id: "toast", emoji: "\u{1F451}", nameKey: "toast", descKey: "toastDesc" },
  { id: "roast", emoji: "\u{1F60F}", nameKey: "roast", descKey: "roastDesc" },
];

export default function ConceptSelector({
  selected,
  onChange,
  isKoko,
  strings,
}: ConceptSelectorProps) {
  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">
        {strings.selectConcept}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {concepts.map((concept) => {
          const isSelected = selected === concept.id;
          return (
            <button
              key={concept.id}
              onClick={() => onChange(concept.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                isSelected
                  ? isKoko
                    ? "border-[#FF6B8A] bg-pink-50"
                    : "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-3xl">{concept.emoji}</span>
              <span className="text-sm font-medium text-gray-900">
                {strings[concept.nameKey]}
              </span>
              <span className="text-xs text-gray-500">
                {strings[concept.descKey]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
