export type Lang = 'en' | 'es';

export type TranslationMessages = Record<string, string>;

export type TranslationDictionary = Record<Lang, TranslationMessages>;
