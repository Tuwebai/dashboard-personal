import type { TranslationDictionary } from './types';

export const languageTranslations = {
  en: {
    'language.title': 'Language & Region',
    'language.select': 'Display Language',
    'language.selectDesc': 'Choose the language for the entire interface.',
    'language.english': 'English',
    'language.englishNative': 'English',
    'language.spanish': 'Español',
    'language.spanishNative': 'Spanish',
  },
  es: {
    'language.title': 'Idioma y Región',
    'language.select': 'Idioma de Interfaz',
    'language.selectDesc': 'Elige el idioma para toda la interfaz.',
    'language.english': 'English',
    'language.englishNative': 'Inglés',
    'language.spanish': 'Español',
    'language.spanishNative': 'Español',
  },
} as const satisfies TranslationDictionary;
