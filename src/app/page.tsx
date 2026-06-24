import Link from "next/link";

const agents = [
  { name: "Pipeline", desc: "SQL generation & debugging", scope: "sql", detail: "Generates, debugs, and optimizes SQL pipelines from natural language descriptions. Supports Spark, dbt, and multiple warehouses." },
  { name: "Data Quality", desc: "Profiling & validation", scope: "quality", detail: "Profiles tables, detects anomalies, and validates data quality rules. Runs on DuckDB for fast local analysis." },
  { name: "Schema", desc: "Drift detection & migration", scope: "schema", detail: "Compares schemas across environments, generates migration scripts, lints naming conventions, and traces column lineage." },
  { name: "Orchestration", desc: "DAG management & scheduling", scope: "dag", detail: "Creates and manages Airflow-compatible DAGs, resolves dependencies, handles retries, and plans backfills." },
  { name: "Catalog", desc: "Discovery & documentation", scope: "catalog", detail: "Searches tables and columns, auto-generates documentation, analyzes change impact, and manages data asset tags." },
  { name: "Observability", desc: "Monitoring & cost analysis", scope: "observe", detail: "Tracks pipeline health and success rates, summarizes alerts, analyzes warehouse costs, and suggests optimizations." },
] as const;

const commands = [
  { cmd: "dataforge init", output: "Created config.yaml" },
  { cmd: "dataforge run \"profile customers, check nulls\"", output: "dq: 4 rows, 2 columns profiled" },
  { cmd: "dataforge run \"detect schema drift between staging and prod\"", output: "Drift: +2 added, ~1 modified" },
  { cmd: "dataforge chat", output: "Interactive mode — agents, pipelines, status, help" },
];

const TerminalBlock = () => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-2xl shadow-indigo-500/5">
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800">
      <span className="w-3 h-3 rounded-full bg-red-500/80" />
      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
      <span className="ml-3 text-xs text-slate-500 font-mono">dataforge — v0.1.0</span>
    </div>
    <div className="px-5 py-4 font-mono text-sm leading-relaxed space-y-1">
      {commands.map((item, i) => (
        <div key={i}>
          <div>
            <span className="text-slate-500">$ </span>
            <span className="text-slate-100">{item.cmd}</span>
          </div>
          <div className="text-indigo-300 pl-4 pb-2">{item.output}</div>
        </div>
      ))}
      <div className="animate-pulse mt-2">
        <span className="text-slate-500">$ </span>
        <span className="text-slate-500">_</span>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: "var(--bg)"}}>
      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-24 sm:pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">MCP-native</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900 dark:text-white mb-5">
                Data engineering,<br />
                <span className="text-indigo-600 dark:text-indigo-400">in your own words.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-md">
                Turn natural language into data pipeline actions. Six specialist agents collaborate through MCP to build, validate, and monitor your data infrastructure.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <code className="inline-flex items-center px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-indigo-200 font-mono text-sm font-medium shadow-sm border border-slate-700">
                  pip install mcp-dataforge
                </code>
                <Link href="/docs" className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-sm text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                  Read docs &rarr;
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <TerminalBlock />
            </div>
          </div>
          {/* Mobile terminal */}
          <div className="mt-8 lg:hidden">
            <TerminalBlock />
          </div>
        </section>

        {/* How It Works */}
        <section className="pb-20">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-8 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Describe your task", desc: 'Describe what you need in natural language — "profile the customers table."' },
              { step: "2", title: "Agents collaborate", desc: "The orchestrator routes your task to the right specialist agents and runs them." },
              { step: "3", title: "Get results", desc: "Profiles, schema diffs, and quality reports returned as structured data." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Agent Grid */}
        <section className="pb-20">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-6">
            Six specialist agents
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((a) => {
              const key = a.name === "Data Quality" ? "dq" : a.name.toLowerCase();
              const borders: Record<string, string> = {
                pipeline: "hover:border-blue-400 hover:shadow-blue-500/10",
                dq: "hover:border-emerald-400 hover:shadow-emerald-500/10",
                schema: "hover:border-violet-400 hover:shadow-violet-500/10",
                orchestration: "hover:border-cyan-400 hover:shadow-cyan-500/10",
                catalog: "hover:border-amber-400 hover:shadow-amber-500/10",
                observability: "hover:border-rose-400 hover:shadow-rose-500/10",
              };
              const tags: Record<string, string> = {
                pipeline: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
                dq: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
                schema: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
                orchestration: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
                catalog: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
                observability: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
              };
              const accentBars: Record<string, string> = {
                pipeline: "bg-blue-500", dq: "bg-emerald-500", schema: "bg-violet-500",
                orchestration: "bg-cyan-500", catalog: "bg-amber-500", observability: "bg-rose-500",
              };
              return (
                <div key={a.name} className={`group relative p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 ${borders[key] || ""} hover:shadow-lg cursor-default`}>
                  <div className={`w-8 h-1 rounded-full mb-3 ${accentBars[key] || "bg-slate-300"}`} />
                  <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{a.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{a.desc}</div>
                  <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${tags[key] || "bg-slate-100 text-slate-600"}`}>
                    {a.scope}
                  </span>
                  <div className="absolute z-10 left-0 top-full mt-2 w-72 p-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-sm text-slate-300 shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {a.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="pb-20">
          <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 p-8 sm:p-12">
            <div className="grid sm:grid-cols-4 gap-8 text-center">
              {[
                { label: "MCP", sub: "Native protocol" },
                { label: "6", sub: "Specialist agents" },
                { label: "25+", sub: "Agent tools" },
                { label: "Zero", sub: "API keys needed" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-bold text-white">{s.label}</div>
                  <div className="text-sm text-slate-400 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ready to try it?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Install in one line. No API keys. No setup.
          </p>
          <code className="inline-flex items-center px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-indigo-200 font-mono text-sm font-medium shadow-sm border border-slate-700">
            pip install mcp-dataforge
          </code>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
          <span className="font-medium text-slate-500">⚒️ mcp-dataforge</span>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Dashboard</Link>
            <a href="https://github.com/Prometheus-agent/mcp-dataforge" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">GitHub</a>
            <span>Apache 2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
