import { cn } from '../../../shared/lib/cn';

interface GoalProgressBarProps {
  value: number;
  className?: string;
}

export function GoalProgressBar({ value, className }: GoalProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2 w-full rounded-full bg-white/8 overflow-hidden', className)}>
      <div
        className="h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-500 transition-all duration-300"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
