import { memo } from 'react';
import { isToday, isSameMonth } from 'date-fns';
import { cn } from '../../../../shared/lib/cn';
import type { CalendarEvent } from '../../../../shared/types';

interface DayCellProps {
  day: Date;
  monthStart: Date;
  events: CalendarEvent[];
  isSelected: boolean;
  onSelect: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  index: number;
}

export const DayCell = memo(({ 
  day, monthStart, events, isSelected, onSelect, onEventClick, index 
}: DayCellProps) => {
  const dateKey = day.toISOString().split('T')[0];
  const dayOfMonth = day.getDate();
  const isCurrentMonth = isSameMonth(day, monthStart);
  const isDayToday = isToday(day);

  return (
    <div 
      onClick={() => onSelect(dateKey)}
      className={cn(
        "relative flex min-h-[60px] cursor-pointer flex-col gap-1 p-1.5 transition-colors md:min-h-[100px] md:gap-1.5 md:p-2",
        !isCurrentMonth ? "bg-black/10 opacity-20" : "bg-transparent hover:bg-white/2",
        isSelected && isCurrentMonth && "bg-violet-500/5 ring-1 ring-inset ring-violet-500/20",
        index < 7 && "border-t-0"
      )}
    >
      <div className="flex justify-end">
        <span className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-transform md:h-7 md:w-7 md:text-xs",
          isDayToday ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" : 
          isSelected && isCurrentMonth ? "text-violet-400" : "text-text-muted"
        )}>
          {dayOfMonth}
        </span>
      </div>
      
      <div className="flex-1 space-y-1 overflow-hidden">
        {events.slice(0, 1).map((event) => (
          <div 
            key={event.id}
            onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
            className="truncate rounded-md border px-1.5 py-0.5 text-[8px] font-bold leading-tight transition-all hover:brightness-110 active:scale-95 md:px-2 md:text-[9px]"
            style={{ 
              backgroundColor: `${event.color}10`, 
              borderColor: `${event.color}20`,
              color: event.color 
            }}
          >
            {event.title}
          </div>
        ))}
        {events.length > 1 && (
          <div className="px-1 text-[8px] font-bold text-text-muted opacity-60">
            +{events.length - 1}
          </div>
        )}
      </div>
    </div>
  );
});

DayCell.displayName = 'DayCell';
