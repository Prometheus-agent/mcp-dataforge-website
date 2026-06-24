import Link from "next/link";

export default function BlogPost() {
  return (
    <div className="min-h-screen" style={{backgroundColor: "var(--bg)"}}>
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link href="/blog" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-8 inline-block">
          &larr; Back to blog
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500 mb-4">
              <time>June 18, 2026</time>
              <span>·</span>
              <span>8 min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
              Building mcp-dataforge: a multi-agent framework for data engineering
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              How six specialist agents, an orchestrator, and the MCP protocol come together to turn natural language into data pipeline actions.
            </p>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>Why another agent framework?</h2>
            <p>
              Data engineering has a tooling problem. Not a shortage of tools — the opposite. Airflow for orchestration, dbt for transformations, Great Expectations for quality, DataHub for cataloging, Prometheus for monitoring. Each solves one slice of the problem, and stitching them together is its own engineering project.
            </p>
            <p>
              What if you could describe what you needed in natural language and have a team of specialist agents handle the rest? Not one monolithic agent trying to do everything, but a coordinated group of experts — each with their own tools, each speaking the same protocol.
            </p>
            <p>
              That&apos;s the idea behind mcp-dataforge.
            </p>

            <h2>The architecture: agents as MCP servers</h2>
            <p>
              Every agent in mcp-dataforge is an MCP (Model Context Protocol) server. This is the key architectural decision. MCP gives us:
            </p>
            <ul>
              <li><strong>A standard protocol</strong> — no custom transport, no bespoke serialization</li>
              <li><strong>Language independence</strong> — agents can be written in any language that speaks MCP</li>
              <li><strong>Tool discovery</strong> — each agent advertises its capabilities and tools</li>
              <li><strong>Client compatibility</strong> — any MCP client (Claude Code, Cursor, VS Code) can connect directly</li>
            </ul>
            <p>
              The orchestrator is also an MCP server. It exposes three core tools: <code>route_task</code> for planning, <code>execute_task</code> for running, and <code>list_agents</code> for discovery. When you connect it to Claude Code, you get a data engineering assistant that can actually execute real tools — not just chat about them.
            </p>

            <h2>The six agents</h2>
            <p>
              Each agent covers a core data engineering domain:
            </p>
            <ul>
              <li><strong>Pipeline Agent</strong> — SQL generation, debugging, and optimization using sqlparse</li>
              <li><strong>Data Quality Agent</strong> — data profiling, anomaly detection (z-score), and quality rule validation using DuckDB</li>
              <li><strong>Schema Agent</strong> — drift detection, migration generation, schema linting, and column-level lineage</li>
              <li><strong>Catalog Agent</strong> — data discovery, documentation, impact analysis, and tagging</li>
              <li><strong>Observability Agent</strong> — pipeline health monitoring, alert summaries, cost analysis, and optimization suggestions</li>
              <li><strong>Orchestration Agent</strong> — DAG creation, dependency resolution, retry management, and backfill scheduling</li>
            </ul>

            <h2>Execution modes</h2>
            <p>
              One of the design goals was supporting different collaboration patterns:
            </p>
            <ul>
              <li><strong>Sequential</strong> — agents run one after another, each receiving the previous agent&apos;s context</li>
              <li><strong>Parallel</strong> — multiple agents run concurrently via thread pool, results merged</li>
              <li><strong>Mixed</strong> — multi-stage pipelines combining parallel and sequential phases</li>
              <li><strong>Autonomous</strong> — pre-built workflows like validation loops and compliance scans that chain agents automatically</li>
            </ul>
            <p>
              The parallel execution was particularly interesting to implement. Python&apos;s Gist makes true parallelism tricky, but for I/O-bound agent calls, <code>ThreadPoolExecutor</code> works well. Each agent call is wrapped with a timeout so a stuck agent doesn&apos;t hang the pipeline.
            </p>

            <h2>Error handling: circuit breakers and retries</h2>
            <p>
              Agents fail. Connections time out. Data sources go down. The orchestrator handles this with a circuit breaker pattern:
            </p>
            <ul>
              <li>After 3 consecutive failures, the circuit opens for that agent</li>
              <li>Cooldown scales from 30 seconds to 5 minutes based on failure count</li>
              <li>Transient errors trigger an automatic retry before opening the circuit</li>
              <li>In parallel execution, one agent failing doesn&apos;t block the others</li>
            </ul>

            <h2>Testing strategy</h2>
            <p>
              With six agents and multiple execution modes, testing was critical. The test suite covers:
            </p>
            <ul>
              <li><strong>Unit tests</strong> — each MCP tool in isolation</li>
              <li><strong>Integration tests</strong> — multi-agent routing, context passing, error recovery</li>
              <li><strong>E2E tests</strong> — complete workflows (profile → detect drift → validate → catalog)</li>
              <li><strong>Collaboration tests</strong> — autonomous validation loops and compliance scans</li>
            </ul>
            <p>
              DuckDB in-memory databases make the tests fast and self-contained. The full suite of 179 tests runs in under 3 seconds.
            </p>

            <h2>What&apos;s next</h2>
            <p>
              The framework is functional and published on PyPI (<code>pip install mcp-dataforge</code>), but there&apos;s plenty more to build:
            </p>
            <ul>
              <li><strong>LLM-based routing</strong> — replace keyword matching with actual intent parsing</li>
              <li><strong>Remote agent deployment</strong> — agents running as separate SSE services in Docker</li>
              <li><strong>The plugin ecosystem</strong> — make it trivial to build and share third-party agents</li>
            </ul>
            <p>
              The code is open source on GitHub. Contributions welcome.
            </p>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Link href="/blog" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            &larr; Back to blog
          </Link>
        </div>
      </main>
    </div>
  );
}
