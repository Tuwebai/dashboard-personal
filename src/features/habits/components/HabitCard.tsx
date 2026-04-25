import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2, MoreVertical, Edit3, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { Habit } from '../../../shared/types';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { t } = useI18n();
  const { habitLogs, logHabit, deleteHabit } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  
  // Get last 7 days of logs
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = habitLogs.find(l => l.habitId === habit.id && l.date === dateStr);
    return {
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      completed: log?.completed ?? false,
      isToday: i === 6
    };
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHabit(habit.id);
    setShowMenu(false);
    toast.success(t('habits.habitDeleted'));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-bg-card border border-border rounded-xl p-5 hover:border-white/10 transition-all group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${habit.color}20, ${habit.color}10)`, 
              color: habit.color,
              border: `1px solid ${habit.color}30`
            }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">{habit.name}</h3>
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{habit.category}</span>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-all"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-bg-card border border-border rounded-xl shadow-2xl p-2 z-50"
                >
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left">
                    <Edit3 size={16} />
                    <span>Edit Habit</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left">
                    <RotateCcw size={16} />
                    <span>Reset Streak</span>
                  </button>
                  <div className="h-[1px] bg-border my-1 mx-2" />
                  <button onClick={handleDelete} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left">
                    <Trash2 size={16} />
                    <span>Delete Habit</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 mb-6 relative z-10">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => logHabit(habit.id, day.date, !day.completed)}
            className={cn(
              "flex flex-col items-center gap-3 flex-1 p-2 rounded-2xl transition-all",
              day.isToday ? "bg-white/5 border border-white/10 ring-1 ring-white/5" : "hover:bg-white/3"
            )}
          >
            <span className={cn(
              "text-[10px] font-black uppercase tracking-tighter",
              day.isToday ? "text-violet-400" : "text-text-muted"
            )}>
              {day.dayName}
            </span>
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all border-2",
              day.completed 
                ? "border-transparent shadow-2xl" 
                : "border-dashed border-border/40 group-hover:border-border/80"
            )}
            style={day.completed ? { backgroundColor: habit.color, boxShadow: `0 0 15px ${habit.color}60` } : {}}
            >
              <AnimatePresence mode="wait">
                {day.completed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={18} className="text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold">
          <Flame size={14} className="fill-current" />
          <span>8 DAY STREAK</span>
        </div>
        {!habit.isBoolean && habit.targetValue && (
          <div className="text-[10px] text-white/30 font-semibold tracking-tight">
            GOAL: <span className="text-white/80 font-bold uppercase">{habit.targetValue}</span>
          </div>
        )}
      </div>

      <div 
        className="absolute -right-8 -bottom-8 w-32 h-32 blur-[40px] rounded-full opacity-10 pointer-events-none transition-all group-hover:opacity-20"
        style={{ backgroundColor: habit.color }}
      />
    </motion.div>
  );
}
