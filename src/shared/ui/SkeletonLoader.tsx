import { cn } from '../lib/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton rounded-lg', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonList({ lines = 4 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <Skeleton className="h-4 w-1/4 mb-4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
