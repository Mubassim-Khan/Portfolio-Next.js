"use client";

export function TrafficSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-2">
            <div
              className="h-6 w-44 rounded-lg"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
            <div
              className="h-9 w-[220px] rounded-xl"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: "0.05s",
              }}
            />
          </div>
        </div>
        <div className="p-6 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 w-full rounded-lg border border-gray-700 overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
          <div
            className="h-64 w-full rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.2s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
