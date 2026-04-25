import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Pause, Play, TimerReset } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { FocusSession } from '../types';

interface FocusTimerCardProps {
  session: FocusSession | null;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onFinish: (id: string) => void;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function FocusTimerCard({ session, onPause, onResume, onFinish }: FocusTimerCardProps) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [session]);

  const timerData = useMemo(() => {
    if (!session) {
      return {
        elapsedSeconds: 0,
        remainingSeconds: 0,
        progress: 0,
      };
    }

    const liveDelta =
      session.status === 'active' && session.lastResumedAt
        ? Math.max(0, Math.floor((now - new Date(session.lastResumedAt).getTime()) / 1000))
        : 0;

    const elapsedSeconds = session.elapsedSeconds + liveDelta;
    const totalSeconds = session.plannedMinutes * 60;
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    const progress = totalSeconds > 0 ? Math.min(100, (elapsedSeconds / totalSeconds) * 100) : 0;

    return { elapsedSeconds, remainingSeconds, progress };
  }, [now, session]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
          <TimerReset size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('focus.timer.title')}</h2>
          <p className="mt-1 text-xs text-white/35">
            {session ? session.title : t('focus.timer.empty')}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-5xl font-bold tracking-tight text-white">
          {formatTime(timerData.remainingSeconds)}
        </div>
        <p className="mt-2 text-sm text-white/45">
          {t('focus.timer.elapsed').replace('{time}', formatTime(timerData.elapsedSeconds))}
        </p>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-500"
          style={{ width: `${timerData.progress}%` }}
        />
      </div>

      {session ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {session.status === 'active' ? (
            <Button onClick={() => onPause(session.id)} variant="secondary">
              <Pause size={16} />
              {t('focus.timer.pause')}
            </Button>
          ) : null}
          {session.status === 'paused' ? (
            <Button onClick={() => onResume(session.id)} variant="secondary">
              <Play size={16} />
              {t('focus.timer.resume')}
            </Button>
          ) : null}
          {(session.status === 'active' || session.status === 'paused') ? (
            <Button onClick={() => onFinish(session.id)}>
              <CheckCircle2 size={16} />
              {t('focus.timer.finish')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
