import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Play, Clock, MoreHorizontal, Edit3, Trash2, RotateCcw
} from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useAppStore } from '../../../stores/useAppStore';
import type { Routine, RoutineType } from '../../../shared/types';
import { ROUTINE_ICONS, TYPE_COLORS } from './constants';
import { useI18n } from '../../../shared/i18n/useI18n';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';

interface RoutineCardProps {
  routine: Routine;
  onSelect: (routine: Routine) => void;
  onEdit: (routine: Routine) => void;
}

export function RoutineCard({ routine, onSelect, onEdit }: RoutineCardProps) {
  const { t } = useI18n();
  const { startRoutineSession, deleteRoutine } = useAppStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const Icon = ROUTINE_ICONS[routine.type as RoutineType];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteRoutine(routine.id);
    setIsDeleteOpen(false);
    toast.success(t('routines.routineDeleted'));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(routine);
    setShowMenu(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-bg-card border border-border/50 rounded-2xl p-5 cursor-pointer transition-all hover:bg-bg-hover hover-card relative"
        onClick={() => onSelect(routine)}
      >
        <div className="flex items-start justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-black/20"
          style={{ background: `${TYPE_COLORS[routine.type as RoutineType]}15` }}
        >
          <Icon size={20} style={{ color: TYPE_COLORS[routine.type as RoutineType] }} />
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all"
          >
            <MoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-bg-secondary border border-border rounded-xl shadow-2xl p-1.5 z-50 glass"
                >
                  <button 
                    onClick={handleEdit}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left"
                  >
                    <Edit3 size={14} />
                    <span>Edit Routine</span>
                  </button>
                  <div className="h-1px bg-border my-1 mx-1" />
                  <button 
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-text-primary group-hover:text-violet-400 transition-colors">{routine.name}</h3>
        <div className="flex items-center gap-3 text-text-secondary text-xs">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{routine.totalDuration}m total</span>
          </div>
          <div className="flex items-center gap-1">
            <RotateCcw size={12} />
            <span>{routine.steps.length} steps</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
          {routine.steps.slice(0, 3).map((step, i) => (
            <div 
              key={step.id} 
              className="w-7 h-7 rounded-lg border-2 border-bg-card bg-bg-tertiary flex items-center justify-center text-[10px] text-text-secondary"
              title={step.title}
            >
              {i + 1}
            </div>
          ))}
          {routine.steps.length > 3 && (
            <div className="w-7 h-7 rounded-lg border-2 border-bg-card bg-bg-tertiary flex items-center justify-center text-[10px] text-text-muted">
              +{routine.steps.length - 3}
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="bg-white/5 hover:bg-violet-500 hover:text-white border-none group/btn shadow-none"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            startRoutineSession(routine.id);
          }}
        >
          <Play size={14} className="fill-current" />
        </Button>
        </div>
      </motion.div>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('routines.deleteTitle')}
        message={t('routines.deleteMessage')}
      />
    </>
  );
}
