"use client";

export function DeploymentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-48 rounded-lg"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
              <div
                className="h-4 w-4 rounded bg-black/20"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.05s",
                }}
              />
            </div>
            <div className="flex gap-2">
              <div
                className="h-9 w-[260px] rounded-xl"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.1s",
                }}
              />
              <div
                className="h-9 w-[160px] rounded-[10px]"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.15s",
                }}
              />
            </div>
          </div>
        </div>
        <div className="p-6 pt-4">
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-3 flex justify-between">
              {["Project", "Date", "Status"].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 w-${i === 0 ? "24" : i === 1 ? "20" : "16"} rounded bg-black/20`}
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border-b border-gray-800 last:border-b-0 px-4 py-3 flex justify-between items-center"
              >
                <div
                  className="h-4 w-32 rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
                <div
                  className="h-4 w-28 rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.08 + 0.04}s`,
                  }}
                />
                <div
                  className="h-6 w-20 rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.08 + 0.08}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
