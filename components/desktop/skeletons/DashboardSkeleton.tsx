"use client";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black rounded-[15px] flex flex-col items-center justify-center p-6 gap-6">
      {/* Title skeleton - matching GradientText size */}
      <div
        className="h-12 w-72 rounded-lg"
        style={{
          background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />

      {/* 3 stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-800 overflow-hidden"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {/* CardHeader */}
            <div className="p-4 pb-0">
              <div className="h-5 w-36 bg-black/30 rounded" />
            </div>
            {/* CardContent */}
            <div className="p-4 pt-3">
              <div className="h-8 w-24 bg-black/30 rounded mb-1" />
              <div className="h-4 w-28 bg-black/30 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart card skeleton */}
      <div className="max-w-4xl w-full">
        <div
          className="rounded-xl border border-gray-800 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        >
          {/* CardHeader */}
          <div className="p-6 pb-0">
            <div className="h-6 w-40 bg-black/30 rounded" />
          </div>
          {/* CardContent - chart area */}
          <div className="p-6">
            <div className="h-[300px] w-full rounded-lg bg-black/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
