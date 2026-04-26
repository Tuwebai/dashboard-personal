import { Brain, ChartColumnBig, Timer } from 'lucide-react';
import { startOfWeek } from 'date-fns';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { FocusSession } from '../types';

interface FocusLayoutCardsProps {
  sessions: FocusSession[];
}

function getSessionTrackedMinutes(session: FocusSession) {
  return Math.floor(session.elapsedSeconds / 60);
}

export function FocusLayoutCards({ sessions }: FocusLayoutCardsProps) {
  const { t } = useI18n();

  const activeSession = sessions.find((session) => session.status === 'active' || session.status === 'paused') ?? null;
  const todayDate = new Date().toISOString().split('T')[0];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0];
  const todaySessions = sessions.filter((session) => session.linkedDate === todayDate);
  const weekSessions = sessions.filter((session) => session.linkedDate >= weekStart);
  const weeklyMinutes = weekSessions.reduce((total, session) => total + getSessionTrackedMinutes(session), 0);
  const deepWorkSessions = weekSessions.filter((session) => session.mode === 'deep_work');
  const weeklyInterruptions = weekSessions.reduce((total, session) => total + session.interruptionCount, 0);

  const cards = [
    {
      key: 'session',
      icon: Timer,
      title: t('focus.card.session.title'),
      subtitle: activeSession
        ? `${activeSession.title} · ${activeSession.plannedMinutes} min · ${t(`focus.mode.${activeSession.mode}`)}`
        : t('focus.card.session.subtitle'),
    },
    {
      key: 'interruptions',
      icon: Brain,
      title: t('focus.card.interruptions.title'),
      subtitle:
        sessions.length > 0
          ? t('focus.card.interruptions.count').replace('{count}', String(weeklyInterruptions))
          : t('focus.card.interruptions.subtitle'),
    },
    {
      key: 'metrics',
      icon: ChartColumnBig,
      title: t('focus.card.metrics.title'),
      subtitle:
        sessions.length > 0
          ? t('focus.card.metrics.count')
              .replace('{today}', String(todaySessions.length))
              .replace('{minutes}', String(weeklyMinutes))
              .replace('{deep}', String(deepWorkSessions.length))
          : t('focus.card.metrics.subtitle'),
    },
  ] as const;

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      {cards.map(({ key, icon: Icon, title, subtitle }) => (
        <article
          key={key}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
              <Icon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
              <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
