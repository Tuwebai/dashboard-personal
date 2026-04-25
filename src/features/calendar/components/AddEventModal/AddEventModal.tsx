import { memo, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { AddEventForm } from './AddEventForm.tsx';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: { title: string; startDate: string; startTime: string; duration: string; color: string }) => void;
}

export const AddEventModal = memo(({ isOpen, onClose, onAdd }: AddEventModalProps) => {
  const { t } = useI18n();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="relative bg-bg-secondary border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl glass"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">{t('calendar.scheduleEvent')}</h3>
              <button 
                onClick={handleClose} 
                className="p-2 text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                aria-label={t('calendar.closeModal')}
              >
                <X size={20} />
              </button>
            </div>

            <AddEventForm onConfirm={onAdd} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AddEventModal.displayName = 'AddEventModal';
