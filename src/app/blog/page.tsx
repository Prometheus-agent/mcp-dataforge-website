import Link from "next/link";

const posts = [
  {
    slug: "building-mcp-dataforge",
    title: "Building mcp-dataforge: a multi-agent framework for data engineering",
    desc: "How six specialist agents, an orchestrator, and the MCP protocol come together to turn natural language into data pipeline actions.",
    date: "June 18, 2026",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: "var(--bg)"}}>
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
          Blog
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-16">
          Notes on building and running mcp-dataforge.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-2">
                <time>{post.date}</time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {post.desc}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
