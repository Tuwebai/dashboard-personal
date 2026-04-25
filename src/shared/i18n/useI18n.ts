import { useAppStore } from '../../stores/useAppStore';
import { translations } from './translations';
import type { Lang, TranslationKey } from './translations';

export function useI18n() {
  const settings = useAppStore((s) => s.settings);
  const lang: Lang = settings.language ?? 'en';

  function t(key: TranslationKey): string;
  function t(key: string): string;
  function t(key: TranslationKey | string): string {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  }

  return { t, lang, translations: translations[lang] };
}
