import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { Button } from '../../../shared/ui/Button';
import { RoutineCard } from '../components/RoutineCard';
import { RoutineDetailModal } from '../components/RoutineDetailModal';
import { RoutineSessionOverlay } from '../components/RoutineSessionOverlay';
import { RoutineModal } from '../components/RoutineModal';
import { RoutineEmptyState } from '../components/RoutineEmptyState';
import type { Routine } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

export function Routines() {
  const { 
    routines, activeRoutineSession, completeRoutineStep, endRoutineSession 
  } = useAppStore();
  const { t } = useI18n();
  
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleNewRoutine = () => {
    setEditingRoutine(null);
    setIsModalOpen(true);
  };

  const activeRoutine = routines.find(r => r.id === activeRoutineSession?.routineId);
  const currentStepIndex = activeRoutineSession?.currentStepIndex ?? 0;

  // Global shortcuts for the active session and modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close preview modal on ESC
      if (e.key === 'Escape') {
        if (selectedRoutine) setSelectedRoutine(null);
        if (activeRoutineSession) endRoutineSession();
      }
      
      // Active session keyboard logic
      if (activeRoutineSession && activeRoutine) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const currentStep = activeRoutine.steps[currentStepIndex];
          if (currentStep) {
            completeRoutineStep(activeRoutine.id, currentStepIndex);
          } else {
            endRoutineSession();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRoutine, activeRoutineSession, activeRoutine, currentStepIndex, completeRoutineStep, endRoutineSession]);

  return (
    <div className="space-y-6 page-enter pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{t('routines.title')}</h1>
          <p className="text-sm text-text-secondary mt-1">{t('routines.subtitle')}</p>
        </div>
        {routines.length > 0 && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />} 
            className="shadow-violet/20 shadow-lg font-bold"
            onClick={handleNewRoutine}
          >
            {t('routines.new')}
          </Button>
        )}
      </div>

      {routines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map(routine => (
            <RoutineCard 
              key={routine.id} 
              routine={routine} 
              onSelect={setSelectedRoutine}
              onEdit={handleEditRoutine}
            />
          ))}
        </div>
      ) : (
        <RoutineEmptyState onCreateClick={handleNewRoutine} />
      )}

      {/* Routine Detail Preview */}
      <RoutineDetailModal 
        routine={selectedRoutine} 
        onClose={() => setSelectedRoutine(null)}
        onEdit={handleEditRoutine}
      />

      {/* Active Session Overlay */}
      <RoutineSessionOverlay 
        activeRoutine={activeRoutine || null} 
      />
      
      <RoutineModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoutine(null);
        }}
        routine={editingRoutine}
      />
    </div>
  );
}
