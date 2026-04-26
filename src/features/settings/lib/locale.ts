export function getSettingsLocale(lang: 'en' | 'es') {
  return lang === 'es' ? 'es-AR' : 'en-US';
}

export function formatSettingsDate(date: Date, lang: 'en' | 'es') {
  return date.toLocaleDateString(getSettingsLocale(lang), {
    dateStyle: 'medium',
  });
}

export function formatSettingsDateTime(date: Date, lang: 'en' | 'es') {
  return date.toLocaleString(getSettingsLocale(lang), {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
