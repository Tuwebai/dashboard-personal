import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { scheduleAfterPaint } from '../../../shared/lib/scheduleAfterPaint';
import { useShallow } from 'zustand/react/shallow';
import { CommandPaletteFooter } from './command-palette/CommandPaletteFooter';
import { buildCommandPaletteCommands } from './command-palette/commands';
import { CommandPaletteResults } from './command-palette/CommandPaletteResults';
import type { CommandPaletteProps } from './command-palette/types';

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore(
    useShallow((state) => ({
      commandPaletteOpen: state.commandPaletteOpen,
      setCommandPaletteOpen: state.setCommandPaletteOpen,
    })),
  );

  const closePalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  const allCommands = useMemo(
    () => buildCommandPaletteCommands(t, onNavigate, closePalette),
    [closePalette, onNavigate, t],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return allCommands;
    }

    return allCommands.filter((command) =>
      command.title.toLowerCase().includes(normalizedQuery)
      || command.description?.toLowerCase().includes(normalizedQuery),
    );
  }, [allCommands, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandPaletteOpen) {
      const cancelFocus = scheduleAfterPaint(() => inputRef.current?.focus());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      return cancelFocus;
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
      closePalette();
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
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

            <CommandPaletteResults
              filteredCommands={filtered}
              query={query}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              navigationTitle={t('common.navigation')}
              actionsTitle={t('common.actions')}
            />
            <CommandPaletteFooter />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
