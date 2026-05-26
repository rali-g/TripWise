interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className = '', width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
      style={{ width, height: height ?? 20 }}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
        <Skeleton width={80} height={28} />
      </div>
      <Skeleton height={8} />
      <div className="flex gap-4">
        <Skeleton width={60} height={20} />
        <Skeleton width={80} height={20} />
        <Skeleton width={70} height={20} />
      </div>
    </div>
  );
}
