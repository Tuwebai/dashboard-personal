import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  className?: string;
  minHeight?: number | string;
}

export function EmptyState({ icon: Icon, message, className, minHeight = 96 }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center text-white/30", className)}
      style={{ minHeight }}
    >
      <Icon size={24} className="mb-2" />
      <p className="text-xs">{message}</p>
    </div>
  );
}
