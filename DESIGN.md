# DataForge Website Design System

## Brand Identity

- **Product:** mcp-dataforge — multi-agent data engineering framework
- **Audience:** Data engineers, platform engineers, data practitioners
- **Personality:** Precise, technical, trustworthy, developer-first
- **Tagline:** *Data engineering, in your own words.*

---

## Design Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#FAFAFA` | Page background — near-white, softer than pure white |
| `--surface` | `#FFFFFF` | Cards, code blocks, elevated elements |
| `--accent` | `#6366F1` (Indigo-500) | Primary accent — buttons, links, highlights |
| `--accent-subtle` | `#EEF2FF` (Indigo-50) | Accent backgrounds, badges |
| `--accent-border` | `#C7D2FE` (Indigo-200) | Accent borders |
| `--text-primary` | `#0F172A` (Slate-900) | Headings, primary text |
| `--text-secondary` | `#64748B` (Slate-500) | Body text, labels |
| `--text-muted` | `#94A3B8` (Slate-400) | Captions, metadata |
| `--border` | `#E2E8F0` (Slate-200) | Default borders |
| `--terminal-bg` | `#020617` (Slate-950) | Terminal/code backgrounds |

**Agent accent colors:**

| Agent | Color | Hex |
|-------|-------|-----|
| Pipeline | Blue | `#3B82F6` |
| Data Quality | Emerald | `#10B981` |
| Schema | Violet | `#8B5CF6` |
| Orchestration | Cyan | `#06B6D4` |
| Catalog | Amber | `#F59E0B` |
| Observability | Rose | `#F43F5E` |

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display (hero) | Inter | 700 | 4xl-6xl (`2.25rem-3.75rem`) |
| Heading | Inter | 600 | base-xl (`1rem-1.25rem`) |
| Body | Inter | 400 | base (`1rem`) |
| Code/Terminal | JetBrains Mono | 400 | sm (`0.875rem`) |
| Small/Tags | Inter | 500 | xs (`0.75rem`) |

### Spacing

- **Section gap:** `pb-20` (5rem)
- **Card padding:** `p-5` (1.25rem)
- **Hero padding top:** `pt-24 sm:pt-32` (6rem-8rem)
- **Content max-width:** `max-w-5xl` (64rem)

### Border Radius

| Element | Radius |
|---------|--------|
| Cards | `rounded-xl` (0.75rem) |
| Buttons/CTAs | `rounded-lg` (0.5rem) |
| Tags/Badges | `rounded-full` |
| Terminal | `rounded-xl` (0.75rem) |
| Stat card container | `rounded-2xl` (1rem) |

---

## Page Architecture

### Routes

| Path | Content | Type |
|------|---------|------|
| `/` | Landing page | Server Component |
| `/dashboard` | Pipeline monitoring | Client Component |
| `/docs` | Documentation | Server Component |

### Landing Page Sections

```
┌─────────────────────────────────────────┐
│  Navigation Bar (sticky)                │
│  Logo · Home · Dashboard · Docs         │
├─────────────────────────────────────────┤
│                                         │
│  Hero Section (split layout)            │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │ MCP-native    │  │ Terminal window  │ │
│  │ badge         │  │ with live        │ │
│  │ Headline      │  │ command demo     │ │
│  │ Tagline       │  │                  │ │
│  │ pip install   │  │                  │ │
│  │ Read docs →   │  │                  │ │
│  └──────────────┘  └──────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  How It Works (3-step process)          │
│  ① Describe your task                   │
│  ② Agents collaborate                   │
│  ③ Get results                          │
├─────────────────────────────────────────┤
│  Six Specialist Agents (3×2 card grid)  │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Pipeline│ │  DQ  │ │Schema│            │
│  └──────┘ └──────┘ └──────┘            │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Orch   │ │Catalog│ │Observ│            │
│  └──────┘ └──────┘ └──────┘            │
├─────────────────────────────────────────┤
│  Stats Bar (dark slate card)            │
│  MCP · 6 Agents · 25+ Tools · Zero API │
├─────────────────────────────────────────┤
│  CTA Section                            │
│  pip install mcp-dataforge              │
├─────────────────────────────────────────┤
│  Footer                                 │
│  Docs · Dashboard · GitHub · License    │
└─────────────────────────────────────────┘
```

### Dashboard Page

```
┌─────────────────────────────────────────┐
│  Nav Bar (+ dark mode toggle, live dot) │
├─────────────────────────────────────────┤
│  Stats Cards (4-column grid)            │
│  Pipelines · Agents · Completed · Errors│
├─────────────────────────────────────────┤
│  Recent / All Pipelines (list)          │
│  ┌─────────────────────────────────────┐│
│  │ Status · Task · Agent chain · DAG  ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  Agents Grid (6-column)                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│  │Pi │ │DQ│ │Sc│ │Or│ │Ca│ │Ob│       │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘       │
│  + Agent Detail Panel (sidebar)         │
└─────────────────────────────────────────┘
```

---

## Signature Elements

### 1. Terminal Window (Hero)
A MacOS-style terminal with traffic light buttons and a title bar. Shows 4 real `dataforge` commands executing sequentially. Bottom line has a blinking cursor to suggest interactivity. This is the "one memorable thing" — data engineers live in terminals.

### 2. Indigo Accent
`#6366F1` is used sparingly — the MCP-native badge, the headline highlight, terminal output text. It signals "this is the important part" without overwhelming the page.

### 3. Color-Coded Agent Cards
Each agent has a distinct accent color (blue, emerald, violet, cyan, amber, rose). Cards show subtle colored shadows on hover — a playful reveal that the 6 agents are distinct individuals.

### 4. Dark Slate Stats Bar
The 4 stats (MCP, 6, 25+, Zero) sit in a dark slate `rounded-2xl` container — a visual break from the light background, giving weight to the numbers.

---

## Component Patterns

### Agent Card
```
┌─────────────────────┐
│  🔧                 │
│  Pipeline           │
│  SQL generation &   │
│  debugging          │
│  ┌─────────┐        │
│  │  sql    │        │  ← colored tag
│  └─────────┘        │
└─────────────────────┘
```

### Terminal Window
```
┌─────────────────────────┐
│  ● ● ●  dataforge       │  ← macOS traffic lights
├─────────────────────────┤
│  $ dataforge init       │
│  → Created config.yaml  │
│  $ dataforge run "..."  │
│  → ✅ dq: profiled...   │
│  $ _                    │  ← blinking cursor
└─────────────────────────┘
```

### Code Block (CTA)
```
┌──────────────────────────┐
│  pip install mcp-dataforge│  ← dark bg, indigo text
└──────────────────────────┘
```

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|---------------|
| `sm` (640px) | Hero text scales down, 2-col agent grid |
| `md` (768px) | 3-col agent grid, terminal shows |
| `lg` (1024px) | Split hero layout (text + terminal side by side) |
| `xl` (1280px) | Max width container, full spacing |

- Mobile: Single column, terminal below hero text
- Tablet: 2-column agent grid, compact spacing
- Desktop: Full split layout, 3-column agent grid

---

## Dark Mode

Same design, inverted:

| Light | Dark |
|-------|------|
| `#FAFAFA` bg | `#0F172A` (Slate-950) |
| `#FFFFFF` cards | `#1E293B` (Slate-800) |
| `#0F172A` text | `#F1F5F9` (Slate-100) |
| `#E2E8F0` borders | `#334155` (Slate-700) |
| `#6366F1` accent | `#818CF8` (Indigo-400) |
| Agent tag bg `bg-blue-50` | `bg-blue-950` |

Toggle persists via `localStorage` and respects `prefers-color-scheme`.

---

## Motion & Interaction

- **Hover:** Agent cards lift with shadow (`hover:shadow-lg`)
- **Agent card borders:** Colored accent border on hover (not all the same color)
- **Terminal cursor:** `animate-pulse` blink
- **Page transitions:** None (static prerender — instant navigation)
- **Dashboard:** SSE connection for live pipeline updates
- **Dark mode toggle:** Instant class toggle, no transition needed

---

## Writing Style

- Sentence case everywhere (not Title Case)
- Active voice: "Describe your task" not "Task description"
- Commands shown as real terminal output, not screenshots
- No placeholder text — every section has real content
- Error messages: directive, not apologetic
- Numbers: "6 agents" not "Six Agents"
