import { useLocale } from "./i18n";
import zhTranslations from "../../i18n/zh/translations.json";
import enTranslations from "../../i18n/en/translations.json";

type Translations = typeof zhTranslations;

const translationsMap: Record<string, Translations> = {
  en: enTranslations,
  zh: zhTranslations,
};

export type { Translations };

export function useTranslations<T extends keyof Translations>(namespace: T) {
  const { currentLocale } = useLocale();
  const localeDir = currentLocale === "zh-Hans" ? "zh" : "en";
  const translations = translationsMap[localeDir] || translationsMap.en;
  const ns = translations[namespace] as Record<string, string | string[]>;

  const t = (key: string, fallback?: string): string => {
    const value = ns?.[key];
    return typeof value === "string" ? value : (fallback ?? key);
  };

  const getItems = (key: string): string[] => {
    const value = ns?.[key];
    return Array.isArray(value) ? value : [];
  };

  return {
    currentLocale,
    t,
    getItems,
  };
}
