# UMS Static Frontend - AI Development Rulebook

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS & DEVELOPERS:**
> You MUST read and strictly adhere to this document before generating any code, creating new pages, or adding features to this repository. Failure to follow these rules will result in rejected pull requests.
>
> This file covers **conventions** (how to write code here). For current **project structure
> and architecture** (module scope, directory layout, routing, the global CSS token system, the
> i18n engine, the mock data layer, cross-component event contracts), see
> [`projectdetails.md`](projectdetails.md) — keep it updated per
> [`AI_DOCUMENTATION_RULES.md`](AI_DOCUMENTATION_RULES.md) when you make a structural change.
> New to the repo? Start with [`CLAUDE.md`](CLAUDE.md).

## 1. Core Development Philosophy

This project is built for scale (50-100 developers contributing simultaneously). To maintain sanity, performance, and a cohesive user experience, we adhere to **100% Component Reusability**.

- **No Duplication:** Never write inline or localized UI logic (buttons, cards, tables, layouts) inside a specific page if a generic version exists or could exist.
- **Visual Consistency:** The styling and layout MUST remain completely identical to the existing static pages.

> **Context:** this is a **static/prototype** frontend. `ApiService` is a mock (in-memory data,
> fake delay; writes just `console.log`), and most saves are simulated with a
> `ToastService.success(...)` toast. Don't add real HTTP/persistence unless explicitly asked —
> follow the existing mock patterns (see `projectdetails.md` §8, §15).

## 2. The "Shared Component-First" Workflow

Whenever you are tasked with creating a new page or adding a feature, you MUST follow this workflow in exact order:

### Step 1: Analyze & Break Down

Analyze the requested page layout. Break it down into fundamental UI elements (e.g., Page Header, Data Table, Form Layout, Sidebar, Status Badge).

### Step 2: Search `src/shared/`

Before writing _any_ new UI code in the `src/features/` directory, thoroughly search `src/shared/`
for existing components. **Prefer `src/shared/new-components/`** (the current design system, single
barrel `shared/new-components/index.ts` — `FormPage`, `FormCard`, `FormGrid`, `FormPopup`,
`GridPanel`, `FormActions`, `StatCard`, `StatusBadge`, etc.) over the older base primitives in
`src/shared/components/`. Form controls live in `src/shared/components/forms/` (`TextBox`,
`DropDownList`, `DatePicker`, `Switch`, …). Note some names exist in **both** layers
(`ConfirmDialog`, `SkeletonLoader`) — use the `new-components/` version.

### Step 3: Build Shared First (If Missing)

If a required UI element (or a "big feature" block) does not exist in `src/shared/`:

1. **DO NOT** build it inside the feature's specific folder.
2. **DO** build it as a highly reusable, generic component inside `src/shared/` (default to
   `new-components/` for a new design-system component, and add it to the barrel).
3. Ensure the new shared component relies on props for all specific data, avoiding any hardcoded business logic.

### Step 4: Compose the Page

Once all necessary building blocks exist in `src/shared/`, navigate to `src/features/<feature-name>/`.
Compose the new page **strictly by importing and assembling the shared components**. The files in `src/features/` should contain business logic, data fetching (React Query over the mock API), state management, and component composition—**NOT raw HTML/Tailwind styling for generic UI elements.**

Pick the module's existing **data pattern** (see `projectdetails.md` §8): pattern **A** (React
Query — `api.ts` + `queries.ts`, form via `form.hook.ts` with a Joi schema and `useAppForm`) or
pattern **B** (pure static — import a `data.ts` array directly, mutations fire a toast). Match
whichever the surrounding module already uses.

## 3. Directory Structure Rules

- **`src/shared/`**: The single source of truth for UI. `new-components/` (preferred design system)
  - `components/` (base primitives), plus `hooks/`, `utils/`, `context/` (i18n), `di/`.
- **`src/features/`**: Domain-specific modules (~58 of them — the full scaffold). Pages here act as
  "Controllers" that wire data to the views (Shared Components). Adding a _new top-level module_ is
  a scope decision — confirm intent first.

## 4. Styling & Layout Guidelines

- **Frameworks:** **Tailwind CSS v4** (CSS-first — tokens live in `src/index.css`'s `@theme`/`:root`
  blocks; there is **no `tailwind.config.js`**) and **PrimeReact**.
- **PrimeReact Priority:** Always prefer a PrimeReact component (styled with Tailwind via classNames or pass-through) over building a complex interactive element from scratch.
- **No Inline Styles — with one narrow, deliberate exception:** Do not use `style={{ ... }}` for
  anything expressible as a static Tailwind class. The **only** legitimate use of inline `style` is
  a value genuinely computed at runtime that cannot be a static class — e.g. a progress bar's
  `width: ${percentage}%`, a per-column table width from caller data (PrimeReact's `<Column>` API),
  or a color-swatch's `backgroundColor` from an arbitrary hex. Tailwind's own docs endorse inline
  `style` for exactly this case, because utility classes must be statically analyzable at build
  time. An inline style where every value is a literal (`style={{ display: 'flex', gap: '8px' }}`)
  is dead weight to convert to `className="flex gap-2"`, not a pattern to copy.
- **Design Tokens:** Use the established tokens — don't invent new colors/spacing ad hoc. See
  `projectdetails.md` §6 for the concrete table. The app-wide brand color is **`--color-primary`**
  (`#002069`, exposed as `bg-primary`/`text-primary`/etc.) — this is what the Customization Engine's
  theme-color picker rewrites at runtime. Use it for app chrome: buttons, active/selected states,
  focus rings. (The public marketing portal has its own scoped sub-theme — `--color-navy`,
  `--font-display` — don't reach for those outside `features/public-portal/`.)
- **Dark mode:** Tailwind v4 `@custom-variant dark` keyed off a `.dark` class on **`<body>`**.
  Always add a `dark:` variant alongside any new light-mode color/background/border class, and lean
  on the existing `--dark-*` tokens rather than inventing dark colors.

## 5. Routing and Portal Selectors

When configuring navigation in `src/config/menu-routes.ts` and
`src/shared/components/layout/MainLayout.tsx`, observe these strict rules:

- **Portal Landing Pages:** Top-level modules with complex bifurcations should act as "Portal
  Selectors" (full-width, no sidebar).
- **Bypassing the SubMenu Grid:** To make a top-level menu item go straight to a custom Portal
  Selector page, assign a direct `path` property to the parent item in `menu-routes.ts`.
- **Hiding the Sidebar:** Any new portal landing path MUST be added to the `PORTAL_PATHS` array in
  `MainLayout.tsx` — this is a **hand-maintained** list matched by exact string, so a new portal
  route silently renders _with_ a sidebar until you append it. Add the exact route string.
- **Deep Sidebar Matching:** `MainLayout.tsx` computes sidebar tabs by finding the deepest parent
  whose children contain a direct match to the current route. Ensure nested children in
  `menu-routes.ts` define their `path` relative to their module so the sidebar resolves the exact
  feature group.
- **Don't duplicate a route.** (`affiliation-management-system/*` is currently registered twice in
  `features/index.tsx` — that's tracked tech debt, not a template.)

## 6. Internationalization

New user-facing copy needs a Hindi entry in `shared/constants/translations.ts`'s `hi` block,
**keyed by the exact English text as it appears in the DOM** — this isn't a `t('key')` system, it's
a DOM `MutationObserver` that string-matches live text nodes (see `projectdetails.md` §11 before
touching any translated screen). The context exposes a `t()` function, but it's **unused** — don't
adopt it. If you split a sentence across multiple JSX text nodes (e.g. `"Welcome to " +
<span>{name}</span>`), each node is translated independently — keep a translatable sentence as one
text node and give it a single `hi` entry, or its Hindi word order/coverage will break.

## 7. Cross-component event contracts

If you introduce a `window.dispatchEvent(new CustomEvent(...))` that another file listens for via
`addEventListener` (as the Customization Engine does), treat that event name + payload shape as a
public contract: document it in `projectdetails.md`'s Customization Engine table (§14a). The same
goes for a new `PubSubService` event, or a cross-tab `localStorage` + `storage`-event contract (as
`civil-infrastructure` uses). These contracts are invisible to a normal file read — the dispatcher
and listener can live in unrelated directories — and are exactly the kind of thing that looks like
dead code to a future cleanup pass if it isn't written down anywhere.

## 8. Enforcement Checklist for AI

Before concluding a task, verify:

- [ ] Did I check `src/shared/` (especially `new-components/`) before creating a new UI element?
- [ ] Are all generic UI elements on this page imported from `src/shared/`?
- [ ] Is the page visually identical in layout and typography to existing pages?
- [ ] Are there zero inline styles (aside from the genuinely-dynamic-value exception, §4)?
- [ ] Did I add a `dark:` variant to every new color/background/border class?
- [ ] For new modules, did I add them to `PORTAL_PATHS` in `MainLayout` if they need a full-width selector view without a sidebar?
- [ ] Does new user-facing copy have a Hindi entry in `translations.ts` (keyed by exact English text)?
- [ ] Did I verify with **`npx tsc -b`** (NOT `npm run type-check`, which is a no-op — see `projectdetails.md` §3/§16) and `npm run lint`?
- [ ] Did this change alter project structure/architecture, a data/service pattern, or a cross-component event contract? If so, did I update `projectdetails.md` per `AI_DOCUMENTATION_RULES.md`?

**END OF RULES**
