# Design Documentation — Overview & Index

This directory contains the design documents and execution plan for the **Vendor
Proposal Management** portfolio demo. The demo is a **client-only** React
application that simulates the production system described in the
[README](../README.md) using an in-memory, mocked backend.

## Source material

| Document | Purpose |
|---|---|
| [README.md](../README.md) | Production system outline: roles, workflow, production tech stack. Descriptive only. |
| [demo-design.md](./demo-design.md) | Demo-specific spec: modified tech stack, data structures, pages, color palette. |

## Document index

| # | Document | Description |
|---|---|---|
| 00 | [Overview](./00-overview.md) | This file. Index, scope, and key decisions. |
| 01 | [Architecture](./01-architecture.md) | Technical architecture, module layout, container/presentational pattern, data flow. |
| 02 | [Data Model](./02-data-model.md) | Entities, relationships (ER diagram), and TypeScript-oriented type definitions. |
| 03 | [Workflows](./03-workflows.md) | Business process flows and proposal state machine (mermaid flow diagrams). |
| 04 | [UI / UX](./04-ui-ux.md) | Route map, navigation, page specifications, component structure, theming. |
| 05 | [Mock API](./05-mock-api.md) | MSW + GraphQL mock design, codegen, and the in-memory data store. |
| 06 | [Execution Plan](./06-execution-plan.md) | Phased delivery plan, milestones, testing strategy, and task breakdown. |

## Scope

### In scope

- A client-only SPA demonstrating the three roles: **Procurement Lead**,
  **Procurement Officer**, and **Vendor**.
- Full UI for dashboards, projects, artifacts, vendors, and proposals.
- Form-based artifacts authored with a lightweight **MUI-based survey builder**
  and rendered/completed via the SurveyJS runtime (schema stays SurveyJS-compatible).
- A mocked GraphQL backend (MSW) with a swappable in-memory data store.
- Pre-seeded, realistic demo data so dashboards and charts are populated.

### Out of scope

- Real authentication / authorization (simulated via an in-app role switcher).
- Data persistence beyond the current page session (pure in-memory).
- A real backend, database, file storage, or network calls to external services.
- Production concerns: scaling, security hardening, multi-tenancy enforcement.

## Key design decisions

These decisions were confirmed with the project owner and are applied across all
documents.

| Decision | Choice | Rationale |
|---|---|---|
| Document organization | Multiple focused docs | Easier to navigate and maintain than one monolith. |
| Mock API approach | **MSW intercepting GraphQL** | Mirrors production (Hot Chocolate GraphQL). TanStack Query + generated hooks work unchanged when a real backend is added. |
| Persistence | **Pure in-memory**, re-seeded on load | Matches the demo requirement that data not persist across refresh. |
| Role simulation | **In-app role/user switcher** | Lets a single viewer experience all three roles without auth. |
| Seed data | **Included** | Dashboards, graphs, and lists look realistic out of the box. |
| Survey authoring | **Custom MUI builder** (no SurveyJS Creator) | Replace the SurveyJS Creator/Designer with a basic MUI builder supporting only text, radio, checkbox, and select. Output stays SurveyJS-compatible for runtime rendering and production portability. |
| Testing | **Vitest + React Testing Library** | Lightweight, Vite-native; see the execution plan. |

## Technology summary (demo)

- **Build:** Vite, React 19, TypeScript
- **Routing:** TanStack Router
- **Data fetching / cache:** TanStack Query
- **GraphQL typing:** GraphQL Code Generator (project uses "React Native Codegen"
  terminology; see [Mock API](./05-mock-api.md) for the concrete tool choice)
- **UI:** Material UI (MUI)
- **Forms:** custom MUI-based survey builder for authoring (text, radio, checkbox,
  select only) + SurveyJS runtime for render/complete (SurveyJS Creator/Designer
  is **not** used)
- **Mock backend:** Mock Service Worker (MSW) with an in-memory store
- **Charts:** MUI X Charts (dashboard graphs)
- **Testing:** Vitest + React Testing Library

See [Architecture](./01-architecture.md) for how these fit together.
