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
    <div className="h-full flex flex-col">
      <WeekdayHeader />
      
      <div className="flex-1 grid grid-cols-7 min-h-0 divide-x divide-y divide-border border-b border-border overflow-y-auto scrollbar-thin">
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
