import { Play, ChevronRight } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Modal } from '../../../shared/ui/Modal';
import { useAppStore } from '../../../stores/useAppStore';
import { ROUTINE_ICONS, TYPE_COLORS } from './constants';
import type { Routine, RoutineType } from '../../../shared/types';

interface RoutineDetailModalProps {
  routine: Routine | null;
  onClose: () => void;
  onEdit: (routine: Routine) => void;
}

export function RoutineDetailModal({ routine, onClose, onEdit }: RoutineDetailModalProps) {
  const { startRoutineSession } = useAppStore();

  if (!routine) return null;

  return (
    <Modal 
      isOpen={!!routine} 
      onClose={onClose} 
      size="lg"
      className="max-w-xl"
    >
      <div className="relative h-32 bg-linear-to-br from-violet-600/20 to-cyan-600/20 flex items-end p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/40"
            style={{ background: TYPE_COLORS[routine.type as RoutineType] }}
          >
            {(() => {
              const Icon = ROUTINE_ICONS[routine.type as RoutineType];
              return <Icon size={28} className="text-white" />;
            })()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary leading-none">{routine.name}</h2>
            <p className="text-text-secondary text-sm mt-1 capitalize">{routine.type} Routine · {routine.totalDuration}m</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Sequence</h4>
            <span className="text-[10px] text-text-muted font-medium">ESC to close</span>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-scrollbar">
            {routine.steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-4 p-3 hover:bg-white/3 rounded-xl transition-all group/step border border-transparent hover:border-border/50">
                <span className="text-text-muted text-lg font-mono w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{step.title}</p>
                  <p className="text-[10px] text-text-secondary">{step.duration} minutes</p>
                </div>
                <ChevronRight size={14} className="text-text-muted/0 group-hover/step:text-text-muted/50 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            variant="primary" 
            className="flex-1 shadow-lg shadow-violet/20 font-bold"
            leftIcon={<Play size={16} className="fill-current" />}
            onClick={() => {
              startRoutineSession(routine.id);
              onClose();
            }}
          >
            Start Session
          </Button>
          <Button 
            variant="ghost" 
            className="bg-white/5 border-none hover:bg-white/10"
            onClick={() => onEdit(routine)}
          >
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
