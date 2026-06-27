"use client";

const blogs = [
  {
    title: "Building Draco: An AI coding agent from scratch",
    date: "May 2026",
    readTime: "8 min read",
  },
  {
    title: "How I got selected for GSoC 2026",
    date: "Apr 2026",
    readTime: "6 min read",
  },
  {
    title: "VengenceUI v2: Lessons from rebuilding a UI library",
    date: "Mar 2026",
    readTime: "10 min read",
  },
];

export function BlogList() {
  return (
    <div className="relative pt-4 pb-2">
      <div className="space-y-3">
        {blogs.map((blog, idx) => (
          <a
            key={idx}
            href="https://medium.com/@ashutoshx7"
            target="_blank"
            rel="noopener noreferrer"
            className="group block py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors"
          >
            <h3 className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              {blog.title}
            </h3>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              {blog.date} · {blog.readTime}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
