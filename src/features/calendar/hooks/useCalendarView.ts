import { useState, useCallback, useMemo } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { useAppStore } from '../../../stores/useAppStore';
import { parseDateString } from '../utils/dateUtils';

export type CalendarViewType = 'month' | 'agenda';

export function useCalendarView() {
  const calendarDate = useAppStore(s => s.calendarDate);
  const setCalendarDate = useAppStore(s => s.setCalendarDate);
  const [viewType, setViewType] = useState<CalendarViewType>('month');

  const currentDate = useMemo(() => parseDateString(calendarDate), [calendarDate]);

  const handlePrevMonth = useCallback(() => {
    setCalendarDate(format(subMonths(currentDate, 1), 'yyyy-MM-dd'));
  }, [currentDate, setCalendarDate]);

  const handleNextMonth = useCallback(() => {
    setCalendarDate(format(addMonths(currentDate, 1), 'yyyy-MM-dd'));
  }, [currentDate, setCalendarDate]);

  const handleToday = useCallback(() => {
    setCalendarDate(format(new Date(), 'yyyy-MM-dd'));
  }, [setCalendarDate]);

  return {
    calendarDate,
    currentDate,
    viewType,
    setViewType,
    setCalendarDate,
    handlePrevMonth,
    handleNextMonth,
    handleToday
  };
}
