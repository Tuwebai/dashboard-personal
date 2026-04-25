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
      <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider px-3 py-1.5">
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
              isSelected ? 'bg-violet-500/15 text-white' : 'text-white/70 hover:bg-white/5',
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                isSelected ? 'bg-violet-500/20' : 'bg-white/5',
              )}
            >
              <Icon size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{command.title}</p>
              {command.description ? <p className="text-xs text-white/40">{command.description}</p> : null}
            </div>
            {command.shortcut ? (
              <div className="flex gap-1">
                {command.shortcut.split(' ').map((keyPart) => (
                  <kbd key={`${command.id}-${keyPart}`} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/30">
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
