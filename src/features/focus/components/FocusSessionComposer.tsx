import { useMemo, useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '../../../shared/ui/Button';
import { Input, Select } from '../../../shared/ui/Input';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { Task } from '../../../shared/types';
import type { FocusMode } from '../types';

interface FocusSessionComposerProps {
  tasks: Task[];
    onCreateSession: (payload: {
      title: string;
      mode: FocusMode;
      plannedMinutes: number;
      linkedTaskId: string;
      status: 'active';
      interruptionCount: number;
      interruptionNotes: string[];
      linkedDate: string;
      elapsedSeconds: number;
      startedAt: string;
      lastResumedAt: string;
    }) => void;
}

export function FocusSessionComposer({ tasks, onCreateSession }: FocusSessionComposerProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<FocusMode>('pomodoro');
  const [plannedMinutes, setPlannedMinutes] = useState('25');
  const [linkedTaskId, setLinkedTaskId] = useState('');

  const isDeepWork = mode === 'deep_work';

  const taskOptions = useMemo(
    () => [
      { value: '', label: t('focus.form.taskPlaceholder') },
      ...tasks
        .filter((task) => task.status !== 'done')
        .map((task) => ({ value: task.id, label: task.title })),
    ],
    [tasks, t],
  );

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const now = new Date();

    onCreateSession({
      title: trimmedTitle,
      mode,
      plannedMinutes: Number(plannedMinutes) || 25,
      linkedTaskId,
      status: 'active',
      interruptionCount: 0,
      interruptionNotes: [],
      linkedDate: format(now, 'yyyy-MM-dd'),
      elapsedSeconds: 0,
      startedAt: now.toISOString(),
      lastResumedAt: now.toISOString(),
    });
    toast.success(t('focus.created'));

    setTitle('');
    setMode('pomodoro');
    setPlannedMinutes('25');
    setLinkedTaskId('');
  };

  const handleModeChange = (value: FocusMode) => {
    setMode(value);
    setPlannedMinutes(value === 'deep_work' ? '90' : '25');
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
          <Plus size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('focus.form.title')}</h2>
          <p className="mt-1 text-xs text-white/35">{t('focus.form.subtitle')}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
              {t('focus.form.modePreviewLabel')}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-white">
              {isDeepWork ? t('focus.form.modeDeepWork') : t('focus.form.modePomodoro')}
            </h3>
            <p className="mt-1 text-xs text-white/45">
              {isDeepWork ? t('focus.form.deepWorkHelper') : t('focus.form.pomodoroHelper')}
            </p>
          </div>
          <div
            className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
              isDeepWork
                ? 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-100'
                : 'border border-violet-500/20 bg-violet-500/10 text-violet-100'
            }`}
          >
            {plannedMinutes} min
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Input
          label={t('focus.form.sessionName')}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t('focus.form.sessionNamePlaceholder')}
        />
        <Select
          label={t('focus.form.mode')}
          value={mode}
          onChange={(event) => handleModeChange(event.target.value as FocusMode)}
          options={[
            { value: 'pomodoro', label: t('focus.form.modePomodoro') },
            { value: 'deep_work', label: t('focus.form.modeDeepWork') },
          ]}
        />
        <Input
          label={t('focus.form.minutes')}
          type="number"
          min="1"
          value={plannedMinutes}
          onChange={(event) => setPlannedMinutes(event.target.value)}
          placeholder="25"
        />
        <Select
          label={t('focus.form.linkedTask')}
          value={linkedTaskId}
          onChange={(event) => setLinkedTaskId(event.target.value)}
          options={taskOptions}
        />
      </div>

      <div className="mt-5">
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          <Play size={16} />
          {t('focus.form.startNow')}
        </Button>
      </div>
    </section>
  );
}
