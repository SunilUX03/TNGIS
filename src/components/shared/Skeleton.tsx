export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-compact)] bg-[var(--color-divider)] ${className}`} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  );
}
