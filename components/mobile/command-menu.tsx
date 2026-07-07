"use client";

import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Home, Briefcase, FolderGit2, Contact, FileText, GitPullRequest } from "lucide-react";

const pages = [
  { id: "home", name: "Home", url: "/", icon: Home },
  { id: "experience", name: "Experience", url: "/experience", icon: Briefcase },
  { id: "projects", name: "Projects", url: "/projects", icon: FolderGit2 },
  { id: "contact", name: "Contact", url: "/contact", icon: Contact },
  { id: "resume", name: "Resume", url: "/resume", icon: FileText },
  { id: "pull-requests", name: "Pull Requests", url: "/pull-requests", icon: GitPullRequest },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (url: string) => {
      setOpen(false);
      router.push(url);
    },
    [router]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        aria-label="Open command menu"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
              <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-3">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <Command.Input
                  placeholder="Search pages..."
                  className="flex-1 h-11 bg-transparent text-[14px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none border-none"
                />
              </div>
              <Command.List className="max-h-64 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-[13px] text-zinc-400">
                  No results found.
                </Command.Empty>
                <Command.Group heading="Pages" className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 px-2 py-1.5">
                  {pages.map((page) => {
                    const Icon = page.icon;
                    return (
                      <Command.Item
                        key={page.id}
                        onSelect={() => runCommand(page.url)}
                        className="flex items-center gap-2 px-2 py-2 text-[13px] text-zinc-700 dark:text-zinc-300 rounded-md aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 cursor-pointer"
                      >
                        <Icon className="w-3.5 h-3.5 text-zinc-400" />
                        {page.name}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
