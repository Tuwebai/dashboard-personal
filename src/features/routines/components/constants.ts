import { Sun, Moon, Dumbbell, Briefcase, Coffee, Sparkles } from 'lucide-react';
import type { RoutineType } from '../../../shared/types';

export const ROUTINE_ICONS: Record<RoutineType, React.ElementType> = {
  morning: Sun,
  evening: Moon,
  workout: Dumbbell,
  work: Briefcase,
  weekend: Coffee,
  custom: Sparkles,
};

export const TYPE_COLORS: Record<RoutineType, string> = {
  morning: '#f59e0b',
  evening: '#818cf8',
  workout: '#22c55e',
  work: '#3b82f6',
  weekend: '#ec4899',
  custom: '#a78bfa',
};
