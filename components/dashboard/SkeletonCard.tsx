"use client";

export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      {/* Title */}
      <div className="skeleton h-5 w-3/5 rounded-lg" />

      {/* Prompt preview lines */}
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-full rounded-md" />
        <div className="skeleton h-3.5 w-4/5 rounded-md" />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton h-3 w-20 rounded-md" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
