import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Timer, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useAppStore } from '../../../stores/useAppStore';
import { ROUTINE_ICONS, TYPE_COLORS } from './constants';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { Routine, RoutineType } from '../../../shared/types';

interface RoutineSessionOverlayProps {
  activeRoutine: Routine | null;
}

export function RoutineSessionOverlay({ activeRoutine }: RoutineSessionOverlayProps) {
  const { t } = useI18n();
  const activeRoutineSession = useAppStore((state) => state.activeRoutineSession);
  const completeRoutineStep = useAppStore((state) => state.completeRoutineStep);
  const endRoutineSession = useAppStore((state) => state.endRoutineSession);

  if (!activeRoutine || !activeRoutineSession) return null;

  const currentStepIndex = activeRoutineSession.currentStepIndex;
  const currentStep = activeRoutine.steps[currentStepIndex];
  const progress = (currentStepIndex / activeRoutine.steps.length) * 100;

  const overlayContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          onClick={endRoutineSession}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-3xl p-8 md:p-12 shadow-2xl glass"
        >
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `${TYPE_COLORS[activeRoutine.type as RoutineType]}25` }}
                >
                  {(() => {
                    const Icon = ROUTINE_ICONS[activeRoutine.type as RoutineType];
                    return <Icon size={24} style={{ color: TYPE_COLORS[activeRoutine.type as RoutineType] }} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{activeRoutine.name}</h2>
                  <p className="text-text-secondary">Step {currentStepIndex + 1} of {activeRoutine.steps.length}</p>
                </div>
              </div>
              <button 
                onClick={endRoutineSession}
                className="p-3 hover:bg-white/5 rounded-2xl text-text-muted hover:text-text-primary transition-all group"
                title={t('routines.escToExit')}
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-linear-to-r from-violet-500 to-cyan-500 shadow-[0_0_20px_rgba(124,58,237,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep?.id || 'finished'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-12 text-center space-y-10"
              >
                {currentStep ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-5xl font-bold text-text-primary leading-tight">{currentStep.title}</h3>
                      <div className="flex items-center justify-center gap-2 text-text-secondary text-lg">
                        <Timer size={20} />
                        <span>{currentStep.duration} minutes</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        className="w-full max-w-sm h-24 text-xl shadow-violet/40 shadow-2xl group flex flex-col items-center justify-center gap-1 font-bold"
                        onClick={() => completeRoutineStep(activeRoutine.id, currentStepIndex)}
                      >
                        <span>Complete Step</span>
                        <span className="text-[10px] opacity-50 font-mono tracking-widest bg-black/20 px-2 py-0.5 rounded uppercase">ENTER / SPACE</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-10">
                    <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={48} className="checkmark-animate" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-5xl font-bold text-text-primary">All Done!</h3>
                      <p className="text-text-secondary text-xl">Routine completed successfully.</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="w-full max-w-sm h-16 text-lg border-border hover:bg-white/5"
                      onClick={endRoutineSession}
                    >
                      {t('routines.finishAndClose')}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {currentStepIndex < activeRoutine.steps.length && (
              <div className="pt-6 border-t border-border/10">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-4">Up Next</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeRoutine.steps.slice(currentStepIndex + 1, currentStepIndex + 3).map((step, idx) => (
                    <div key={step.id} className={cn(
                      "flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-border/50",
                      idx === 0 ? "opacity-60" : "opacity-30"
                    )}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-text-muted">{currentStepIndex + 2 + idx}</span>
                        <span className="text-sm font-semibold text-text-primary truncate">{step.title}</span>
                      </div>
                      <span className="text-xs text-text-secondary font-mono">{step.duration}m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(overlayContent, document.body);
}
