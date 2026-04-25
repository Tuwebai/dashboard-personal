import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../stores/useAppStore';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { Input, Select } from '../../../shared/ui/Input';
import { HabitGrid } from '../components/HabitGrid';
import type { HabitCategory } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

export default function Habits() {
  const [activeCategory, setActiveCategory] = useState<HabitCategory>('health');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health' as HabitCategory,
    icon: '✨',
    color: '#7c3aed',
  });

  const { addHabit } = useAppStore(
    useShallow((state) => ({
      addHabit: state.addHabit,
    }))
  );
  const { t } = useI18n();

  const handleAddHabit = () => {
    if (!newHabit.name) return;
    addHabit({
      ...newHabit,
      frequency: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      isBoolean: true,
      isArchived: false,
    });
    toast.success(t('habits.habitCreated'));
    setNewHabit({ name: '', category: 'health', icon: '✨', color: '#7c3aed' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 page-enter h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('habits.title')}</h1>
          <p className="text-sm font-medium text-white/30 uppercase tracking-[0.2em] mt-1">
            {t('habits.subtitle')}
          </p>
        </div>
        <Button 
          variant="primary" 
          className="h-11 px-6 shadow-xl shadow-violet-500/20"
          leftIcon={<Plus size={18} strokeWidth={2.5} />} 
          onClick={() => setIsModalOpen(true)}
        >
          {t('habits.newHabit')}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {(['health', 'mind', 'work', 'finance'] as HabitCategory[]).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 border ${
                activeCategory === category 
                  ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' 
                  : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {t(`habits.category_${category}`)}
            </button>
          ))}
        </div>
        
        <HabitGrid category={activeCategory} />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={t('habits.newHabit')}
        size="sm"
      >
        <div className="space-y-6">
          <div className="space-y-3 p-6 bg-bg-card rounded-xl border border-border">
            <div
              className="text-4xl text-center mb-4 transition-transform hover:scale-110 duration-200"
              style={{ color: newHabit.color }}
            >
              {newHabit.icon}
            </div>
            <div className="flex justify-center gap-2">
              {['✨', '💧', '🥗', '🧘', '📖', '💻'].map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => setNewHabit({...newHabit, icon: emoji})} 
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                    newHabit.icon === emoji 
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                      : 'bg-white/5 text-white/40 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                <button
                  key={color}
                  onClick={() => setNewHabit({ ...newHabit, color })}
                  className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                    newHabit.color === color ? 'scale-110 border-white' : 'border-white/10'
                  }`}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <Input 
            label={t('habits.habitName')} 
            placeholder={t('habits.habitPlaceholder')} 
            value={newHabit.name}
            onChange={e => setNewHabit({...newHabit, name: e.target.value})}
            autoFocus
          />

          <Select 
            label={t('habits.category')}
            value={newHabit.category}
            onChange={e => setNewHabit({...newHabit, category: e.target.value as HabitCategory})}
            options={[
              { value: 'health', label: t('habits.category_health') },
              { value: 'mind', label: t('habits.category_mind') },
              { value: 'work', label: t('habits.category_work') },
              { value: 'finance', label: t('habits.category_finance') },
            ]}
          />

          <Button 
            variant="primary" 
            className="w-full h-11 shadow-xl shadow-violet-500/20" 
            onClick={handleAddHabit}
          >
            {t('habits.createHabit')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
