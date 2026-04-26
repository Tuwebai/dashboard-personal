import { Focus, TimerReset } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';

export function FocusHeader() {
  const { t } = useI18n();

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
          {t('focus.eyebrow')}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{t('focus.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">{t('focus.subtitle')}</p>
      </div>

      <div className="flex items-center gap-3 self-start">
        <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-300">
          <Focus size={24} />
        </div>
        <div className="rounded-2xl border border-border bg-bg-tertiary px-4 py-3">
          <div className="flex items-center gap-2 text-text-secondary">
            <TimerReset size={16} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              {t('focus.headerBadge')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
