import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, parseISO 
} from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const monthCache = new Map<string, { days: Date[], monthStart: Date }>();

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const cacheKey = start.toISOString();
  
  if (monthCache.has(cacheKey)) {
    return monthCache.get(cacheKey)!;
  }

  const end = endOfMonth(start);
  const sWeek = startOfWeek(start, { weekStartsOn: 1 });
  const eWeek = endOfWeek(end, { weekStartsOn: 1 });
  
  const result = {
    days: eachDayOfInterval({ start: sWeek, end: eWeek }),
    monthStart: start
  };

  monthCache.set(cacheKey, result);
  return result;
};

export const formatWithLocale = (date: Date, formatStr: string, lang: string) => {
  return format(date, formatStr, { locale: lang === 'es' ? es : enUS });
};

export const parseDateString = (dateStr: string) => parseISO(dateStr);

export const getDateKey = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};
