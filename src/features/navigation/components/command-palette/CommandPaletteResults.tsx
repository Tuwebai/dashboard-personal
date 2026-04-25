import type { CommandOption } from './types';
import { CommandPaletteSection } from './CommandPaletteSection';
import { useI18n } from '../../../../shared/i18n/useI18n';

interface CommandPaletteResultsProps {
  filteredCommands: CommandOption[];
  query: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  navigationTitle: string;
  actionsTitle: string;
}

export function CommandPaletteResults({
  filteredCommands,
  query,
  selectedIndex,
  setSelectedIndex,
  navigationTitle,
  actionsTitle,
}: CommandPaletteResultsProps) {
  const { t } = useI18n();
  const navigationCommands = filteredCommands.filter((command) => command.category === 'navigation');
  const actionCommands = filteredCommands.filter((command) => command.category === 'action');

  return (
    <div className="max-h-80 overflow-y-auto p-2">
      {filteredCommands.length === 0 ? (
        <div className="text-center py-8 text-white/30 text-sm">
          {t('common.commandNoResults')} "{query}"
        </div>
      ) : (
        <>
          {navigationCommands.length > 0 ? (
            <CommandPaletteSection
              title={navigationTitle}
              commands={navigationCommands}
              allCommands={filteredCommands}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          ) : null}
          {actionCommands.length > 0 ? (
            <CommandPaletteSection
              title={actionsTitle}
              commands={actionCommands}
              allCommands={filteredCommands}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
