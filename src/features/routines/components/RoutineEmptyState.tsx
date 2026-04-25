import { motion } from 'framer-motion';
import { RotateCcw, Plus } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';

interface RoutineEmptyStateProps {
  onCreateClick: () => void;
}

export function RoutineEmptyState({ onCreateClick }: RoutineEmptyStateProps) {
  const { t } = useI18n();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 glow-violet">
        <RotateCcw size={40} className="text-violet-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">
        {t('routines.noRoutines')}
      </h2>
      <p className="text-white/40 max-w-sm mb-8">
        {t('routines.noRoutinesDesc')}
      </p>

      <Button 
        variant="primary" 
        leftIcon={<Plus size={18} />}
        className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-violet-500/20"
        onClick={onCreateClick}
      >
        {t('routines.new')}
      </Button>
    </motion.div>
  );
}
