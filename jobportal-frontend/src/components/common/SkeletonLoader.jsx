export default function SkeletonLoader({ className = "", count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-xl bg-slate-200/70 h-4 ${className}`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 animate-pulse">
      {/* Table Header skeleton */}
      <div className="flex gap-4 pb-4 border-b border-slate-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200/80 rounded flex-1" />
        ))}
      </div>

      {/* Table Rows skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-4 bg-slate-100 rounded ${
                  c === 0 ? "w-1/3" : "flex-1"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2 flex-1">
            <div className="h-3.5 bg-slate-200/70 rounded w-2/5" />
            <div className="h-7 bg-slate-200 rounded w-1/3" />
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-4"
        >
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-3.5 bg-slate-100 rounded w-full" />
          <div className="h-3.5 bg-slate-100 rounded w-4/5" />
          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
