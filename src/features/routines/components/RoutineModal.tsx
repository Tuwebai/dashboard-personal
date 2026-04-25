import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { Input } from '../../../shared/ui/Input';
import { useAppStore } from '../../../stores/useAppStore';
import { ROUTINE_ICONS } from './constants';
import { genId } from '../../../shared/lib/id';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { Routine, RoutineType, RoutineStep } from '../../../shared/types';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine?: Routine | null;
}

export function RoutineModal({ isOpen, onClose, routine }: RoutineModalProps) {
  const { t } = useI18n();
  const { addRoutine, updateRoutine } = useAppStore();
  const [formData, setFormData] = useState<Omit<Routine, 'id' | 'createdAt' | 'totalDuration'>>({
    name: '',
    type: 'custom',
    isActive: true,
    steps: [{ id: genId(), routineId: '', title: '', duration: 5, order: 0, completed: false }]
  });

  useEffect(() => {
    if (routine) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: routine.name,
        type: routine.type,
        isActive: routine.isActive,
        steps: routine.steps.map(s => ({ ...s }))
      });
    } else {
      setFormData({
        name: '',
        type: 'custom',
        isActive: true,
        steps: [{ id: genId(), routineId: '', title: '', duration: 5, order: 0, completed: false }]
      });
    }
  }, [routine, isOpen]);

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { 
        id: genId(), 
        routineId: routine?.id || '', 
        title: '', 
        duration: 5, 
        order: prev.steps.length, 
        completed: false 
      }]
    }));
  };

  const removeStep = (id: string) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }));
    }
  };

  const updateStep = (id: string, updates: Partial<RoutineStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const handleSave = () => {
    if (!formData.name || formData.steps.some(s => !s.title)) return;
    
    const totalDuration = formData.steps.reduce((acc, s) => acc + s.duration, 0);
    const routineData = { ...formData, totalDuration };

    if (routine) {
      updateRoutine(routine.id, routineData);
      toast.success(t('routines.routineUpdated'));
    } else {
      addRoutine(routineData);
      toast.success(t('routines.routineCreated'));
    }
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={routine ? t('routines.editRoutine') : t('routines.createRoutine')}
      size="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto text-scrollbar">
        <div className="space-y-6">
          <Input 
            label={t('routines.routineName')}
            placeholder={t('routines.routinePlaceholder')} 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(ROUTINE_ICONS) as RoutineType[]).map(type => {
              const Icon = ROUTINE_ICONS[type];
              const isSelected = formData.type === type;
              return (
                <button key={type} onClick={() => setFormData({...formData, type})} className={cn("aspect-square flex flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all", isSelected ? "bg-violet-500/20 border-violet-500 text-violet-400" : "bg-white/3 border-transparent text-text-muted hover:bg-white/5")}>
                  <Icon size={20} />
                  <span className="text-[9px] uppercase font-black tracking-tighter">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Steps & Duration</h4>
            <button onClick={addStep} className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <Plus size={14} /> Add Step
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-2xl border border-border/50 group">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-text-muted">{index + 1}</div>
                <input type="text" value={step.title} onChange={e => updateStep(step.id, { title: e.target.value })} placeholder={t('routines.stepTitlePlaceholder')} className="flex-1 bg-transparent text-sm text-text-primary outline-none" />
                <div className="flex items-center gap-2 bg-black/20 rounded-xl px-2 py-1">
                  <Clock size={12} className="text-text-muted" />
                  <input type="number" value={step.duration} onChange={e => updateStep(step.id, { duration: parseInt(e.target.value) || 0 })} className="w-4 bg-transparent text-xs font-bold text-text-primary outline-none text-center" />
                  <span className="text-[10px] text-text-muted mr-1">m</span>
                </div>
                <button onClick={() => removeStep(step.id)} className="p-1.5 text-text-muted hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/2 border-t border-border/50">
        <Button variant="primary" className="w-full h-14 shadow-xl shadow-violet-500/20 font-bold text-lg" onClick={handleSave} leftIcon={<Check size={20} />}>
          {routine ? 'Update Routine' : 'Create Routine'}
        </Button>
      </div>
    </Modal>
  );
}
