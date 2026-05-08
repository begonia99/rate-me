const strings = {
  title: "Rate Me",
  basic: "Basic",
  kokoCollab: "koko Collab",
  evaluate: "Evaluate",
  tryAgain: "Try Again",
  share: "Share",
  uploadTitle: "Upload your photo",
  uploadSubtitle: "Click or drag & drop an image here",
  uploadHint: "Max 10MB, image files only",
  fileTooLarge: "File is too large. Maximum size is 10MB.",
  invalidFile: "Please upload an image file.",
  selectConcept: "Choose a concept",
  evaluating: "Evaluating...",
  apiError: "Something went wrong. Please try again.",
  toast: "Toast me",
  toastDesc: "Lavish compliments, over-the-top flattery",
  roast: "Roast me",
  roastDesc: "Brutal, funny roast",
  roastCta: "Salty? Come find me \u2728",
  shareCtaRoast: "Curious? Click me \u2728",
  shareCtaToast: "Wanna know more? \u2728",
  kokoInstall: "Try koko App",
  resultTitle: "Your Evaluation",
  shareTitle: "Made with Rate Me",
  copyLink: "Copy Link",
  copiedLink: "Copied!",
} as const;

export type I18nStrings = typeof strings;

export function getStrings(): I18nStrings {
  return strings;
}
