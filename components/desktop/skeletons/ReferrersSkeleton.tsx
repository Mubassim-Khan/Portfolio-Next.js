"use client";

export function ReferrersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between">
            <div
              className="h-6 w-36 rounded-lg"
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
        <div className="p-6">
          <div
            className="h-80 w-full rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.1s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
