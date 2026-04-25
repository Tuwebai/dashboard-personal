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
        "min-h-[100px] md:min-h-[120px] p-2 transition-colors flex flex-col gap-1.5 cursor-pointer relative",
        !isCurrentMonth ? "bg-black/10 opacity-20" : "bg-transparent hover:bg-white/2",
        isSelected && isCurrentMonth && "bg-violet-500/5 ring-1 ring-inset ring-violet-500/20",
        index < 7 && "border-t-0"
      )}
    >
      <div className="flex justify-end">
        <span className={cn(
          "w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full transition-transform",
          isDayToday ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" : 
          isSelected && isCurrentMonth ? "text-violet-400" : "text-text-muted"
        )}>
          {dayOfMonth}
        </span>
      </div>
      
      <div className="flex-1 space-y-1 overflow-hidden">
        {events.slice(0, 2).map((event) => (
          <div 
            key={event.id}
            onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
            className="px-2 py-0.5 rounded-md text-[9px] font-bold border truncate transition-all hover:brightness-110 active:scale-95"
            style={{ 
              backgroundColor: `${event.color}10`, 
              borderColor: `${event.color}20`,
              color: event.color 
            }}
          >
            {event.title}
          </div>
        ))}
        {events.length > 2 && (
          <div className="text-[8px] text-text-muted font-bold px-1 opacity-60">
            + {events.length - 2}
          </div>
        )}
      </div>
    </div>
  );
});

DayCell.displayName = 'DayCell';
