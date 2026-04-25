import type { TranslationDictionary, TranslationMessages } from './types';
import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { tasksTranslations } from './tasks';
import { habitsTranslations } from './habits';
import { financesTranslations } from './finances';
import { notesTranslations } from './notes';
import { routinesTranslations } from './routines';
import { goalsTranslations } from './goals';
import { settingsTranslations } from './settings';
import { languageTranslations } from './language';
import { shortcutsTranslations } from './shortcuts';
import { aboutTranslations } from './about';
import { weeklyPlanningTranslations } from './weekly-planning';
import { calendarTranslations } from './calendar';
import { journalingTranslations } from './journaling';
import { focusTranslations } from './focus';

const dictionaries: TranslationDictionary[] = [
  commonTranslations,
  navigationTranslations,
  dashboardTranslations,
  tasksTranslations,
  habitsTranslations,
  financesTranslations,
  notesTranslations,
  routinesTranslations,
  goalsTranslations,
  settingsTranslations,
  languageTranslations,
  shortcutsTranslations,
  aboutTranslations,
  weeklyPlanningTranslations,
  calendarTranslations,
  journalingTranslations,
  focusTranslations,
];

const mergeByLang = (lang: 'en' | 'es'): TranslationMessages =>
  Object.assign({}, ...dictionaries.map((dictionary) => dictionary[lang]));

export const translations: TranslationDictionary = {
  en: mergeByLang('en'),
  es: mergeByLang('es'),
};

export type TranslationKey =
  | keyof typeof commonTranslations.en
  | keyof typeof navigationTranslations.en
  | keyof typeof dashboardTranslations.en
  | keyof typeof tasksTranslations.en
  | keyof typeof habitsTranslations.en
  | keyof typeof financesTranslations.en
  | keyof typeof notesTranslations.en
  | keyof typeof routinesTranslations.en
  | keyof typeof goalsTranslations.en
  | keyof typeof settingsTranslations.en
  | keyof typeof languageTranslations.en
  | keyof typeof shortcutsTranslations.en
  | keyof typeof aboutTranslations.en
  | keyof typeof calendarTranslations.en
  | keyof typeof journalingTranslations.en
  | keyof typeof focusTranslations.en;

export type { Lang, TranslationDictionary, TranslationMessages } from './types';
