import { Focus } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';

export function FocusEmptyState() {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
        <Focus size={24} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-white">{t('focus.emptyTitle')}</h2>
      <p className="mt-2 text-sm text-white/45">{t('focus.emptySubtitle')}</p>
    </section>
  );
}
