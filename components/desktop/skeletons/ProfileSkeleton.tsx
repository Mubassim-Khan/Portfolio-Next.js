"use client";

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          <div
            className="h-7 w-24 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: "0.05s",
              }}
            />
            <div className="flex flex-col gap-2 flex-1">
              <div
                className="h-4 w-40 rounded"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.1s",
                }}
              />
              <div
                className="h-9 w-full rounded-md"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.15s",
                }}
              />
              <div
                className="h-9 w-24 rounded-md"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.2s",
                }}
              />
            </div>
          </div>
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-9 w-full rounded-md"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${0.2 + i * 0.06}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
