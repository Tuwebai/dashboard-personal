import { useAppStore } from '../../../stores/useAppStore';
import { HabitCard } from './HabitCard';
import { AnimatePresence } from 'framer-motion';

interface HabitGridProps {
  category: string;
}

export function HabitGrid({ category }: HabitGridProps) {
  const { habits } = useAppStore();
  
  const filteredHabits = habits.filter(h => {
    if (category === 'all') return !h.isArchived;
    return h.category === category && !h.isArchived;
  });

  if (filteredHabits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-bg-card border border-border rounded-xl text-white/30">
        <div className="text-4xl mb-4 opacity-50 text-white/20 hover:scale-110 transition-transform">✨</div>
        <h3 className="text-sm font-semibold text-white/80">No habits found</h3>
        <p className="text-xs text-white/40 mt-1">Try searching in another category or create a new one.</p>
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
