"use client";

export function ManageProjectsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div
              className="h-7 w-44 rounded-lg"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
              }}
            />
            <div
              className="h-9 w-64 rounded-xl"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: "0.05s",
              }}
            />
            <div
              className="h-9 w-[120px] rounded-[10px]"
              style={{
                background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s ease-in-out infinite",
                animationDelay: "0.1s",
              }}
            />
          </div>
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-3 flex justify-between">
              <div
                className="h-4 w-16 rounded bg-black/20"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
              <div
                className="h-4 w-16 rounded bg-black/20"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: "0.05s",
                }}
              />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-b border-gray-800 px-4 py-3 flex justify-between items-center"
              >
                <div className="flex flex-col gap-1.5">
                  <div
                    className="h-4 w-40 rounded bg-black/20"
                    style={{
                      background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                  <div
                    className="h-3 w-56 rounded bg-black/20"
                    style={{
                      background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.08 + 0.04}s`,
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <div
                    className="h-8 w-16 rounded-[5px] bg-black/20"
                    style={{
                      background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.08 + 0.08}s`,
                    }}
                  />
                  <div
                    className="h-8 w-16 rounded-[5px] bg-black/20"
                    style={{
                      background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.08 + 0.12}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
