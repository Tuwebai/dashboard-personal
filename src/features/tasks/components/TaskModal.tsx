import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input, Select, Textarea } from '../../../shared/ui/Input';
import { useAppStore } from '../../../stores/useAppStore';
import { KANBAN_COLUMNS } from '../../../shared/lib/helpers';
import type { Task } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

const taskSchema = z.object({
  title: z.string().min(1, 'tasks.titleRequired').max(200),
  description: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']),
  goalId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedTime: z.number().optional(),
  project: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  initialGoalId?: string;
}

export function TaskModal({ isOpen, onClose, task, initialGoalId = '' }: TaskModalProps) {
  const { t } = useI18n();
  const priorityOptions = [
    { value: 'critical', label: `🔴 ${t('tasks.priorityCritical')}` },
    { value: 'high', label: `🟠 ${t('tasks.priorityHigh')}` },
    { value: 'medium', label: `🟡 ${t('tasks.priorityMedium')}` },
    { value: 'low', label: `🟢 ${t('tasks.priorityLow')}` },
  ];
  const statusLabels = {
    backlog: t('tasks.statusBacklog'),
    todo: t('tasks.statusTodo'),
    in_progress: t('tasks.statusInProgress'),
    review: t('tasks.statusReview'),
    done: t('tasks.statusDone'),
  } as const;
  const addTask = useAppStore((state) => state.addTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const personalGoals = useAppStore((state) => state.personalGoals);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium',
      status: 'todo',
    }
  });

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description ?? '');
      setValue('priority', task.priority);
      setValue('status', task.status);
      setValue('goalId', task.goalId ?? '');
      setValue('dueDate', task.dueDate ?? '');
      setValue('project', task.project ?? '');
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        goalId: initialGoalId,
        dueDate: '',
        project: '',
      });
    }
  }, [task, isOpen, setValue, reset, initialGoalId]);

  const onSubmit = (data: TaskFormValues) => {
    const normalizedData = {
      ...data,
      title: data.title.trim(),
      description: data.description?.trim() ?? '',
      goalId: data.goalId?.trim() ?? '',
      dueDate: data.dueDate?.trim() ?? '',
      project: data.project?.trim() ?? '',
    };

    if (task) {
      updateTask(task.id, normalizedData);
      toast.success(t('tasks.updated'));
    } else {
      addTask({
        ...normalizedData,
        tags: [],
        subtasks: [],
        recurrence: 'none',
        progress: 0,
        isArchived: false,
      });
      toast.success(t('tasks.created'));
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? t('common.saveChanges') : t('common.create')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <Input
          label={t('tasks.fieldTitle')}
          placeholder={t('tasks.whatNeedsToBeDone')}
          {...register('title')}
          error={errors.title?.message ? t(errors.title.message) : undefined}
          autoFocus
        />
        <Textarea
          label={t('tasks.fieldDescription')}
          placeholder={t('tasks.addMoreDetails')}
          {...register('description')}
          rows={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('tasks.fieldPriority')}
            options={priorityOptions}
            {...register('priority')}
          />
          <Select
            label={t('tasks.fieldStatus')}
            options={KANBAN_COLUMNS.map(c => ({ value: c.id, label: statusLabels[c.id] }))}
            {...register('status')}
          />
        </div>
        <Select
          label={t('tasks.goal')}
          options={[
            { value: '', label: t('tasks.noGoal') },
            ...personalGoals.map((goal) => ({ value: goal.id, label: goal.title }))
          ]}
          {...register('goalId')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('tasks.fieldDueDate')}
            type="date"
            {...register('dueDate')}
          />
          <Input
            label={t('tasks.fieldProject')}
            placeholder={t('tasks.projectPlaceholder')}
            {...register('project')}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {task ? t('common.saveChanges') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
