# AI Documentation Rules

> **Companion to [`AI_DEVELOPMENT_RULES.md`](AI_DEVELOPMENT_RULES.md).** That file governs
> _how_ to write code here (conventions). This file governs _keeping [`projectdetails.md`](projectdetails.md)
> accurate_ — the single source of truth for project structure and architecture.

## 1. Before starting non-trivial work

Read `projectdetails.md` first. It describes the current module scope, directory structure,
routing, the global styling token system, the i18n mechanism, the Customization Engine's event
contracts, the mock data/service layer, and the known tech debt — context that's easy to get
wrong by guessing from a partial read of the codebase. Several of these systems are non-obvious:

- The **i18n engine is a DOM `MutationObserver`** string-replacement system, not `t('key')` —
  and it exposes an unused `t()` that looks like the real mechanism but isn't.
- **`ApiService` is a mock** — "React Query" modules are still 100% static, and real "saves" are
  just `ToastService.success(...)` toasts.
- The **Customization Engine** couples unrelated files through `window` `CustomEvent`s.
- **RBAC is inert** (`hasPermission()` always returns `true`).
- There are two component layers (`components/` vs `new-components/`) and known duplicate/dead code.

## 2. After a structural change, update `projectdetails.md` in the same change

**Structural** means the answer to "would a future agent's mental model of this app be wrong
without this update?" is yes. Concretely, update it when you:

- Add, remove, or rename a **feature module** under `src/features/` (or change which pattern —
  React-Query vs pure-static — a module uses)
- Add a new **shared component** meant to be reused (a new `new-components/` export, a new form
  control, a new layout primitive)
- Change the **global CSS token system** (`index.css`'s `@theme`/`:root` blocks) — new/renamed
  tokens, a new `--dark-*` var, a new brand color
- Change **routing structure** (`features/index.tsx`, `config/menu-routes.ts`'s top-level shape,
  `PORTAL_PATHS`)
- Change the **auth/RBAC model** (how `feature`/`action` gating works, how `ProtectedRoute`
  behaves, or if `hasPermission()` stops being a stub)
- Change the **data/service layer** — the `ApiService` mock behavior, a new `services/` export, a
  new cache key, or a new DI service getter in `shared/di`
- Add or change a **cross-component event contract** — either a Customization-Engine
  `window.dispatchEvent(new CustomEvent(...))` (document it in the §14a table), a `PubSubService`
  event, or a cross-tab `localStorage`/`storage`-event contract like `civil-infrastructure`'s.
  These are invisible to a normal file read (dispatcher and listener live in unrelated directories)
  and are exactly what silently breaks when someone "cleans up" an unused-looking event name.
- Add a new **DOM-global behavior** (a `MutationObserver`, IntersectionObserver, a class toggled on
  `<html>`/`<body>`, a `sessionStorage`/`localStorage` key used as app state)

**Not structural** — don't update for: routine bug fixes, copy/translation tweaks, styling
adjustments within an existing pattern, adding one more page/field inside a module that already
follows a documented pattern, adding a translation key.

## 3. Keep it a state document, not a log

`projectdetails.md` describes what the project _is right now_. Don't append a running history of
changes to it — edit the relevant section in place, and let `git log` be the history (this matches
the project's "no changelog files" convention — don't create standalone changelog/summary `.md`
files either). Keep the **"Last verified against the codebase"** date at the bottom current when
you do a pass. If you find a section that's gone stale (references a file/module that no longer
exists, describes behavior that's changed), fix it in place — don't leave it and add a correction
below it.

## 4. If you find drift

If you notice `projectdetails.md` contradicts the actual codebase (a described module doesn't
exist, a documented event isn't actually dispatched, a "dead" file is now imported, etc.), fix the
doc as part of whatever task surfaced the discrepancy — don't leave it for later. Stale
architecture docs are worse than no docs, because they're trusted by default. The **Known
technical debt** section (§16) in particular must stay honest: if you clean up a listed item
(e.g. delete the empty `hrms/` stub, remove the duplicate `affiliation-management-system` route,
delete dead `date-utils.ts`), remove it from that section in the same change.
