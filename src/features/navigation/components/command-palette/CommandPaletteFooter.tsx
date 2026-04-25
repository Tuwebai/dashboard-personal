import { useI18n } from '../../../../shared/i18n/useI18n';

export function CommandPaletteFooter() {
  const { t } = useI18n();

  return (
    <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[11px] text-white/25">
      <span className="flex items-center gap-1">
        <kbd className="px-1 bg-white/5 border border-white/10 rounded">↑↓</kbd>
        {t('common.commandNavigate')}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1 bg-white/5 border border-white/10 rounded">↵</kbd>
        {t('common.commandSelect')}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="px-1 bg-white/5 border border-white/10 rounded">esc</kbd>
        {t('common.commandClose')}
      </span>
    </div>
  );
}
