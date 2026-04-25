import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, CheckSquare, Zap,
  RotateCcw, DollarSign, Calendar, FileText,
  Settings, Plus, ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';

interface CommandOption {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: 'navigation' | 'action';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  onNavigate: (module: string) => void;
}

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  const allCommands: CommandOption[] = [
    {
      id: 'nav_dashboard',
      title: t('nav.overview'),
      icon: LayoutDashboard,
      category: 'navigation',
      shortcut: 'G D',
      action: () => { onNavigate('dashboard'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_tasks',
      title: t('nav.tasks'),
      icon: CheckSquare,
      category: 'navigation',
      shortcut: 'G T',
      action: () => { onNavigate('tasks'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_habits',
      title: t('nav.habits'),
      icon: Zap,
      category: 'navigation',
      shortcut: 'G H',
      action: () => { onNavigate('habits'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_routines',
      title: t('nav.routines'),
      icon: RotateCcw,
      category: 'navigation',
      shortcut: 'G R',
      action: () => { onNavigate('routines'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_finances',
      title: t('nav.finances'),
      icon: DollarSign,
      category: 'navigation',
      shortcut: 'G F',
      action: () => { onNavigate('finances'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_calendar',
      title: t('nav.calendar'),
      icon: Calendar,
      category: 'navigation',
      shortcut: 'G C',
      action: () => { onNavigate('calendar'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_notes',
      title: t('nav.notes'),
      icon: FileText,
      category: 'navigation',
      shortcut: 'G N',
      action: () => { onNavigate('notes'); setCommandPaletteOpen(false); },
    },
    {
      id: 'nav_settings',
      title: t('nav.settings'),
      icon: Settings,
      category: 'navigation',
      action: () => { onNavigate('settings'); setCommandPaletteOpen(false); },
    },
    {
      id: 'action_task',
      title: t('tasks.createNew'),
      description: 'Create a new task',
      icon: Plus,
      category: 'action',
      action: () => { onNavigate('tasks'); setCommandPaletteOpen(false); },
    },
    {
      id: 'action_note',
      title: 'New Note',
      description: 'Create a new note',
      icon: Plus,
      category: 'action',
      action: () => { onNavigate('notes'); setCommandPaletteOpen(false); },
    },
    {
      id: 'action_event',
      title: 'New Event',
      description: 'Add calendar event',
      icon: Plus,
      category: 'action',
      action: () => { onNavigate('calendar'); setCommandPaletteOpen(false); },
    },
    {
      id: 'action_expense',
      title: 'Log Expense',
      description: 'Record a new transaction',
      icon: Plus,
      category: 'action',
      action: () => { onNavigate('finances'); setCommandPaletteOpen(false); },
    },
  ];

  const filtered = query.trim()
    ? allCommands.filter(cmd =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      filtered[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  const navCommands = filtered.filter(c => c.category === 'navigation');
  const actionCommands = filtered.filter(c => c.category === 'action');

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-xl bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={18} className="text-white/40 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('common.searchCommand')}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
              />
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/30">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                <>
                  {navCommands.length > 0 && (
                    <CommandGroup
                      title={t('common.navigation')}
                      commands={navCommands}
                      allFiltered={filtered}
                      selectedIndex={selectedIndex}
                      setSelectedIndex={setSelectedIndex}
                    />
                  )}
                  {actionCommands.length > 0 && (
                    <CommandGroup
                      title={t('common.actions')}
                      commands={actionCommands}
                      allFiltered={filtered}
                      selectedIndex={selectedIndex}
                      setSelectedIndex={setSelectedIndex}
                    />
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[11px] text-white/25">
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-white/5 border border-white/10 rounded">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-white/5 border border-white/10 rounded">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-white/5 border border-white/10 rounded">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CommandGroup({
  title,
  commands,
  allFiltered,
  selectedIndex,
  setSelectedIndex,
}: {
  title: string;
  commands: CommandOption[];
  allFiltered: CommandOption[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
}) {
  return (
    <div className="mb-2">
      <p className="text-[11px] font-semibold text-white/25 uppercase tracking-wider px-3 py-1.5">
        {title}
      </p>
      {commands.map(cmd => {
        const globalIdx = allFiltered.findIndex(c => c.id === cmd.id);
        const isSelected = globalIdx === selectedIndex;
        const Icon = cmd.icon;
        return (
          <button
            key={cmd.id}
            onClick={cmd.action}
            onMouseEnter={() => setSelectedIndex(globalIdx)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
              isSelected ? 'bg-violet-500/15 text-white' : 'text-white/70 hover:bg-white/5'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
              isSelected ? 'bg-violet-500/20' : 'bg-white/5'
            )}>
              <Icon size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{cmd.title}</p>
              {cmd.description && (
                <p className="text-xs text-white/40">{cmd.description}</p>
              )}
            </div>
            {cmd.shortcut && (
              <div className="flex gap-1">
                {cmd.shortcut.split(' ').map((k, i) => (
                  <kbd key={i} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/30">
                    {k}
                  </kbd>
                ))}
              </div>
            )}
            {isSelected && <ArrowRight size={14} className="text-violet-400 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
