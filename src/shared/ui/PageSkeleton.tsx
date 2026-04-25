import { SkeletonCard, SkeletonChart, SkeletonList } from './SkeletonLoader';

export function PageSkeleton() {
  return (
    <div className="h-full min-h-[calc(100vh-160px)] space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SkeletonChart />
        <SkeletonList lines={5} />
      </div>
      <SkeletonChart />
    </div>
  );
}
