# App

This folder contains the application built during the course: **Hardware Service Decision Copilot**.

Layout (per `../docs/ADR/000-main-architecture.md`):

```
app/
  backend/    Spring Boot backend (Java 21, Maven) — base package pl.nbp.copilot
  frontend/   Angular 20 workspace (Angular Material, ngx-markdown)
```

## How to start

The app is scaffolded through a structured process:

1. **Research** — use agents to research and validate the project idea
2. **PRD** — `../docs/PRD-Product-Requirements-Document.md`
3. **ADR** — `../docs/ADR/` (chosen stack: Java/Spring Boot backend + Angular frontend)
4. **Scaffold** — backend via Spring Initializr / Maven; frontend via Angular CLI (`ng new`, then `ng add @angular/material`)
5. **Implement** — build features with agents using TDD

## Checklist

Use this checklist during scaffolding. Some items are provided by the generators (Spring Initializr, Angular CLI); others you add explicitly.

### Backend (`app/backend`)
- [ ] Spring Boot 3.5.x project (Maven), Java 21, base package `pl.nbp.copilot`
- [ ] Dependencies: Spring Web, Spring Validation, Spring Data JPA, `sqlite-jdbc`, Hibernate community dialect, `openai-java`, Thumbnailator
- [ ] Typed config (`CopilotProperties`) bound to env vars
- [ ] `OpenAIClient` bean configured for OpenRouter (base URL + key from env)

### Frontend (`app/frontend`)
- [ ] Angular 20 workspace (standalone components, strict TypeScript)
- [ ] Angular Material (`ng add @angular/material`) + `ngx-markdown`
- [ ] Dev proxy (`proxy.conf.json`) routing `/api/**` to the backend
- [ ] Package manager chosen (npm / pnpm)

### Code quality
- [ ] Backend: formatting/linting (e.g. Spotless or Checkstyle) — optional but recommended
- [ ] Frontend: ESLint + Prettier
- [ ] `.editorconfig`

### Testing
- [ ] Backend: JUnit 5 + Mockito (unit); Spring Boot Test + MockWebServer against a temp SQLite DB (integration, mocks only the LLM)
- [ ] Frontend: unit test runner (confirm Angular 20 default via Context7)
- [ ] E2E: Playwright against the real stack (no mocks)

### Environment
- [ ] `.env.example` already lists required vars (see repo root); `.env` created locally (gitignored)
- [ ] `.gitignore` covers `target/`, `node_modules/`, `.env`, `data/` (SQLite file)

### AI integration
- [ ] `openai-java` → OpenRouter **Chat Completions** (vision + structured output + streaming)
- [ ] Image-analysis and decision calls (structured JSON output) + SSE chat endpoint
- [ ] Model config from env (`COPILOT_VISION_MODEL`, `COPILOT_DECISION_MODEL`)

### Persistence
- [ ] SQLite database file under `../data/` (gitignored), Spring Data JPA repositories

### Design
- [ ] Design tokens (`../assets/design-tokens.json`)
- [ ] Angular Material theme aligned with `../docs/design-guidelines.md`
- [ ] Logo and favicon (`../assets/`)

### Documentation
- [ ] PRD (`../docs/PRD-Product-Requirements-Document.md`)
- [ ] ADRs (`../docs/ADR/`)
- [ ] `AGENTS.md` in `app/backend` and/or `app/frontend` with stack-specific rules (optional)

## Notes

- Don't hand-create config files the generators already provide — it leads to conflicts.
- Let agents fetch current docs via Context7 (handles are listed in the ADRs and root `AGENTS.md`).
- Keep each side organized: backend by package (web/service/llm/image/policy/repository/domain/config); frontend by feature (form, chat) with shared services.
