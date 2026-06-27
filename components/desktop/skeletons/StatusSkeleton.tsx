"use client";

export function StatusSkeleton() {
  return (
    <div className="space-y-4 ml-5">
      <div className="flex flex-col pt-6 sm:flex-row justify-between gap-2 sm:items-center">
        <div
          className="h-7 w-44 rounded-lg"
          style={{
            background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div className="flex gap-2">
          <div
            className="h-9 w-[180px] rounded-xl"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.05s",
            }}
          />
          <div
            className="h-9 w-[140px] rounded-[10px]"
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
            className="h-6 w-20 rounded-lg"
            style={{
              background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              animationDelay: "0.15s",
            }}
          />
        </div>
        <div className="p-6 pt-4 divide-y divide-gray-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center py-3">
              <div className="space-y-2">
                <div
                  className="h-4 w-[150px] rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <div
                  className="h-3 w-[100px] rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1 + 0.05}s`,
                  }}
                />
                <div
                  className="h-3 w-[80px] rounded bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1 + 0.1}s`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-[70px] rounded-[5px] bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1 + 0.15}s`,
                  }}
                />
                <div
                  className="h-8 w-[90px] rounded-md bg-black/20"
                  style={{
                    background: "linear-gradient(90deg, rgba(20,20,22,1) 25%, rgba(28,28,31,1) 50%, rgba(20,20,22,1) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                    animationDelay: `${i * 0.1 + 0.2}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
