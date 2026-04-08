import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export type Locale = "en" | "zh-Hans";

export const SUPPORTED_LOCALES: Locale[] = ["en", "zh-Hans"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-Hans": "简体中文",
};

export const LOCALE_TO_DIR: Record<Locale, string> = {
  en: "en",
  "zh-Hans": "zh",
};

type TranslationValue = string | string[] | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

export function useLocale(): {
  currentLocale: Locale;
  isLocale: (locale: Locale) => boolean;
  getLocaleDir: (locale: Locale) => string;
} {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();

  const locale = (
    SUPPORTED_LOCALES.includes(currentLocale as Locale)
      ? currentLocale
      : DEFAULT_LOCALE
  ) as Locale;

  return {
    currentLocale: locale,
    isLocale: (targetLocale: Locale) => locale === targetLocale,
    getLocaleDir: (targetLocale: Locale) => LOCALE_TO_DIR[targetLocale],
  };
}

export function createTranslator<T extends Translations>(
  translationsMap: Partial<Record<Locale, T>>,
) {
  return (locale: Locale, key: keyof T, fallback?: string): string => {
    const translations =
      translationsMap[locale] || translationsMap[DEFAULT_LOCALE];
    const value = translations?.[key];
    if (typeof value === "string") {
      return value;
    }
    return (fallback as string) || (key as string);
  };
}

export function createArrayTranslator<T extends Translations>(
  translationsMap: Partial<Record<Locale, T>>,
) {
  return (locale: Locale, key: keyof T): string[] => {
    const translations =
      translationsMap[locale] || translationsMap[DEFAULT_LOCALE];
    const value = translations?.[key];
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === "string") as string[];
    }
    return [];
  };
}

export function getT<T extends Translations>(
  translations: T,
  locale: Locale,
): (key: keyof T, fallback?: string) => string {
  return (key: keyof T, fallback?: string): string => {
    const value = translations[key];
    if (typeof value === "string") {
      return value;
    }
    return (fallback as string) || (key as string);
  };
}

export function getLocalizedItems<T extends Translations>(
  translations: T,
  locale: Locale,
): (key: keyof T) => string[] {
  return (key: keyof T): string[] => {
    const value = translations[key];
    if (Array.isArray(value)) {
      return value.filter((v) => typeof v === "string") as string[];
    }
    return [];
  };
}
