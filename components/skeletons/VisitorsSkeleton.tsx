"use client";

export function VisitorsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div
            className="h-6 w-36 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <div className="p-6">
          <div
            className="h-[500px] w-full rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.1s",
            }}
          />
        </div>
      </div>
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div
            className="h-6 w-32 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.15s",
            }}
          />
        </div>
        <div className="p-6 flex items-center justify-center h-32">
          <div
            className="h-5 w-72 rounded"
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
