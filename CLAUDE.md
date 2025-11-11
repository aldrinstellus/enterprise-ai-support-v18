# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔒 DOCUMENTATION POLICY (CRITICAL)

**READ THIS FIRST** - This project follows a **strict SDLC-style documentation policy**:

### Mandatory Documentation Structure

✅ **REQUIRED**: All documentation MUST be organized in `/docs/` using 15 SDLC categories:
- Only `00-DOCUMENTATION-INDEX.md` at docs root
- All other docs in numbered folders: `01-getting-started/` through `15-reference/`

✅ **REQUIRED**: All historical/extra files MUST go to `/Aldo/` folder:
- Previous versions, deprecated docs, working notes → `/Aldo/`
- Keep `/docs/` root clean and professional

✅ **REQUIRED**: Follow naming convention: `UPPERCASE-WITH-DASHES.md`

✅ **REQUIRED**: Update `docs/00-DOCUMENTATION-INDEX.md` when adding any documentation

**📜 Full Policy**: See [DOCUMENTATION-POLICY.md](./DOCUMENTATION-POLICY.md) for complete standards.

**⚠️ For Claude Code**: When creating or organizing documentation:
1. ALWAYS use the SDLC structure (15 categories)
2. ALWAYS move extra/historical files to `/Aldo/`
3. NEVER create `.md` files outside the structure
4. ALWAYS update the documentation index

---

## Project Overview

**Enterprise AI Support V16** - Client Feedback Phase 2 implementation with video title and keyword animations. Based on v15-presentation with all CTIS/ITSS branding and features.

**Version**: 16.0.0
**Port**: 3017
**Status**: Development - Phase 2 Client Feedback
**Base**: Cloned from V15 (All Phase 1 feedback complete)

## 📚 Documentation Structure

**CRITICAL**: This project now has **comprehensive SDLC-style documentation** in `/docs/`:

- **[📘 Documentation Index](./docs/00-DOCUMENTATION-INDEX.md)** - Master navigation (START HERE)
- **[🚀 Quick Start Guide](./docs/01-getting-started/QUICK-START.md)** - 5-minute setup
- **[🏗️ System Architecture](./docs/02-architecture/SYSTEM-ARCHITECTURE.md)** - System design
- **[🔌 API Reference](./docs/03-api/API-OVERVIEW.md)** - 30+ endpoints
- **[💾 Database Schema](./docs/04-database/DATABASE-SCHEMA.md)** - 15+ Prisma models
- **[🔗 Integrations](./docs/05-integrations/INTEGRATION-OVERVIEW.md)** - External services
- **[⚡ Features](./docs/06-features/FEATURE-OVERVIEW.md)** - All capabilities
- **And 8 more comprehensive sections** (testing, deployment, operations, security, workflows, reference)

**Historical Documentation**: `/Aldo/` folder contains previous documentation for reference.

## Application URLs

**Development Server**: http://localhost:3017

**Demo Pages** (Main Application):
- **C-Level Executive**: http://localhost:3017/demo/c-level
- **CS Manager**: http://localhost:3017/demo/cs-manager
- **Support Agent**: http://localhost:3017/demo/support-agent

**API Health Check**: http://localhost:3017/api/health

## Development Commands

### Core Development
```bash
npm run dev              # Start Next.js dev server with Turbopack (port 3017)
npm run dev:full         # Start both frontend and mock WebSocket server
npm run dev:ws           # Start mock WebSocket server only
npm run build            # Production build with Turbopack
npm run start            # Start production server (port 3017)
```

### Code Quality
```bash
npm run type-check       # TypeScript validation (run before commits)
npm run lint             # ESLint validation
```

### Database Operations
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database (development)
npm run db:migrate       # Create and run migrations (production)
npm run db:studio        # Open Prisma Studio for database management
```

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode)
- **Frontend**: React 19 with client components
- **Database**: Prisma ORM with PostgreSQL
- **Styling**: Tailwind CSS 4 with Solar Dusk theme
- **Animations**: Framer Motion (motion/react)
- **AI Integration**: Anthropic Claude SDK (@anthropic-ai/sdk)
- **Icons**: Lucide React
- **Charts**: Recharts

## Architecture Overview

### Two-State Interface Design

The app features a unique two-state UI pattern:

1. **Empty State** (first load): Centered hero text ("AI that *actually* gets work done") with centered input
2. **Active State** (after first message): Input transitions to bottom-fixed position with 600ms smooth animation

Both states use Framer Motion for 60fps transitions.

### Persona System

The application supports 4 distinct personas with role-based interfaces:

- **Admin**: Full system access, cross-persona demo scenarios
- **C-Level Executive**: High-level metrics, executive summaries
- **CS Manager**: Team performance, workload distribution, SLA monitoring
- **Support Agent**: Ticket details, knowledge base, customer interactions

Each persona has:
- Unique badge colors and icons
- 5-9 Quick Actions tailored to their role
- Persona-specific query detection and widget rendering
- Theme customization with Solar Dusk color variants

### Widget System

The app uses a sophisticated widget rendering system based on query detection:

**Widget Types**: 19 specialized widgets including:
- Executive Summary, Agent Performance Stats, Team Workload Dashboard
- Ticket Detail, Similar Tickets Analysis, Ticket List
- Customer Risk Profile, Customer Risk List
- Knowledge Article, Knowledge Base Search
- Response Composer, Message Composer, Call Prep Notes
- SLA Performance Chart, Agent Performance Comparison
- Meeting Scheduler, Agent Dashboard

**Query Detection** (`/src/lib/query-detection.ts`):
- Pattern matching against user queries
- Persona-aware widget selection
- Priority-based widget rendering
- Returns appropriate widget type and context

### Database Schema

Comprehensive PostgreSQL schema with 15+ models including:
- **Users**: Role-based access (C_LEVEL, CS_MANAGER, SUPPORT_AGENT)
- **Tickets**: Full lifecycle tracking with SLA monitoring
- **Customers**: Tier-based management with risk scoring
- **AgentMetrics**: Performance tracking and workload management
- **Activities**: Audit logging for all ticket actions
- **Notifications**: Real-time alerts with priority levels

See `prisma/schema.prisma` for complete schema.

### API Routes

**Claude AI Integration** (`/src/app/api/chat/route.ts`):
- Streaming responses with Server-Sent Events (SSE)
- Tool calling for mock services (Zoho CRM, Desk, Slack, Calendar)
- Uses `claude-3-5-sonnet-20241022` model
- Requires `ANTHROPIC_API_KEY` in `.env.local`

### Component Architecture

**V15 Clean Structure** (Reorganized 2025-11-07):

```
src/
├── app/
│   ├── page.tsx              # Main chat interface with persona switcher
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Solar Dusk theme + custom CSS variables
│   ├── api/chat/route.ts     # Claude SDK integration
│   ├── demo/                 # Demo persona pages
│   ├── workflows/page.tsx    # Workflow management page
│   └── dashboard/            # Dashboard views
├── components/
│   ├── presentation/         # NEW - Video/slide presentation system (V15)
│   ├── accessibility/        # NEW - CC, zoom, WCAG 2.1 AA features (V15)
│   ├── demo/                 # NEW - Demo controls (narrator, zoom) (V15)
│   ├── branding/             # NEW - CTIS/ITSS brand system (V15)
│   ├── widgets/              # 19 specialized widget components
│   │   ├── WidgetRenderer.tsx       # Dynamic widget loader
│   │   └── WidgetSkeleton.tsx       # Loading states
│   ├── ui/                   # Radix UI components
│   │   └── glowing-effect.tsx       # Mouse-following border effect
│   ├── chat/                 # Chat interface components
│   ├── layout/               # Layout components (header, sidebar)
│   ├── smart/                # Smart components
│   └── workflows/            # Workflow components
├── config/
│   ├── variants/             # NEW - Demo variants (Gov Prog/CIO/Client Service) (V15)
│   └── personas.ts           # Persona configurations
├── types/
│   ├── persona.ts            # Persona type definitions
│   ├── widget.ts             # Widget type definitions
│   ├── workflow.ts           # Workflow type definitions
│   ├── brand/                # NEW - Brand type definitions (V15)
│   ├── presentation/         # NEW - Presentation type definitions (V15)
│   └── demo/                 # NEW - Demo type definitions (V15)
├── hooks/
│   ├── use-persona.ts        # Persona context provider
│   ├── demo/                 # NEW - Demo hooks (V15)
│   └── accessibility/        # NEW - Accessibility hooks (V15)
├── lib/
│   ├── query-detection.ts    # Intelligent query parsing
│   └── integrations/         # External service integrations
├── data/
│   └── demo-widget-data.ts   # Mock data for widgets
└── contexts/                 # React context providers

archive/                      # Historical content (not in src/)
├── v14-historical-docs/      # V14 documentation (formerly Aldo/)
├── ui-experiments/           # Old UI experiments
├── analysis/                 # Historical analysis
├── references/               # Reference materials
├── notes/                    # Development notes
└── screenshots/              # Old screenshots
```

## Key Features

### Conversation Management
- Create, rename, pin, archive conversations
- Export as Text or JSON
- Share link generation
- Recent conversations (last 10)
- Persona-specific conversation history
- LocalStorage persistence

### Message Actions
- Typewriter streaming effect (200 chars/sec)
- Copy to clipboard with visual feedback
- Regenerate response
- Like/Dislike feedback
- Relative timestamps
- Save queries to favorites

### Real-Time Features
- Mock WebSocket server on port 3001 (for demo)
- Real-time streaming from Claude API
- Typing indicators during AI response generation

## Development Guidelines

### TypeScript Configuration
- **Strict mode enabled**: All code must be fully typed
- **Path alias**: `@/*` maps to `src/*`
- **Target**: ES2017
- Run `npm run type-check` before all commits

### Solar Dusk Theme
Warm, professional color scheme defined in `src/app/globals.css`:
- Primary: `hsl(25.96 90.48% 47.06%)` (warm orange)
- Background: `hsl(20 14% 8%)`
- Cards: `hsl(20 14% 10%)`
- Border: `hsl(20 15% 20%)`

### Adding New Widgets

1. Create widget component in `src/components/widgets/`
2. Define widget type in `src/types/widget.ts`
3. Add query patterns to `src/lib/query-detection.ts`
4. Import in `WidgetRenderer.tsx`
5. Add demo data to `src/data/demo-widget-data.ts`

### Adding New Personas

1. Define persona in persona configuration
2. Add Quick Actions specific to role
3. Configure badge color and icon
4. Add persona-specific query patterns to detection system

## Environment Variables

Required in `.env.local`:

```bash
# Claude AI (optional - app works with mock data if not provided)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Database (optional - for Prisma features)
DATABASE_URL=postgresql://...

# WebSocket (optional - for real-time features)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Important Notes

- **Demo Mode**: The app works fully without API keys using mock data
- **Claude SDK**: Real AI responses available when `ANTHROPIC_API_KEY` is configured (see CLAUDE-SDK-SETUP.md)
- **Database**: Prisma schema defined but database connection optional for demo
- **Port 3017**: Chosen to avoid conflicts with other project versions (v15 uses 3016, v14 uses 3014)
- **No Backend**: All state managed in localStorage for demo purposes
- **Turbopack**: Next.js 15 uses Turbopack by default for fast builds (<1s)

## Testing Queries

Try these persona-specific queries:

**C-Level**:
- "Show me executive summary"
- "What's our team's performance?"

**CS Manager**:
- "Show team workload dashboard"
- "Compare agent performance"
- "Check SLA compliance"

**Support Agent**:
- "Show ticket TICK-001"
- "Find similar tickets"
- "Draft response for angry customer"
- "Search knowledge base for password reset"

## 📊 Production Quality: 100/100 🏆

| Category | Score | Status |
|----------|-------|--------|
| TypeScript | 20/20 | ✅ 0 errors (strict mode) |
| Build Configuration | 20/20 | ✅ Production-ready |
| Security | 18/20 | ✅ CSP + Headers + 0 vulnerabilities |
| Infrastructure | 20/20 | ✅ Docker + Health checks |
| DevOps | 18/20 | ✅ CI/CD pipeline |
| Code Quality | 20/20 | ✅ 9 ESLint warnings (88% reduction from 73) |

**Key Achievements**:
- ✅ Health check endpoint (`/api/health`)
- ✅ Security headers middleware (CSP, HSTS, X-Frame-Options)
- ✅ Docker containerization (multi-stage build)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Environment validation (Zod schemas)
- ✅ 60+ comprehensive documentation files

## Documentation Sections

All documentation is in `/docs/` organized into 15 categories:

1. **01-getting-started/** - Quick start, setup, prerequisites
2. **02-architecture/** - System design, patterns, data flow
3. **03-api/** - API reference, authentication, examples
4. **04-database/** - Schema, migrations, Prisma guide
5. **05-integrations/** - Claude AI, Zoho Desk, Supabase, Jira
6. **06-features/** - Multi-persona system, widgets, AI workflows
7. **07-components/** - 19 widgets, UI components, theme
8. **08-development/** - Developer guide, code structure, standards
9. **09-testing/** - E2E testing, QA, test data
10. **10-deployment/** - Docker, Vercel, CI/CD, environment vars
11. **11-operations/** - Monitoring, logging, troubleshooting
12. **12-security/** - Security architecture, headers, audits
13. **13-performance/** - Optimization, benchmarks
14. **14-workflows/** - 7 AI workflow scenarios
15. **15-reference/** - Glossary, quick reference, changelog, FAQ

## Project Context & Evolution

**Version Evolution**:

- **V1-V2**: Traditional support ticket dashboard
- **V3**: Claude-style AI chat interface with SDK integration
- **V4**: Multi-persona system, intelligent widget rendering (STABLE)
- **V6**: New features development branch
- **V11**: Advanced experimental branch
- **V12**: Zoho Desk webhook integration, production deployment
- **V14**: **100/100 production score** with comprehensive SDLC documentation 🏆 (PRODUCTION)
- **V15**: **Presentation branch** - Client Feedback Phase 1 (8/8 complete) + Gender avatars
- **V16**: **Client Feedback Phase 2** - Video title + Keyword animations (THIS VERSION)

**Focus**: Implementing Phase 2 client feedback (video title at top, animated keywords during intro) while preserving all v15 features and stability.
