import { useAppStore } from '../../../stores/useAppStore';
import { HabitCard } from './HabitCard';
import { AnimatePresence } from 'framer-motion';
import { useI18n } from '../../../shared/i18n/useI18n';

interface HabitGridProps {
  category: string;
}

export function HabitGrid({ category }: HabitGridProps) {
  const habits = useAppStore((state) => state.habits);
  const { t } = useI18n();
  
  const filteredHabits = habits.filter(h => {
    if (category === 'all') return !h.isArchived;
    return h.category === category && !h.isArchived;
  });

  if (filteredHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-card py-20 text-text-muted">
        <div className="mb-4 text-4xl opacity-60 transition-transform hover:scale-110">✨</div>
        <h3 className="text-sm font-semibold text-text-primary">{t('habits.noHabits')}</h3>
        <p className="mt-1 text-xs text-text-secondary">{t('habits.noHabitsDesc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {filteredHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </AnimatePresence>
    </div>
  );
}
