"use client";

export function CodingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col pt-6 sm:flex-row justify-between gap-2 sm:items-center">
        <div
          className="h-7 w-44 rounded-lg"
          style={{
            background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div className="flex items-center gap-4">
          <div
            className="h-9 w-[200px] rounded-xl"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.05s",
            }}
          />
          <div
            className="h-9 w-[100px] rounded-[10px]"
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
            className="h-6 w-28 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.1s",
            }}
          />
        </div>
        <div className="p-6 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 w-full rounded-xl"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${0.1 + i * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div
            className="h-6 w-28 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.15s",
            }}
          />
        </div>
        <div className="p-6 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full rounded-xl"
                style={{
                  background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                  animationDelay: `${0.15 + i * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 pb-0">
          <div
            className="h-6 w-44 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.2s",
            }}
          />
        </div>
        <div className="p-6 flex justify-center">
          <div
            className="h-[300px] w-full max-w-3xl rounded-xl"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.25s",
            }}
          />
        </div>
      </div>
    </div>
  );
}
