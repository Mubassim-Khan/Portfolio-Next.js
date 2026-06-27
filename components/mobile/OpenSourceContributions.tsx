"use client";

const repos = [
  { name: "sugarlabs/musicblocks", prs: 82, description: "Performance, testing, CI, audio improvements" },
  { name: "laurent22/joplin", prs: 18, description: "E2EE, plugins, shortcuts, rendering" },
  { name: "sugarlabs/musicblocks-v4", prs: 12, description: "Feature development and bug fixes" },
  { name: "sugarlabs/www-v2", prs: 8, description: "Website improvements and maintenance" },
  { name: "kmesh-net/kmesh", prs: 3, description: "macOS dev guide and documentation" },
  { name: "kgateway-dev/kgateway", prs: 3, description: "Migration docs and HTTPS security" },
];

export function OpenSourceContributions({ isFullPage }: { isFullPage?: boolean }) {
  const displayRepos = isFullPage ? repos : repos.slice(0, 4);

  return (
    <div className="flex flex-col relative z-10">
      <div className="py-2 relative mt-1">
        <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Open Source
        </h2>
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
          style={{
            maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          }}
        />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      <div className="relative pt-4 pb-2 space-y-3">
        {displayRepos.map((repo, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {repo.name}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 ml-5">
                {repo.description}
              </p>
            </div>
            <span className="shrink-0 text-[12px] font-semibold text-zinc-600 dark:text-zinc-400 ml-3 tabular-nums">
              {repo.prs} PRs
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
