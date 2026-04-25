import { memo, useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { useCalendarView } from '../../hooks/useCalendarView';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { getMonthDays, getDateKey } from '../../utils/dateUtils';
import { WeekdayHeader } from './WeekdayHeader.tsx';
import { DayCell } from './DayCell.tsx';
import type { CalendarEvent } from '../../../../shared/types';

interface MonthViewProps {
  onEventClick: (ev: CalendarEvent) => void;
}

export const MonthView = memo(({ onEventClick }: MonthViewProps) => {
  const { currentDate, setCalendarDate } = useCalendarView();
  const { eventsByDate } = useCalendarEvents();
  
  const { days, monthStart } = useMemo(() => getMonthDays(currentDate), [currentDate]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <WeekdayHeader />
      
      <div className="grid min-h-0 flex-1 grid-cols-7 divide-x divide-y divide-border overflow-y-auto border-b border-border scrollbar-thin">
        {days.map((day, i) => {
          const dateKey = getDateKey(day);
          const dayEvents = eventsByDate[dateKey] || [];
          const isSelected = isSameDay(day, currentDate);
          
          return (
            <DayCell 
              key={day.toISOString()}
              day={day}
              monthStart={monthStart}
              events={dayEvents}
              isSelected={isSelected}
              onSelect={setCalendarDate}
              onEventClick={onEventClick}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
});

MonthView.displayName = 'MonthView';
