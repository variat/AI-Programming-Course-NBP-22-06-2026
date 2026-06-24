---
applyTo: '**/*.ts'
description: 'Instructions and style guidelines for TypeScript (Angular) projects'
---
Never use `any` or `as` casts in TypeScript code.

Always use explicit type annotations for variables, function parameters, and return types.
Use type guards to narrow types and keep them safe at runtime.

This project's frontend is **Angular 20** (standalone components, signals, reactive forms) with Angular Material — see `docs/ADR/003-frontend.md`.
