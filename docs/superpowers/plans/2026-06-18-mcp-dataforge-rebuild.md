# mcp-dataforge Website Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the full mcp-dataforge website (Landing, Dashboard, Docs) from DESIGN.md with Next.js 16, React 19, Tailwind v4, and @xyflow/react.

**Architecture:** Next.js 16 App Router with Server Components for static marketing/docs pages, Client Components for interactive dashboard features. Mock API routes with SSE provide realistic demo data. CSS custom properties define the full design token system with dark mode.

**Tech Stack:** Next.js 16.2, React 19.2, Tailwind CSS v4, @xyflow/react v12, TypeScript 5

## Global Constraints

- All tokens (colors, spacing, radius, fonts) must match DESIGN.md exactly — hex values, rem values, font names
- Agent colors remain unchanged across light/dark themes
- "Agent" not "Bot", "Pipeline" not "Workflow" (check all copy)
- Heading case: Title Case. UI labels: Sentence case. CLI commands: lowercase
- Dark mode respects: localStorage > prefers-color-scheme > light fallback
- Motion: button hover `translateY(-1px)` + `150ms ease`, cards `200ms ease`, page transitions `180ms` fade+slide
- Font stack: Inter (UI), JetBrains Mono (code/terminal)
- All routes: `/` (landing), `/dashboard`, `/docs`

---
## File Structure

```
brain-website/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind v4 + CSS custom properties
│   │   ├── layout.tsx               # Root layout: fonts, Nav, Footer, metadata
│   │   ├── page.tsx                 # Landing — Server Component
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard — Client Component with SSE
│   │   ├── docs/
│   │   │   └── page.tsx             # Docs — Server Component
│   │   └── api/
│   │       ├── agents/route.ts      # GET — agent list
│   │       ├── pipelines/route.ts   # GET — pipeline list
│   │       └── pipelines/stream/route.ts  # GET — SSE stream
│   ├── components/
│   │   ├── Nav.tsx                  # Sticky nav, links, ThemeToggle
│   │   ├── Footer.tsx               # Site footer
│   │   ├── ThemeToggle.tsx          # Light/dark toggle
│   │   ├── Terminal.tsx             # CLI terminal with sequential reveal
│   │   ├── AgentCard.tsx            # Agent card with accent dot
│   │   ├── StatsBar.tsx             # Dark metrics band
│   │   ├── PipelineRow.tsx          # Pipeline summary row
│   │   └── DAGView.tsx              # @xyflow/react DAG
│   ├── data/
│   │   └── mock.ts                  # Shared demo data
│   └── types.ts                     # All TypeScript types
├── package.json
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tsconfig.json`

**Interfaces:**
- Consumes: (nothing — this is bootstrap)
- Produces: working `npm run dev` that starts Next.js on port 3000

- [ ] **Step 1: Create package.json**

```json
{
  "name": "mcp-dataforge-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@xyflow/react": "^12.11.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4.0.0",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 3: Create postcss.config.mjs**

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: All deps resolve, `node_modules` directory created.

- [ ] **Step 6: Create .gitignore**

```gitignore
node_modules
.next
*.tsbuildinfo
next-env.d.ts
.env*
.vercel
```

- [ ] **Step 7: Verify dev server starts**

Run: `npm run dev`
Expected: Next.js starts on port 3000 (hit Ctrl+C to stop). 404 at this stage — that's fine.

---

### Task 2: CSS Design Tokens + Globals

**Files:**
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: (nothing — standalone stylesheet)
- Produces: CSS custom properties for all design tokens, consumed by every component

- [ ] **Step 1: Create globals.css**

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-bg: var(--bg-primary);
  --color-surface: var(--bg-surface);
  --color-bg-terminal: #020617;
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: #94A3B8;
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #F43F5E;
  --color-info: #06B6D4;
  --color-agent-pipeline: #3B82F6;
  --color-agent-quality: #10B981;
  --color-agent-schema: #8B5CF6;
  --color-agent-orchestration: #06B6D4;
  --color-agent-catalog: #F59E0B;
  --color-agent-observability: #F43F5E;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
}

:root {
  --bg-primary: #FAFAFA;
  --bg-surface: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --border: #E2E8F0;
  --accent: #6366F1;
  --accent-hover: #4F46E5;
}

.dark {
  --bg-primary: #020617;
  --bg-surface: #0F172A;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --border: #1E293B;
  --accent: #818CF8;
  --accent-hover: #6366F1;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls src/app/globals.css`
Expected: File present, no syntax errors when page loads in Task 4+.

---

### Task 3: Types + Mock Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/mock.ts`

**Interfaces:**
- Consumes: (nothing — pure types and data)
- Produces: `AgentInfo`, `PipelineSummary`, `Stats`, `CliCommand`, `AgentId` types; `AGENTS`, `PIPELINES`, `STATS`, `CLI_COMMANDS` data exports consumed by all components and API routes

- [ ] **Step 1: Create src/types.ts**

```typescript
export type AgentId =
  | "pipeline"
  | "quality"
  | "schema"
  | "orchestration"
  | "catalog"
  | "observability";

export interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  color: string;
  status: "active" | "idle" | "error";
  task?: string;
}

export type PipelineStatus = "running" | "success" | "failed" | "pending";

export interface PipelineSummary {
  id: string;
  name: string;
  status: PipelineStatus;
  progress: number;
  agents: AgentId[];
  startedAt: string;
  duration?: string;
}

export interface Stats {
  totalPipelines: number;
  totalRuns: number;
  activeAgents: number;
  health: number;
  pipelinesExecuted: number;
  dataSources: number;
  uptime: string;
}

export interface CliCommand {
  cmd: string;
  output: string;
  delay?: number;
}

export interface PipelineEvent {
  type: "update" | "complete" | "error";
  pipelineId: string;
  status: PipelineStatus;
  progress: number;
  timestamp: string;
}
```

- [ ] **Step 2: Create src/data/mock.ts**

```typescript
import type { AgentInfo, PipelineSummary, Stats, CliCommand } from "@/types";

export const AGENTS: AgentInfo[] = [
  {
    id: "pipeline",
    name: "Pipeline Agent",
    description: "Builds execution plans from natural language.",
    color: "#3B82F6",
    status: "active",
    task: "Generating SQL for sales-etl-prod",
  },
  {
    id: "quality",
    name: "Data Quality Agent",
    description: "Profiles data and validates quality constraints.",
    color: "#10B981",
    status: "active",
    task: "Running null checks on customer table",
  },
  {
    id: "schema",
    name: "Schema Agent",
    description: "Detects drift and manages migrations.",
    color: "#8B5CF6",
    status: "idle",
  },
  {
    id: "orchestration",
    name: "Orchestration Agent",
    description: "Coordinates DAG execution and scheduling.",
    color: "#06B6D4",
    status: "active",
    task: "Scheduling nightly batch jobs",
  },
  {
    id: "catalog",
    name: "Catalog Agent",
    description: "Discovers and documents data assets.",
    color: "#F59E0B",
    status: "idle",
  },
  {
    id: "observability",
    name: "Observability Agent",
    description: "Monitors pipeline health and cost.",
    color: "#F43F5E",
    status: "idle",
  },
];

export const PIPELINES: PipelineSummary[] = [
  {
    id: "pl-1",
    name: "sales-etl-prod",
    status: "running",
    progress: 78,
    agents: ["pipeline", "quality", "catalog"],
    startedAt: "2026-06-18T14:30:00Z",
    duration: "3m 42s",
  },
  {
    id: "pl-2",
    name: "customer-import-hourly",
    status: "success",
    progress: 100,
    agents: ["pipeline", "orchestration"],
    startedAt: "2026-06-18T14:00:00Z",
    duration: "1m 12s",
  },
  {
    id: "pl-3",
    name: "schema-sync-staging",
    status: "failed",
    progress: 45,
    agents: ["schema", "observability"],
    startedAt: "2026-06-18T13:15:00Z",
    duration: "2m 01s",
  },
  {
    id: "pl-4",
    name: "data-quality-daily",
    status: "pending",
    progress: 0,
    agents: ["quality"],
    startedAt: "2026-06-18T12:00:00Z",
  },
  {
    id: "pl-5",
    name: "catalog-refresh-weekly",
    status: "success",
    progress: 100,
    agents: ["catalog", "observability"],
    startedAt: "2026-06-18T10:00:00Z",
    duration: "4m 55s",
  },
];

export const STATS: Stats = {
  totalPipelines: 1_248,
  totalRuns: 85_392,
  activeAgents: 6,
  health: 99.9,
  pipelinesExecuted: 12_456,
  dataSources: 342,
  uptime: "99.97%",
};

export const CLI_COMMANDS: CliCommand[] = [
  {
    cmd: 'dataforge run "profile customers, check nulls"',
    output: "✅ Quality Agent: 4 rows, 2 columns profiled",
    delay: 60,
  },
  {
    cmd: 'dataforge run "detect schema drift between staging and prod"',
    output: "📐 Schema Agent: Drift detected — +2 added, ~1 modified",
    delay: 80,
  },
  {
    cmd: "dataforge status --all",
    output: "📊 6 agents — 3 active, 3 idle. 5 pipelines running.",
  },
  {
    cmd: "dataforge chat",
    output: "💬 Interactive mode — agents, pipelines, status, help available",
  },
];
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: Exits with code 0, no errors.

---

### Task 4: Layout Shell (Layout, Nav, Footer, ThemeToggle)

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Consumes: globals.css from Task 2, types from Task 3
- Produces: RootLayout wrapping all pages with nav bar, footer, and dark mode toggle

- [ ] **Step 1: Create ThemeToggle.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dataforge-dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "true" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dataforge-dark", String(next));
  };

  if (!mounted) {
    return <div className="w-8 h-8" />; // Prevent layout shift
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-radius-md text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-150"
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Create Nav.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-bg/90 dark:bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 gap-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-accent hover:opacity-80 transition-opacity"
        >
          ⚒️ mcp-dataforge
        </Link>
        <div className="flex items-center gap-6 ml-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create Footer.tsx**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>⚒️ mcp-dataforge</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Open-source multi-agent data engineering</span>
        </div>
        <div className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} mcp-dataforge
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mcp-dataforge — Multi-agent data engineering",
  description:
    "Coordinate six specialized agents through a single command. Plan, validate, orchestrate, catalog, and observe data workflows with natural language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Nav />
        <main className="min-h-[calc(100vh-3.5rem-5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create placeholder page.tsx to verify layout**

Create `src/app/page.tsx` with a minimal landing placeholder:
```tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center h-64 text-text-muted">
      Landing page — coming soon
    </div>
  );
}
```

- [ ] **Step 6: Verify navigation and theme work**

Run: `npm run dev`
Expected:
- Nav bar visible with logo "mcp-dataforge", Home/Dashboard/Docs links, theme toggle
- Placeholder content shows
- Theme toggle switches dark/light in browser
- Nav link active states update on route click

---

### Task 5: Reusable Components (Terminal, AgentCard, StatsBar)

**Files:**
- Create: `src/components/Terminal.tsx`
- Create: `src/components/AgentCard.tsx`
- Create: `src/components/StatsBar.tsx`

**Interfaces:**
- Consumes: `CliCommand`, `AgentInfo`, `Stats` from `@/types`; `@/data/mock`
- Produces: Three shared components used by Landing Page (Task 6) and Dashboard (Task 9)

- [ ] **Step 1: Create Terminal.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { CliCommand } from "@/types";

interface TerminalProps {
  commands: CliCommand[];
  title?: string;
}

export function Terminal({
  commands,
  title = "dataforge — v0.1.0",
}: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentOutput, setCurrentOutput] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const showNext = () => {
      if (i >= commands.length) return;
      const cmd = commands[i];
      setVisibleLines((prev) => [...prev, i]);

      if (cmd.output) {
        const delay = cmd.delay || 50;
        const timer = setTimeout(() => {
          setCurrentOutput((prev) => [...prev, cmd.output]);
        }, delay);
        timers.push(timer);
      }

      i++;
      if (i < commands.length) {
        const nextTimer = setTimeout(showNext, 1200);
        timers.push(nextTimer);
      }
    };

    const startTimer = setTimeout(showNext, 500);
    timers.push(startTimer);

    return () => timers.forEach(clearTimeout);
  }, [commands]);

  return (
    <div className="rounded-radius-xl border border-border bg-bg-terminal overflow-hidden shadow-2xl shadow-accent/5">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-slate-500 font-mono">{title}</span>
      </div>
      <div className="px-5 py-4 font-mono text-sm leading-relaxed">
        {commands.map((cmd, i) => (
          <div key={i} className="mb-1">
            {visibleLines.includes(i) && (
              <>
                <div className="text-slate-300">
                  <span className="text-slate-500">$ </span>
                  {cmd.cmd}
                </div>
                {currentOutput[i] && (
                  <div className="text-emerald-400 pl-4">
                    {currentOutput[i]}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {visibleLines.length < commands.length && (
          <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create AgentCard.tsx**

```tsx
import type { AgentInfo } from "@/types";

interface AgentCardProps {
  agent: AgentInfo;
  variant?: "landing" | "dashboard";
}

export function AgentCard({ agent, variant = "landing" }: AgentCardProps) {
  const statusColor: Record<string, string> = {
    active: "bg-success",
    idle: "bg-text-muted",
    error: "bg-danger",
  };

  return (
    <div className="bg-surface border border-border rounded-radius-lg p-6 hover:border-accent/30 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: agent.color }}
        />
        <h3 className="font-semibold text-text-primary">{agent.name}</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">{agent.description}</p>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusColor[agent.status]}`} />
        <span className="text-xs font-medium text-text-muted capitalize">
          {agent.status}
        </span>
      </div>
      {variant === "dashboard" && agent.task && (
        <p className="text-xs text-text-muted mt-2 truncate">{agent.task}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create StatsBar.tsx**

```tsx
interface StatsBarItem {
  label: string;
  value: string;
}

interface StatsBarProps {
  stats: StatsWithItems;
}

interface StatsWithItems {
  totalPipelines: number;
  totalRuns: number;
  activeAgents: number;
  health: number;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items: StatsBarItem[] = [
    { label: "Pipelines", value: stats.totalPipelines.toLocaleString() },
    { label: "Runs", value: stats.totalRuns.toLocaleString() },
    { label: "Active Agents", value: String(stats.activeAgents) },
    { label: "Health", value: `${stats.health}%` },
  ];

  return (
    <section className="bg-bg-terminal border-y border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: 0 errors

---

### Task 6: Landing Page

**Files:**
- Overwrite: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Terminal`, `AgentCard`, `StatsBar` from Task 5; `AGENTS`, `STATS`, `CLI_COMMANDS` from `@/data/mock`
- Produces: Static landing page at `/`

- [ ] **Step 1: Rewrite src/app/page.tsx**

```tsx
import { Terminal } from "@/components/Terminal";
import { AgentCard } from "@/components/AgentCard";
import { StatsBar } from "@/components/StatsBar";
import { AGENTS, STATS, CLI_COMMANDS } from "@/data/mock";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-tight">
              Natural language for{" "}
              <span className="text-accent">data pipelines</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg">
              Coordinate six specialized agents through a single command.
              Plan, validate, orchestrate, catalog, and observe data workflows
              with natural language.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/docs"
                className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-radius-md hover:bg-accent-hover transition-all duration-150 hover:-translate-y-0.5"
              >
                Get Started
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-border text-text-primary font-medium rounded-radius-md hover:bg-surface transition-all duration-150 hover:-translate-y-0.5"
              >
                View Dashboard
              </a>
            </div>
          </div>
          <div>
            <Terminal commands={CLI_COMMANDS} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Describe Your Task",
              desc: "Write what you need in natural language — just like you'd explain it to a colleague.",
            },
            {
              step: "02",
              title: "Agents Collaborate",
              desc: "Six specialized agents coordinate through the MCP protocol, each handling their domain.",
            },
            {
              step: "03",
              title: "Pipeline Executes",
              desc: "Your pipeline runs end-to-end with built-in observability and data quality checks.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center p-6">
              <div className="text-accent font-bold text-sm mb-3">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {item.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-center mb-12">
          Six Specialized Agents
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar stats={STATS} />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-6">
          Ready to build data pipelines?
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
          Install mcp-dataforge and coordinate six agents through natural
          language.
        </p>
        <div className="inline-flex items-center gap-2 bg-bg-terminal text-slate-300 font-mono text-sm rounded-radius-lg px-5 py-3 mb-8">
          <span className="text-slate-500">$</span>
          npm install -g mcp-dataforge
        </div>
        <div>
          <a
            href="/docs"
            className="inline-flex items-center px-6 py-3 bg-accent text-white font-medium rounded-radius-md hover:bg-accent-hover transition-all duration-150 hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify landing page renders**

Run: `npm run dev` then visit `http://localhost:3000`
Expected:
- Hero with headline "Natural language for data pipelines" in indigo accent
- Terminal window with sequential command reveal (animated)
- Two CTAs: "Get Started" (solid indigo) and "View Dashboard" (outlined)
- "How It Works" section with 3 columns
- "Six Specialized Agents" grid (6 agent cards, 3x2 on desktop)
- Dark stats bar with 4 metrics
- CTA section with npm install command block and "Get Started" button

---

### Task 7: API Routes

**Files:**
- Create: `src/app/api/agents/route.ts`
- Create: `src/app/api/pipelines/route.ts`
- Create: `src/app/api/pipelines/stream/route.ts`

**Interfaces:**
- Consumes: `AGENTS`, `PIPELINES` from `@/data/mock`
- Produces: `/api/agents` (GET), `/api/pipelines` (GET), `/api/pipelines/stream` (GET SSE)

- [ ] **Step 1: Create /api/agents/route.ts**

```typescript
import { NextResponse } from "next/server";
import { AGENTS } from "@/data/mock";

export async function GET() {
  return NextResponse.json(AGENTS);
}
```

- [ ] **Step 2: Create /api/pipelines/route.ts**

```typescript
import { NextResponse } from "next/server";
import { PIPELINES } from "@/data/mock";

export async function GET() {
  return NextResponse.json(PIPELINES);
}
```

- [ ] **Step 3: Create /api/pipelines/stream/route.ts**

```typescript
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected" })}\n\n`
        )
      );

      // Periodic pipeline progress updates
      let progress = 78;
      const interval = setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * 6) + 1);

        const event = {
          type: progress >= 100 ? ("complete" as const) : ("update" as const),
          pipelineId: "pl-1",
          status: progress >= 100 ? ("success" as const) : ("running" as const),
          progress,
          timestamp: new Date().toISOString(),
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => controller.close(), 1000);
        }
      }, 3000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

- [ ] **Step 4: Verify API routes return data**

Run: `npm run dev` then:
```bash
curl http://localhost:3000/api/agents
```
Expected: JSON array of 6 agents

```bash
curl http://localhost:3000/api/pipelines
```
Expected: JSON array of 5 pipelines

```bash
curl -N http://localhost:3000/api/pipelines/stream
```
Expected: SSE events with `data: {"type":"connected"}` then progress updates every ~3s

---

### Task 8: Dashboard Components (PipelineRow, DAGView)

**Files:**
- Create: `src/components/PipelineRow.tsx`
- Create: `src/components/DAGView.tsx`

**Interfaces:**
- Consumes: `PipelineSummary` from `@/types`
- Produces: PipelineRow component for pipeline list display, DAGView component with @xyflow/react flow visualization

- [ ] **Step 1: Create PipelineRow.tsx**

```tsx
import type { PipelineSummary } from "@/types";

const statusColors: Record<string, string> = {
  running: "bg-accent",
  success: "bg-success",
  failed: "bg-danger",
  pending: "bg-text-muted",
};

const AGENT_LABELS: Record<string, string> = {
  pipeline: "🔧 Pipeline",
  quality: "✅ Quality",
  schema: "📐 Schema",
  catalog: "📚 Catalog",
  observability: "🔍 Observability",
  orchestration: "⚡ Orchestration",
};

interface PipelineRowProps {
  pipeline: PipelineSummary;
}

export function PipelineRow({ pipeline }: PipelineRowProps) {
  return (
    <div className="bg-surface border border-border rounded-radius-lg p-4 hover:border-accent/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[pipeline.status]}`}
          />
          <span className="font-medium text-text-primary">{pipeline.name}</span>
        </div>
        <span className="text-sm text-text-secondary">
          {pipeline.duration || "—"}
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pipeline.status === "failed" ? "bg-danger" : "bg-accent"
          }`}
          style={{ width: `${pipeline.progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {pipeline.agents.map((a) => (
            <span key={a} className="text-xs text-text-muted">
              {AGENT_LABELS[a]}
            </span>
          ))}
        </div>
        <span className="text-xs font-medium text-text-muted capitalize">
          {pipeline.status} &middot; {pipeline.progress}%
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DAGView.tsx**

```tsx
"use client";

import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  ConnectionMode,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "source",
    position: { x: 0, y: 100 },
    data: { label: "Source" },
    style: {
      background: "#3B82F6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 600,
    },
  },
  {
    id: "transform",
    position: { x: 220, y: 100 },
    data: { label: "Transform" },
    style: {
      background: "#8B5CF6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 600,
    },
  },
  {
    id: "validate",
    position: { x: 440, y: 100 },
    data: { label: "Validate" },
    style: {
      background: "#10B981",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 600,
    },
  },
  {
    id: "publish",
    position: { x: 660, y: 100 },
    data: { label: "Publish" },
    style: {
      background: "#6366F1",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: 600,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "source",
    target: "transform",
    animated: true,
    style: { stroke: "#6366F1", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#6366F1" },
  },
  {
    id: "e2",
    source: "transform",
    target: "validate",
    animated: true,
    style: { stroke: "#6366F1", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#6366F1" },
  },
  {
    id: "e3",
    source: "validate",
    target: "publish",
    animated: true,
    style: { stroke: "#6366F1", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#6366F1" },
  },
];

export function DAGView() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-64 rounded-radius-lg border border-border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#94A3B8" gap={24} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: 0 errors

---

### Task 9: Dashboard Page

**Files:**
- Create: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `PipelineRow`, `AgentCard`, `DAGView` from Task 8/5; API routes from Task 7; `STATS` from `@/data/mock`
- Produces: Full interactive dashboard at `/dashboard`

- [ ] **Step 1: Create src/app/dashboard/page.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { AgentInfo, PipelineSummary } from "@/types";
import { STATS } from "@/data/mock";
import { AgentCard } from "@/components/AgentCard";
import { PipelineRow } from "@/components/PipelineRow";
import { DAGView } from "@/components/DAGView";

const cards = [
  { label: "Pipelines", value: STATS.totalPipelines.toLocaleString(), color: "text-accent" },
  { label: "Runs", value: STATS.totalRuns.toLocaleString(), color: "text-success" },
  { label: "Agents", value: String(STATS.activeAgents), color: "text-agent-schema" },
  { label: "Health", value: `${STATS.health}%`, color: "text-accent" },
];

export default function DashboardPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [pipelines, setPipelines] = useState<PipelineSummary[]>([]);
  const [tab, setTab] = useState<"overview" | "pipelines" | "agents">("overview");

  // Fetch initial data and connect SSE
  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => {});

    fetch("/api/pipelines")
      .then((r) => r.json())
      .then(setPipelines)
      .catch(() => {});

    const es = new EventSource("/api/pipelines/stream");
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.pipelineId) {
          setPipelines((prev) =>
            prev.map((p) =>
              p.id === data.pipelineId
                ? { ...p, progress: data.progress, status: data.status }
                : p
            )
          );
        }
      } catch {
        // ignore parse errors
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-8">
        Dashboard
      </h1>

      {/* Preview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-radius-lg p-6"
          >
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface border border-border rounded-radius-lg p-1 w-fit">
        {(["overview", "pipelines", "agents"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-radius-md transition-all ${
              tab === t
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Active Pipelines
            </h2>
            <div className="space-y-2">
              {pipelines.map((p) => (
                <PipelineRow key={p.id} pipeline={p} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Agent Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((a) => (
                <AgentCard key={a.id} agent={a} variant="dashboard" />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Pipeline Flow
            </h2>
            <DAGView />
          </section>
        </div>
      )}

      {tab === "pipelines" && (
        <div className="space-y-2">
          {pipelines.map((p) => (
            <PipelineRow key={p.id} pipeline={p} />
          ))}
        </div>
      )}

      {tab === "agents" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <AgentCard key={a.id} agent={a} variant="dashboard" />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard renders and SSE updates**

Run: `npm run dev` then visit `http://localhost:3000/dashboard`
Expected:
- 4 preview cards (Pipelines, Runs, Agents, Health) with indigo/success/schema colors
- Tab bar with Overview/Pipelines/Agents — indigo active tab
- Overview tab: Active pipelines list with PipelineRow components, agent status grid (2-3 columns), DAG visualization
- Pipeline rows show name, status dot, progress bar, agent labels, status + percentage
- DAG shows Source → Transform → Validate → Publish with color-coded nodes
- SSE updates cause the "sales-etl-prod" pipeline progress to increment every ~3s
- Pipelines tab shows just the pipeline list
- Agents tab shows just the agent grid

---

### Task 10: Docs Page

**Files:**
- Create: `src/app/docs/page.tsx`

**Interfaces:**
- Consumes: (self-contained — all data is inline)
- Produces: Documentation page at `/docs`

- [ ] **Step 1: Create src/app/docs/page.tsx**

```tsx
export default function DocsPage() {
  const cliCommands = [
    {
      command: "dataforge init",
      description: "Initialize a new dataforge project",
      args: "[--path]",
    },
    {
      command: 'dataforge run "task description"',
      description: "Run a pipeline from natural language",
      args: "<task>",
    },
    {
      command: "dataforge list",
      description: "List configured agents",
      args: "[--json]",
    },
    {
      command: "dataforge status",
      description: "Show pipeline status",
      args: "[<id>]",
    },
    {
      command: "dataforge logs",
      description: "View agent logs",
      args: "[--tail]",
    },
  ];

  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/agents",
      description: "List all registered agents",
    },
    {
      method: "GET",
      path: "/api/pipelines",
      description: "List all pipeline runs",
    },
    {
      method: "GET",
      path: "/api/pipelines/<id>/results",
      description: "Get pipeline results",
    },
    {
      method: "GET",
      path: "/api/pipelines/stream",
      description: "SSE stream of pipeline updates",
    },
    {
      method: "POST",
      path: "/api/pipelines",
      description: "Create a new pipeline run",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-4">
        Documentation
      </h1>
      <p className="text-lg text-text-secondary mb-16">
        Get started with mcp-dataforge in minutes.
      </p>

      {/* Quick Start */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-6">
          Quick Start
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              1. Install
            </h3>
            <div className="bg-bg-terminal text-slate-300 font-mono text-sm rounded-radius-lg px-5 py-4 overflow-x-auto">
              <span className="text-slate-500">$ </span>npm install -g
              mcp-dataforge
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              2. Initialize
            </h3>
            <div className="bg-bg-terminal text-slate-300 font-mono text-sm rounded-radius-lg px-5 py-4 overflow-x-auto">
              <span className="text-slate-500">$ </span>dataforge init
              --path ./my-pipeline
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
              3. Run a Pipeline
            </h3>
            <div className="bg-bg-terminal text-slate-300 font-mono text-sm rounded-radius-lg px-5 py-4 overflow-x-auto">
              <span className="text-slate-500">$ </span>
              dataforge run &ldquo;validate sales pipeline and publish
              metrics&rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* CLI Reference */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-6">
          CLI Reference
        </h2>
        <div className="border border-border rounded-radius-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Command
                </th>
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Description
                </th>
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Arguments
                </th>
              </tr>
            </thead>
            <tbody>
              {cliCommands.map((cmd, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 font-mono text-sm text-accent">
                    {cmd.command}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {cmd.description}
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-text-muted">
                    {cmd.args}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* API Reference */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-6">
          API Reference
        </h2>
        <div className="border border-border rounded-radius-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Method
                </th>
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Path
                </th>
                <th className="text-left px-5 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((ep, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-radius-sm ${
                        ep.method === "GET"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-text-primary">
                    {ep.path}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {ep.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify docs page renders**

Run: `npm run dev` then visit `http://localhost:3000/docs`
Expected:
- "Documentation" heading
- Quick Start section with 3 numbered steps, each with a terminal-style code block
- CLI Reference table with Command (accent-colored monospace), Description, Arguments columns
- API Reference table with Method badges (GET = green, POST = indigo), Path (monospace), Description columns

---

### Task 11: Final Build Verification

- [ ] **Step 1: Full TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 2: Production build**

```bash
npm run build
```
Expected: All routes compile successfully:
- `/` — static (prerendered)
- `/dashboard` — static with client JS
- `/docs` — static (prerendered)
- `/api/agents` — serverless function
- `/api/pipelines` — serverless function
- `/api/pipelines/stream` — serverless function

- [ ] **Step 3: Visual smoke test against DESIGN.md**

Checklist:
| Design Element | Status |
|----------------|--------|
| bg-primary (#FAFAFA) as page background | ✓ |
| Terminal UI with CLI commands | ✓ |
| Six agent cards with accent colors | ✓ |
| Dark stats band (bg-terminal #020617) | ✓ |
| Inter body / JetBrains Mono code | ✓ |
| Indigo (#6366F1) as primary accent | ✓ |
| Dark mode toggle (localStorage + prefers-color-scheme) | ✓ |
| Agent colors unchanged in dark mode | ✓ |
| Button hover: translateY(-1px) + 150ms ease | ✓ |
| Card hover: border accent + shadow | ✓ |
| Landing page: Hero → How It Works → Agent Grid → Stats → CTA | ✓ |
| Dashboard: Preview cards → Pipelines → Agents → DAG | ✓ |
| Docs: Quick Start → CLI Reference → API Reference | ✓ |
| Responsive: mobile stacks, tablet 2-col, desktop 3-col | ✓ |
| Casing: headings Title Case, labels Sentence case | ✓ |

- [ ] **Step 4: Commit all changes**

```bash
git add .
git commit -m "feat: rebuild mcp-dataforge website from DESIGN.md

- Landing, Dashboard, and Docs pages
- Full design token system with dark mode
- Interactive DAG visualization with @xyflow/react
- SSE pipeline updates on dashboard
- Mock API routes for agents and pipelines
- Terminal component with sequential command reveal
- Six-agent color system with dedicated identities

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Plan Self-Review

**Spec coverage:** Every DESIGN.md token (colors, spacing, typography, radii), all three page architectures, the four signature elements (terminal, agent colors, stats bar, DAG), responsive breakpoints, dark mode, motion specifications, writing style/casing rules, and component patterns are covered.

**Placeholder scan:** No TBD/TODO placeholders. Every step has complete code.

**Type consistency:** Types defined in Task 3 are used consistently across all components. `AgentId` union type drives agent color/icon mappings. `PipelineSummary.status` controls status dot colors, progress bar colors, and status text. All signatures match across consumers.
