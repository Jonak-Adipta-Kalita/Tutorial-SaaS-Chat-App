import { Subscription } from "@/typings/stripe-payments";
import { create } from "zustand";

export type LanguagesSupported =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "hi"
  | "ja"
  | "la"
  | "ru"
  | "zh"
  | "ar";

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
  en: "English",
  de: "German",
  fr: "France",
  es: "Spanish",
  hi: "Hindi",
  ja: "Japanese",
  la: "Latin",
  ru: "Russian",
  zh: "Mandarin",
  ar: "Arabic",
};

interface LanguageState {
  language: LanguagesSupported;
  setLanguage: (language: LanguagesSupported) => void;
  getLanguages: (isPro: boolean) => LanguagesSupported[];
  getNotSupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  setLanguage: (language: LanguagesSupported) => set({ language }),
  getLanguages: (isPro: boolean) =>
    isPro
      ? (Object.keys(LanguagesSupportedMap) as LanguagesSupported[])
      : (Object.keys(LanguagesSupportedMap).slice(
          0,
          2
        ) as LanguagesSupported[]),
  getNotSupportedLanguages: (isPro: boolean) =>
    isPro
      ? []
      : (Object.keys(LanguagesSupportedMap).slice(2) as LanguagesSupported[]),
}));

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
