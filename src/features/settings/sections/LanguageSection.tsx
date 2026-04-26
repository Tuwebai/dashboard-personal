import { Globe, Check } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

const LANGUAGES = [
  { code: 'en' as const, labelKey: 'language.english', nativeKey: 'language.englishNative', flag: '🇺🇸' },
  { code: 'es' as const, labelKey: 'language.spanish', nativeKey: 'language.spanishNative', flag: '🇪🇸' },
];

export function LanguageSection() {
  const { t, lang } = useI18n();
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-text-primary">
          <Globe className="w-4 h-4 text-violet-400" />
          {t('language.title')}
        </h3>

        <div>
          <p className="mb-1 text-xs font-medium text-text-secondary">{t('language.select')}</p>
          <p className="mb-4 text-xs text-text-muted">{t('language.selectDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => updateSettings({ language: l.code })}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200',
                  lang === l.code
                    ? 'border-violet-500/20 bg-violet-500/10 text-text-primary'
                    : 'border-border bg-bg-tertiary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                <span className="text-2xl">{l.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{t(l.nativeKey)}</p>
                  <p className="text-[11px] text-text-muted">{t(l.labelKey)}</p>
                </div>
                {lang === l.code && (
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
