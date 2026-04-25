import { cn } from '../lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'glow';
  color?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', color, className, size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  if (color) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          sizeClasses,
          className
        )}
        style={{
          backgroundColor: `${color}25`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizeClasses,
        variant === 'default' && 'bg-white/10 text-white/70',
        variant === 'outline' && 'border border-white/20 text-white/60',
        variant === 'glow' && 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
        className
      )}
    >
      {children}
    </span>
  );
}
