import { startOfWeek } from 'date-fns';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { FocusSession } from '../types';

interface FocusMetricsDetailCardProps {
  sessions: FocusSession[];
}

function getSessionTrackedMinutes(session: FocusSession) {
  return Math.floor(session.elapsedSeconds / 60);
}

export function FocusMetricsDetailCard({ sessions }: FocusMetricsDetailCardProps) {
  const { t } = useI18n();

  const today = new Date().toISOString().split('T')[0];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    .toISOString()
    .split('T')[0];

  const todaySessions = sessions.filter((session) => session.linkedDate === today);
  const weekSessions = sessions.filter((session) => session.linkedDate >= weekStart);

  const metrics = [
    {
      label: t('focus.metrics.todaySessions'),
      value: todaySessions.length,
    },
    {
      label: t('focus.metrics.todayMinutes'),
      value: todaySessions.reduce((total, session) => total + getSessionTrackedMinutes(session), 0),
    },
    {
      label: t('focus.metrics.todayInterruptions'),
      value: todaySessions.reduce((total, session) => total + session.interruptionCount, 0),
    },
    {
      label: t('focus.metrics.weekMinutes'),
      value: weekSessions.reduce((total, session) => total + getSessionTrackedMinutes(session), 0),
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div>
        <h2 className="text-sm font-semibold text-white">{t('focus.metrics.title')}</h2>
        <p className="mt-1 text-xs text-white/35">{t('focus.metrics.subtitle')}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-black/10 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              {metric.label}
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
