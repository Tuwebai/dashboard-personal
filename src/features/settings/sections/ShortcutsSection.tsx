import { Keyboard } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';

const SHORTCUT_GROUPS = (t: (k: string) => string) => [
  {
    title: t('shortcuts.general'),
    shortcuts: [
      { keys: ['Ctrl', 'B'], label: t('shortcuts.toggleSidebar') },
      { keys: ['Ctrl', 'K'], label: t('shortcuts.commandPalette') },
      { keys: ['Ctrl', 'F'], label: t('shortcuts.quickSearch') },
    ],
  },
  {
    title: t('shortcuts.navigation'),
    shortcuts: [
      { keys: ['Ctrl', '1'], label: t('shortcuts.goOverview') },
      { keys: ['Ctrl', '2'], label: t('shortcuts.goTasks') },
      { keys: ['Ctrl', '3'], label: t('shortcuts.goHabits') },
      { keys: ['Ctrl', '4'], label: t('shortcuts.goFinances') },
      { keys: ['Ctrl', ','], label: t('shortcuts.goSettings') },
    ],
  },
  {
    title: t('shortcuts.actions'),
    shortcuts: [
      { keys: ['Ctrl', 'N'], label: t('shortcuts.newTask') },
      { keys: ['Ctrl', 'H'], label: t('shortcuts.newHabit') },
      { keys: ['Ctrl', 'J'], label: t('shortcuts.newNote') },
      { keys: ['Ctrl', 'S'], label: t('shortcuts.save') },
    ],
  },
];

export function ShortcutsSection() {
  const { t } = useI18n();
  const groups = SHORTCUT_GROUPS(t);

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-violet-400" />
          {t('shortcuts.title')}
        </h3>
        <p className="text-xs text-white/40">{t('shortcuts.desc')}</p>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{group.title}</h4>
              <div className="space-y-2">
                {group.shortcuts.map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 bg-bg-tertiary border border-border rounded-lg">
                    <span className="text-sm text-white/80">{s.label}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key) => (
                        <kbd
                          key={key}
                          className="min-w-[28px] h-7 flex items-center justify-center px-2 bg-white/5 border border-white/10 rounded-md text-[11px] font-mono text-white/60"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
