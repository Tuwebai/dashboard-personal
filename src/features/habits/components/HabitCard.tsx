import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2, MoreVertical, Edit3, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import type { Habit } from '../../../shared/types';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { memo, useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { Modal } from '../../../shared/ui/Modal';
import { Input, Select } from '../../../shared/ui/Input';
import { getCurrentHabitStreak, getHabitWeekDays } from '../lib/habitCard';
import { useReadonlyActionProps } from '../../../shared/hooks/useReadonlyActionProps';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard = memo(function HabitCard({ habit }: HabitCardProps) {
  const { t } = useI18n();
  const { workspaceReadOnly, readonlyActionLabel, actionProps } = useReadonlyActionProps();
  const { habitLogs, logHabit, deleteHabit, updateHabit } = useAppStore(
    useShallow((state) => ({
      habitLogs: state.habitLogs,
      logHabit: state.logHabit,
      deleteHabit: state.deleteHabit,
      updateHabit: state.updateHabit,
    }))
  );
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: habit.name,
    category: habit.category,
    icon: habit.icon,
    color: habit.color,
  });
  
  const locale = useAppStore((state) => (state.settings.language === 'es' ? 'es-AR' : 'en-US'));
  const days = useMemo(() => getHabitWeekDays(habit.id, habitLogs, locale), [habit.id, habitLogs, locale]);
  const currentStreak = useMemo(() => getCurrentHabitStreak(habit.id, habitLogs), [habit.id, habitLogs]);
  const streakLabel = `${currentStreak} ${t(currentStreak === 1 ? 'habits.day' : 'habits.days')}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsDeleteOpen(true);
  };

  const handleEditOpen = () => {
    setFormData({
      name: habit.name,
      category: habit.category,
      icon: habit.icon,
      color: habit.color,
    });
    setShowMenu(false);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim()) return;
    updateHabit(habit.id, {
      name: formData.name,
      category: formData.category,
      icon: formData.icon,
      color: formData.color,
    });
    setIsEditOpen(false);
    toast.success(t('habits.habitUpdated'));
  };

  const confirmDelete = () => {
    deleteHabit(habit.id);
    setIsDeleteOpen(false);
    toast.success(t('habits.habitDeleted'));
  };

  return (
    <motion.div
      data-testid={`habit-card-${habit.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-border"
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
            <h3 className="text-sm font-bold text-text-primary transition-colors group-hover:text-violet-400">{habit.name}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{habit.category}</span>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            {...actionProps}
            className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-all disabled:cursor-not-allowed disabled:opacity-50"
            title={workspaceReadOnly ? readonlyActionLabel : t('common.more')}
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
                  <button
                    onClick={handleEditOpen}
                    type="button"
                    {...actionProps}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Edit3 size={16} />
                    <span>{t('habits.edit')}</span>
                  </button>
                  <button
                    type="button"
                    {...actionProps}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw size={16} />
                    <span>{t('habits.resetStreak')}</span>
                  </button>
                  <div className="h-1px bg-border my-1 mx-2" />
                  <button
                    onClick={handleDelete}
                    type="button"
                    {...actionProps}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span>{t('habits.deleteHabit')}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-6 relative z-10">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            data-testid={day.isToday ? `habit-log-${habit.id}-today` : undefined}
            aria-pressed={day.completed}
            disabled={workspaceReadOnly}
            title={workspaceReadOnly ? readonlyActionLabel : undefined}
            onClick={() => logHabit(habit.id, day.date, !day.completed)}
            className={cn(
              "flex min-w-0 flex-col items-center gap-3 p-2 rounded-2xl transition-all disabled:cursor-not-allowed disabled:opacity-60",
              day.isToday ? "border border-border bg-bg-secondary" : "hover:bg-bg-hover"
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
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('habits.deleteTitle')}
        message={t('habits.deleteMessage')}
      />
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t('habits.editHabit')}
        size="sm"
      >
        <div className="space-y-6">
          <div className="space-y-3 rounded-xl border border-border bg-bg-card p-6">
            <div
              className="mb-4 text-center text-4xl transition-transform duration-200 hover:scale-110"
              style={{ color: formData.color }}
            >
              {formData.icon}
            </div>
            <div className="flex justify-center gap-2">
              {['✨', '💧', '🥗', '🧘', '📖', '💻'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  disabled={workspaceReadOnly}
                  title={workspaceReadOnly ? readonlyActionLabel : undefined}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                    formData.icon === emoji
                      ? 'border-violet-500/30 bg-violet-500/20 text-violet-400'
                      : 'border-transparent bg-bg-secondary text-text-secondary hover:bg-bg-hover'
                  )}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  disabled={workspaceReadOnly}
                  title={workspaceReadOnly ? readonlyActionLabel : undefined}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
                    formData.color === color ? 'scale-110 border-border' : 'border-border'
                  )}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <Input
            label={t('habits.habitName')}
            placeholder={t('habits.habitPlaceholder')}
            value={formData.name}
            readOnly={workspaceReadOnly}
            title={workspaceReadOnly ? readonlyActionLabel : undefined}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Select
            label={t('habits.category')}
            value={formData.category}
            disabled={workspaceReadOnly}
            title={workspaceReadOnly ? readonlyActionLabel : undefined}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Habit['category'] })}
            options={[
              { value: 'health', label: t('habits.category_health') },
              { value: 'mind', label: t('habits.category_mind') },
              { value: 'work', label: t('habits.category_work') },
              { value: 'finance', label: t('habits.category_finance') },
            ]}
          />

          <button
            type="button"
            onClick={handleUpdate}
            disabled={workspaceReadOnly}
            title={workspaceReadOnly ? readonlyActionLabel : undefined}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-violet-500 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('habits.saveChanges')}
          </button>
        </div>
      </Modal>

      <div className="pt-4 border-t border-border flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold">
          <Flame size={14} className="fill-current" />
          <span>{streakLabel} {t('habits.streak')}</span>
        </div>
        {!habit.isBoolean && habit.targetValue && (
          <div className="text-[10px] font-semibold tracking-tight text-text-muted">
            GOAL: <span className="font-bold uppercase text-text-primary">{habit.targetValue}</span>
          </div>
        )}
      </div>

      <div 
        className="absolute -right-8 -bottom-8 w-32 h-32 blur-2xl rounded-full opacity-10 pointer-events-none transition-all group-hover:opacity-20"
        style={{ backgroundColor: habit.color }}
      />
    </motion.div>
  );
});
