import { Concept } from "./prompts";

export const characterImages: Record<Concept, string[]> = {
  toast: [
    "/placeholders/toast-1.svg",
    "/placeholders/toast-2.svg",
  ],
  roast: [
    "/placeholders/roast-1.svg",
    "/placeholders/roast-2.svg",
  ],
};

export const laughingVideos = [
  "/placeholders/laughing-1.mp4",
  "/placeholders/laughing-2.mp4",
  "/placeholders/laughing-3.mp4",
  "/placeholders/laughing-4.mp4",
  "/placeholders/laughing-5.mp4",
  "/placeholders/laughing-6.mp4",
];

export const bowingCharacterImage = "/placeholders/bowing-character.png";

export function getRandomCharacterImage(concept: Concept): string {
  const images = characterImages[concept];
  return images[Math.floor(Math.random() * images.length)];
}

export const kokoAppIcon = "/placeholders/koko-app-icon.png";
export const kokoInstallLink = "https://play.google.com/store/search?q=koko%20ai&c=apps&hl=ko";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
