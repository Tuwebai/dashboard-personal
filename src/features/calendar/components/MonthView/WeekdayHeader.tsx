import { memo } from 'react';
import { useI18n } from '../../../../shared/i18n/useI18n';

export const WeekdayHeader = memo(() => {
  const { t } = useI18n();
  const weekdays = [
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
    t('calendar.sun')
  ];

  return (
    <div className="grid grid-cols-7 border-b border-border bg-white/2">
      {weekdays.map(day => (
        <div key={day} className="py-3 text-center">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            {day}
          </span>
        </div>
      ))}
    </div>
  );
});

WeekdayHeader.displayName = 'WeekdayHeader';
