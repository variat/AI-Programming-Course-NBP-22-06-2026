# Orchestration Plan — Hardware Service Decision Copilot (PoC)

## Context

This plan delivers a **fully working proof of concept** of the *Hardware Service Decision Copilot*: a self-service web app where a customer submits a hardware **complaint** (*reklamacja*) or **return** (*zwrot*) with one photo, the backend compresses the image and runs a two-stage AI pipeline (vision image-analysis → policy-grounded decision), and the customer continues the case in a streaming chat. All user-facing text is **Polish**. The product, architecture, and tech decisions are already fixed by the PRD and ADRs — this document is **only a work-breakdown and orchestration plan**, not new architecture.

**Why now:** the repo has complete specs (PRD + 5 ADRs + design guidelines + 2 policy docs) but almost no code — the backend is greenfield and the frontend is bare Angular scaffolding. The intended outcome is a running, tested PoC built by three specialized agents (`be-developer`, `fe-developer`, `qa-engineer`) working partly in parallel, with TDD throughout and a commit after every verified step.

**Role:** I act as **orchestrator/manager only** — I do not write product code. I delegate each step to the right agent with a self-contained, task-specific prompt, verify the result, and coordinate synchronization points.

### Decisions locked with the user
| Decision | Choice |
|---|---|
| LLM model | Use the ADR model `openai/gpt-5.4-mini`; a working key is in `.env`. (B6 still does a read-only probe of OpenRouter `/models` to confirm it resolves; model stays env-configurable.) |
| Test depth | **Full pyramid**: be/fe unit + integration (LLM mocked at HTTP boundary) **plus** qa-engineer Playwright E2E against the **real running stack + real OpenRouter**. |
| Execution | **Autonomous end-to-end** — orchestrate all phases without pausing; report when the PoC is done or if genuinely blocked. |
| Parallelism & git | **Parallel in isolated git worktrees** after the contract is frozen; commit after each verified step on a feature branch; **do NOT push** to remote. |

### Current repo state (verified)
- `app/backend/` — **does not exist**. Pure greenfield Spring Boot.
- `app/frontend/` — Angular 20.3, Material 20.2.14, ngx-markdown 20.1, Karma/Jasmine, strict TS. Routes `/`→`RequestForm` and `/chat/:caseId`→`Chat` exist as **empty placeholder components** (folders `request-form/`, `chat/`). `proxy.conf.json` maps `/api`→`localhost:8080`. No services/models/store. `node_modules` installed.
- Agents (all Sonnet) already know: read PRD/ADR first; TDD; verification commands; commit format `Area: short summary`; Context7 handles. A **PostToolUse hook auto-runs a CVE scan on every `pom.xml` write**.
- `docs/policies/{complaint,return}-policy.md`, `assets/design-tokens.json`, logo/favicon — all present.

---

## Orchestration mechanics

- **Foundation prerequisite (Step S0 — do FIRST):** The current `app/frontend` scaffold is **untracked**, and the orchestrator's worktree was branched fresh from `origin/main`, so neither it nor any new worktree contains the scaffold. Before any track starts: from the main checkout create integration branch **`feat/poc`** and commit the existing untracked scaffold + needed files (`Frontend: commit Angular scaffold baseline`) so every branch/worktree can see it. Verified state: `app/backend/` absent, `app/frontend/` present only in the main checkout.
- **Worktree topology (honors the approved "parallel in worktrees" choice without pushing):** Two **persistent** worktrees under `.claude/worktrees/`, both branched from `feat/poc` *after* S0 + `C0` land: `poc-be` (branch `feat/poc-be`) and `poc-fe` (branch `feat/poc-fe`). They share one local `.git` object store but have **independent indexes/working dirs**, so concurrent commits to the two branches are race-free. `be` touches only `app/backend/**`, `fe` only `app/frontend/**`; `docs/contracts/` is frozen read-only. Each delegated agent works against absolute paths inside its assigned worktree (writes under `.claude/worktrees/` satisfy the bg-isolation guard). Merge both branches into `feat/poc` at each sync point and before `I1`; disjoint dirs ⇒ conflict-free. `C0` is authored on `feat/poc` so both worktrees inherit it; the frozen contract is also pasted into the `fe` prompt so `fe` never blocks on `be`.
- **Fallback if cross-worktree delegation proves unreliable:** collapse to a single `feat/poc` worktree and run the fine-grained steps **sequentially** (still TDD, still commit-per-step, still dependency-ordered) — trading wall-clock parallelism for mechanical robustness.
- **Per-task context discipline:** every delegated prompt contains **only** what that step needs — the specific ADR section(s), the relevant contract slice, the exact TACs to satisfy, the files to create, the test-first list, the verify command, and the commit message. I do not dump the whole PRD/ADR set into any single agent.
- **Definition of done per step:** tests written first and failing for the right reason → minimal code → verification green → one focused commit. No step is "done" until its verify command passes.
- **Set commit identity once** before the first commit: `git config user.email "mmierzejewski@gmail.com" && git config user.name "variat"`.

### Verify commands
- Backend (`app/backend`): `mvn -q test` per step, `mvn -q verify` to close a phase.
- Frontend (`app/frontend`): `npm test -- --watch=false` and `npm run build`.
- E2E (qa): Playwright against both apps started for real.

---

## Contract-first strategy (the whole concurrency story)

`be` and `fe` live in separate directories, so file conflicts are near-zero. Their only coupling is the **HTTP/DTO contract**. We freeze it as a shared, human-readable artifact **before** either side builds, so `fe` develops against a mock while `be` implements for real.

**Shared artifact — `docs/contracts/api-contract.md`** (Step `C0`, authored by `be`, reviewed by `fe`+`qa`). Frozen with concrete JSON examples for:
1. `GET /api/meta/form-options` → exact `FormOptionsResponse`, the canonical enum `value`s and Polish `label`s for the 2 request types and **16** equipment categories (PRD §8). Single source of truth for both Java enums and FE selectors.
2. `POST /api/cases` multipart **part names** (`requestType`, `equipmentCategory`, `equipmentName`, `purchaseDate`, `reason`, `image`) and the exact `201 CaseResultResponse` body.
3. `ErrorResponse` shape `{code,message,fieldErrors[]?,retryable?}` with a concrete example per status (400 field, 400 oversize, 415 type, 503 retryable). `fieldErrors[].field` names match the multipart part names exactly.
4. `POST /api/cases/{id}/messages` **SSE grammar**: `event: delta`, terminal `event: done` (`{messageId}`), `event: error` (`{message,retryable}`).
5. `GET /api/cases/{id}` → exact `CaseDetailResponse` (summary + decision + ordered `messages[]`).

**Synchronization points (the only forced rendezvous — all are verification handshakes, not merges of the same files):**
- **SP-1** after `C0`: contract frozen → tracks fork.
- **SP-2** `B2` live + `fe` form: enum values/labels match byte-for-byte.
- **SP-3** `B11` + `F4`: first real submit (parts + 201 + error shapes).
- **SP-4** `B12` + `F6`: SSE event-grammar handshake.
- **SP-5** `B13` + `F7`: resume/deep-link handshake.

A **contract change after `C0` is the one cross-cutting risk** — handle as a `Docs:` commit that notifies both agents and may invalidate the FE mock + BE DTOs. Keep `C0` thorough to avoid it.

---

## Phased breakdown

Conventions: each row is one agent, one logical change, TDD, ends with a green verify + one commit. `mvn` = run in `app/backend`; `npm` = run in `app/frontend`.

### Phase 0 — Foundations & contract (serial gate)
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **C0** | be | Freeze API/DTO/error/SSE contract | n/a (doc, reviewed by fe+qa) | `docs/contracts/api-contract.md` (5 sections, JSON examples) | `Docs: freeze API contract for cases/meta/chat` | — |
| **B0** | be | Spring Boot 3.5.x skeleton builds & runs | `ContextLoadsTest` | `app/backend` Maven project, `pom.xml` (Spring Web, Validation, Data JPA, sqlite-jdbc, hibernate-community-dialects, thumbnailator, openai-java), `Application.java`, `application.yml` (UTF-8 forced), `.gitignore` for `data/` | `Backend: scaffold Spring Boot app with context-loads test` | C0 |
| **F0a** | fe | Confirm test runner + baseline green | run existing `app.spec.ts` | none (confirm Karma/Jasmine via Context7) | `Frontend: confirm baseline test+build green` | — |
| **F0b** | fe | Shared TS models + runtime contract mock | model-shape unit test vs fixtures | `models/*.ts`, `mocks/` canned responses (interceptor/MSW), Polish string constants | `Frontend: add API models and contract mock fixtures` | C0 |

### Phase 1 — BE persistence + meta ∥ FE form skeleton
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **B1** | be | JPA entities + enums + repos on SQLite | save+reload graph, sequence order, cascade delete, **Polish UTF-8 round-trip**, blob round-trip, rollback-no-orphans (TAC-004-01..05) | `domain` (ServiceCase, StoredImage, Decision, ChatMessage + 3 enums), `repository`, SQLite dialect + **WAL + busy-timeout**, temp-DB test profile | `Backend: add JPA entities and repositories on SQLite` | B0 |
| **B2** | be | `GET /api/meta/form-options` | 200 returns 2 types + 16 categories, exact Polish labels | `web.MetaController`, `FormOptionsResponse`, enum→label map | `Backend: add meta form-options endpoint` | B1 |
| **F1** | fe | Reactive form scaffold (Material) | controls render; category select from mocked options | `request-form/` reactive form (selects, model input, `pl-PL` datepicker, reason textarea, submit) | `Frontend: build request form scaffold with Material controls` | F0b |
| **F2** | fe | Conditional + date + image client validation | reason required iff REKLAMACJA & reactive (TAC-003-01); future date blocked, today ok; image type/size (TAC-003-02) | reason validator, datepicker `max=today`, `ImageUpload` (preview, remove/replace, JPEG/PNG/WebP, ≤10 MB) | `Frontend: add conditional, date, and image client validation` | F1 |

### Phase 2 — BE supporting services ∥ FE submit/error/store
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **B3** | be | Image validation + compression | reject bad type (415) & oversize (400); compress longest edge; base64 data URI w/ MIME (TAC-02/03) | `image.ImageService` (Thumbnailator), `CopilotProperties` | `Backend: add image validation and compression service` | B0 |
| **B4** | be | Policy loader (cached) | REKLAMACJA→complaint, ZWROT→return, non-empty, cached | `policy.PolicyService` reads `docs/policies/*.md` | `Backend: add policy loading service` | B0 |
| **B5** | be | Global exception handler → ErrorResponse | provoked exceptions → 400/415/503 Polish bodies per contract (TAC-001-07) | `web.GlobalExceptionHandler`, `ErrorResponse`, `LlmUnavailableException` | `Backend: add global exception handler and error shape` | B1 |
| **F3** | fe | `submitCase` + success navigation | mocked 201 → navigate `/chat/:caseId`, store populated | `CaseApiService.submitCase`, `CaseStore` (signals), locked processing, double-submit guard | `Frontend: wire case submission and success navigation` | F2 |
| **F4** | fe | Submit error handling preserves data | 400→inline fieldErrors; 415/oversize→upload error; 503→Polish retry banner w/ values+image retained (TAC-003-03) | error→inline mapping, retry banner, preservation | `Frontend: handle submit errors with retry and data preservation` | F3 |

### Phase 3 — LLM integration (be only; heaviest serial segment)
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **B6** | be | OpenRouter client + prompt library | targets `OPENROUTER_BASE_URL`, key OPENAI→OPENROUTER, never api.openai.com (TAC-002-05); prompt selection. **Read-only `/models` probe to confirm model id.** | `config.LlmClientConfig`, `llm.PromptLibrary` (4 templates + chat preamble; Polish, disclaimer, 3 outcomes, low-conf→WYMAGA) | `Backend: configure OpenRouter client and prompt library` | B0 |
| **B7** | be | Vision image-analysis client | complaint/return prompt + base64 vision part; JSON→`ImageAnalysisResult`; invalid enum→repair (TAC-002-01) | `llm.ImageAnalysisClient`, `ImageAnalysisResult` | `Backend: add vision image-analysis LLM client` | B6, B3 |
| **B8** | be | Decision client (structured) | prompt has policy+form+analysis; outcome ∈ 3 enums; json_schema→json_object fallback +1 repair (TAC-002-02/03) | `llm.DecisionClient`, `DecisionResult` | `Backend: add decision LLM client with structured output` | B6, B4 |
| **B9** | be | Retry/timeout wrapper | 503-then-200 ok; always-503→`LlmUnavailableException`, no partial (TAC-002-04) | `llm.LlmRetry` | `Backend: add bounded LLM retry and timeout handling` | B7, B8 |

### Phase 4 — BE orchestration & SSE ∥ FE chat
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **B10** | be | First-message formatter | renders greeting→outcome→justification→next steps→disclaimer (Polish MD) | `service.MessageFormatter` | `Backend: add first-message Markdown formatter` | B0 |
| **B11** | be | `CaseService` + `POST /api/cases` | valid→201 full graph in 1 tx (TAC-001-02, TAC-04); unusable image→201 lowConfidence+better-photo, no verdict (TAC-001-03); validation 400/415/oversize pre-LLM (TAC-001-01); LLM fail→503, zero rows (TAC-001-04/06) | `service.CaseService`, `web.CaseController`, `CaseSubmissionForm` (Bean Validation), `CaseResultResponse` | `Backend: add case submission orchestration and endpoint` | B1,B3,B4,B5,B9,B10 |
| **B12** | be | `ChatService` + SSE `POST /messages` | `text/event-stream`, ordered `delta`+`done{messageId}`, assistant persisted (TAC-001-05/07); unknown→404; mid-stream error→`error` | `service.ChatService`, `web.ChatController` (`SseEmitter` + bounded executor), `ChatClient` streaming | `Backend: add streaming chat endpoint over SSE` | B11, B6 |
| **B13** | be | `GET /api/cases/{id}` resume | full ordered history; 404 unknown (TAC-001-06) | `CaseDetailResponse`, controller + service read | `Backend: add case detail resume endpoint` | B11 |
| **F5** | fe | Chat view + first-message Markdown | first ASSISTANT msg renders MD w/ highlighted outcome/justification/next steps/disclaimer | `chat/` message list (Material), `ngx-markdown`, input+send, optional context header | `Frontend: build chat view with Markdown rendering` | F0b |
| **F6** | fe | SSE consumption | mocked `ReadableStream`: bubble grows, finalizes on `done`, `error`→per-msg retry (TAC-003-04) | `CaseApiService.streamMessage` (fetch+ReadableStream parser), typing indicator | `Frontend: consume SSE chat stream with retry` | F5 |
| **F7** | fe | Resume on refresh | mocked GET rehydrates; unknown id→error (TAC-003-05) | route resolver / `getCase()` → store rehydrate | `Frontend: rehydrate chat on direct navigation` | F5, F3 |

### Phase 5 — Switch-over & E2E (sync + qa)
| Step | Agent | Goal | Tests first | Prod code | Commit | Depends |
|---|---|---|---|---|---|---|
| **I1** | fe | Flip mock → real proxied backend (SP-2..5) | re-run all FE unit tests; **start both apps**, manual smoke | disable runtime mock; point `CaseApiService` at `/api`; confirm enum match w/ B2 | `Frontend: switch from mock to real backend` | B2,B11,B12,B13,F4,F6,F7 |
| **Q1** | qa | E2E happy paths (real stack) | Playwright: complaint submit→decision→chat reply; return submit→decision; **no Polish mojibake on screen** (TAC-08) | `e2e/` specs + config; real `OPENROUTER_API_KEY` | `Test: add E2E happy-path complaint and return flows` | I1 |
| **Q2** | qa | E2E error/edge paths | missing reason→400 inline; future date; bad type/size; 503 retry preserves data; bad image→better-photo; off-topic redirect | more Playwright specs | `Test: add E2E validation, error, and edge flows` | Q1 |

---

## Dependency matrix

```
C0 (be) ──► gate for everything
   │
   ├─► B0 (be) ──────────────► BE track ─┐
   └─► F0a/F0b (fe) ─────────► FE track ─┤  (parallel worktrees)
                                          │
BE: B0 ─► B1 ─► B2                        │
        B1 ─► {B3 ∥ B4 ∥ B5}             │
        B0 ─► B6 ─► {B7 ∥ B8} ─► B9      │
        B0 ─► B10                         │
        {B1,B3,B4,B5,B9,B10} ─► B11 ─► {B12(+B6), B13}
                                          │
FE: F0b ─► F1 ─► F2 ─► F3 ─► F4           │
        F0b ─► F5 ─► {F6, F7(+F3)}        │
                                          │
   ───── SP: I1 joins both tracks ────────┘
   I1 (fe) ─► Q1 (qa) ─► Q2 (qa)
```

**Parallel (no shared files):** entire BE track ∥ entire FE track. Within BE: `B3∥B4∥B5` (after B1), `B7∥B8` (after B6). qa may *draft* Playwright config during Phase 4 but Q1/Q2 are gated on `I1`.

**Hard blockers:** `C0` → all · `B0` → all BE · `B6` → B7/B8/B12 · `B9,B10` → B11 · `B11` → B12/B13 · `I1` → Q1 → Q2.

**Critical path:** `C0 → B0 → B1 → B6 → B8 → B9 → B11 → B12 → I1 → Q1 → Q2` — dominated by the serial backend LLM+orchestration chain. The **entire FE track overlaps it** (the biggest wall-clock win); keep `fe` on F5–F7 while `be` is in Phase 3.

---

## Risk register
| Risk | Mitigation | Owner |
|---|---|---|
| `openai/gpt-5.4-mini` may not resolve on OpenRouter | Model fully env-driven; **read-only `/models` probe at B6** confirms a valid vision+structured-output id and records it in `.env.example`; never hardcode | be / B6 |
| SQLite single-writer contention | Short single tx; enable **WAL + busy-timeout** at B1; isolated temp DB per test (TAC-004-05) | be / B1 |
| SSE on servlet stack (hung threads / proxy buffering) | `SseEmitter` on bounded executor, generous timeout, no response buffering; verify ordered delta→done & mid-stream error; confirm Angular proxy doesn't buffer SSE | be / B12, fe / F6 |
| Model rejects `json_schema` | Fallback at B8: json_object + bean-validate + 1 repair; enum validated before persist (TAC-002-03); unit-test the fallback | be / B8 |
| Polish UTF-8 mojibake | Force UTF-8 (JVM, `application.yml` `encoding.force=true`, `produces` charset, UTF-8 sources); prefer YAML/JSON over `.properties`; assert round-trip at B1 (TAC-004-04) and on-screen at Q1 (TAC-08) | be / B1, qa / Q1 |
| Contract drift after C0 | Treat `api-contract.md` frozen; changes are `Docs:` commits notifying both agents; make C0 thorough | be / C0 |
| Long synchronous submit (two LLM calls) | Generous client + server timeouts; FE locked processing indicator | be / B11, fe / F3 |
| CVE-scan hook blocks pom edits | Expect hook on B0/dependency steps; pin/upgrade flagged deps before committing, never bypass | be / B0 |

---

## End-to-end verification (PoC acceptance)
1. **Backend:** `cd app/backend && mvn -q verify` → all unit + integration green (LLM mocked at HTTP boundary).
2. **Frontend:** `cd app/frontend && npm test -- --watch=false && npm run build` → green.
3. **Live run:** start backend (`mvn spring-boot:run`, port 8080) with a real `OPENROUTER_API_KEY`; start frontend (`npm start`, port 4200, proxy active). Open `http://localhost:4200`.
4. **Manual smoke (qa, Playwright MCP):** complaint flow (form → photo → decision → chat follow-up) and return flow; verify Polish text renders with no mojibake and the layout matches `docs/design-guidelines.md` (navy `#152E52` / gold `#BDAD7D`).
5. **E2E suite:** Q1 + Q2 Playwright specs pass against the real stack (happy + error/edge paths).
6. **Data:** one submission persists exactly one ServiceCase + StoredImage + Decision + first ASSISTANT ChatMessage in `data/copilot.db`; refresh on `/chat/:caseId` rehydrates from `GET /api/cases/{id}`.
7. **Git:** all work committed to `feat/poc` with focused `Area:` messages; **nothing pushed**.

---

## Critical files
- `docs/contracts/api-contract.md` — created at **C0**; the shared artifact that decouples be/fe (highest-leverage step).
- `app/backend/pom.xml` — **B0** dependency set; triggers the CVE-scan hook.
- `app/frontend/src/app/app.routes.ts`, `app/frontend/proxy.conf.json` — existing; confirm FE class names (`RequestForm`/`Chat`) and the `/api`→8080 proxy the `I1` switch-over relies on.
- `docs/policies/complaint-policy.md`, `docs/policies/return-policy.md` — read by B4/B8, injected into decision prompts.
