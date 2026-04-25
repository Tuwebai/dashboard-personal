import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input, Textarea, Select } from '../../../shared/ui/Input';
import { useAppStore } from '../../../stores/useAppStore';
import type { Task } from '../../../shared/types';
import { TaskModal } from '../../tasks/components/TaskModal';
import type { PersonalGoal, GoalHorizon, GoalPriority, GoalStatus } from '../types';
import { useI18n } from '../../../shared/i18n/useI18n';
import { toast } from 'sonner';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: PersonalGoal | null;
  relatedTasks?: Task[];
}

interface GoalFormState {
  title: string;
  description: string;
  horizon: GoalHorizon;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
}

const INITIAL_STATE: GoalFormState = {
  title: '',
  description: '',
  horizon: 'monthly',
  priority: 'medium',
  status: 'planned',
  progress: 0,
};

function buildGoalFormState(goal?: PersonalGoal | null): GoalFormState {
  if (!goal) {
    return INITIAL_STATE;
  }

  return {
    title: goal.title,
    description: goal.description,
    horizon: goal.horizon,
    priority: goal.priority,
    status: goal.status,
    progress: goal.progress,
  };
}

interface GoalFormContentProps {
  goal?: PersonalGoal | null;
  relatedTasks: Task[];
  onClose: () => void;
}

function GoalFormContent({ goal, relatedTasks, onClose }: GoalFormContentProps) {
  const addPersonalGoal = useAppStore((state) => state.addPersonalGoal);
  const updatePersonalGoal = useAppStore((state) => state.updatePersonalGoal);
  const { t } = useI18n();
  const [form, setForm] = useState<GoalFormState>(() => buildGoalFormState(goal));
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (goal) {
      updatePersonalGoal(goal.id, form);
      toast.success(t('goals.updated'));
    } else {
      addPersonalGoal(form);
      toast.success(t('goals.created'));
    }

    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label={t('goals.titleLabel')}
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder={t('goals.titlePlaceholder')}
          required
        />

        <Textarea
          label={t('goals.description')}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder={t('goals.descriptionPlaceholder')}
          rows={4}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label={t('goals.horizon')}
            value={form.horizon}
            onChange={(event) => setForm((prev) => ({ ...prev, horizon: event.target.value as GoalHorizon }))}
            options={[
              { value: 'weekly', label: t('goals.horizonWeekly') },
              { value: 'monthly', label: t('goals.horizonMonthly') },
              { value: 'quarterly', label: t('goals.horizonQuarterly') },
              { value: 'yearly', label: t('goals.horizonYearly') },
            ]}
          />

          <Select
            label={t('goals.priority')}
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value as GoalPriority }))}
            options={[
              { value: 'low', label: t('goals.priorityLow') },
              { value: 'medium', label: t('goals.priorityMedium') },
              { value: 'high', label: t('goals.priorityHigh') },
              { value: 'critical', label: t('goals.priorityCritical') },
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label={t('goals.status')}
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as GoalStatus }))}
            options={[
              { value: 'planned', label: t('goals.statusPlanned') },
              { value: 'active', label: t('goals.statusActive') },
              { value: 'paused', label: t('goals.statusPaused') },
              { value: 'completed', label: t('goals.statusCompleted') },
            ]}
          />

          <Input
            type="number"
            min={0}
            max={100}
            label="Progreso"
            value={form.progress}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                progress: Number(event.target.value || 0),
              }))
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('goals.cancel')}
          </Button>
          <Button type="submit" variant="gradient">
            {goal ? t('goals.saveChanges') : t('goals.create')}
          </Button>
        </div>

        {goal ? (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{t('goals.relatedTasksTitle')}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/35">{relatedTasks.length}</span>
                <Button type="button" size="sm" variant="outline" onClick={() => setIsTaskModalOpen(true)}>
                  {t('goals.newRelatedTask')}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {relatedTasks.length ? (
                relatedTasks.map((task) => (
                  <div key={task.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/70">
                    {task.title}
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/35">{t('goals.relatedTasksEmpty')}</p>
              )}
            </div>
          </div>
        ) : null}
      </form>

      {goal ? (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          initialGoalId={goal.id}
        />
      ) : null}
    </>
  );
}

export function GoalModal({ isOpen, onClose, goal, relatedTasks = [] }: GoalModalProps) {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goal ? t('goals.editGoal') : t('goals.newGoal')} size="md">
      <GoalFormContent
        key={goal?.id ?? (isOpen ? 'new-open' : 'new-closed')}
        goal={goal}
        relatedTasks={relatedTasks}
        onClose={onClose}
      />
    </Modal>
  );
}
