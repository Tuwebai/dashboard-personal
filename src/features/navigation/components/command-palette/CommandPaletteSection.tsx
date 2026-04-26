import { ArrowRight } from 'lucide-react';
import { cn } from '../../../../shared/lib/cn';
import type { CommandOption } from './types';

interface CommandPaletteSectionProps {
  title: string;
  commands: CommandOption[];
  allCommands: CommandOption[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export function CommandPaletteSection({
  title,
  commands,
  allCommands,
  selectedIndex,
  setSelectedIndex,
}: CommandPaletteSectionProps) {
  return (
    <div className="mb-2">
      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </p>
      {commands.map((command) => {
        const globalIndex = allCommands.findIndex((item) => item.id === command.id);
        const isSelected = globalIndex === selectedIndex;
        const Icon = command.icon;

        return (
          <button
            key={command.id}
            onClick={command.action}
            onMouseEnter={() => setSelectedIndex(globalIndex)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
              isSelected ? 'bg-violet-500/15 text-text-primary' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                isSelected ? 'bg-violet-500/20' : 'bg-bg-secondary',
              )}
            >
              <Icon size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{command.title}</p>
              {command.description ? <p className="text-xs text-text-muted">{command.description}</p> : null}
            </div>
            {command.shortcut ? (
              <div className="flex gap-1">
                {command.shortcut.split(' ').map((keyPart) => (
                  <kbd key={`${command.id}-${keyPart}`} className="rounded border border-border bg-bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                    {keyPart}
                  </kbd>
                ))}
              </div>
            ) : null}
            {isSelected ? <ArrowRight size={14} className="text-violet-400 shrink-0" /> : null}
          </button>
        );
      })}
    </div>
  );
}
