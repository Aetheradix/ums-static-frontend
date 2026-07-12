# CLAUDE.md — AI agent guide to this project

Entry point for AI assistants working in this repo. Read this first, then
[`AI_DEVELOPMENT_RULES.md`](AI_DEVELOPMENT_RULES.md) (mandatory conventions),
[`projectdetails.md`](projectdetails.md) (current project structure & architecture — the
living source of truth, kept in sync per [`AI_DOCUMENTATION_RULES.md`](AI_DOCUMENTATION_RULES.md)),
and [`README.md`](README.md) (human setup docs).

---

## 1. What this is

**UMS Static Frontend** (white-labeled **"Octagon ERP"**) — the React frontend for a University
Management System (ERP). It is a **static/prototype** frontend: `ApiService` is a **mock** (returns
in-memory data with a fake delay; writes just `console.log`), and most save/submit handlers only
fire a `ToastService.success(...)` toast instead of persisting. The app renders the full UI so
screens can be reviewed and wired to a real backend later.

**Scope is the FULL scaffold** — ~58 domain modules live under `src/features/` (admissions, HRMS,
payroll, examination, hostel, LMS, legal, research, transport, …), organized under 10 top-level
menu categories. See `projectdetails.md` §1 & §8. (The sibling repo `ums-static-nalanda-campus` is
a _different_, DAVV-branded build trimmed to 3 modules — **don't** copy facts from it.)

## 2. Commands

| Task       | Command         | Notes                                                                                                                                                                                 |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev server | `npm run dev`   | Vite, **HTTPS on port 5200** (`https://localhost:5200`, mkcert). `vite-plugin-checker` shows an ESLint overlay.                                                                       |
| Build      | `npm run build` | `tsc -b && vite build`                                                                                                                                                                |
| Lint       | `npm run lint`  | `eslint .` — **only lints `.js/.jsx`, not the `.tsx` app** (see `projectdetails.md` §16).                                                                                             |
| Type-check | `npx tsc -b`    | **Not** `npm run type-check` — the root `tsconfig.json` has `"files": []`, so that command checks nothing and always exits 0. `tsc -b` (what `npm run build` uses) is the real check. |

Prettier runs on commit via husky + lint-staged. Environment is **Windows / PowerShell**.

## 3. Tech stack

- **React 19** + **TypeScript** (strict; `noUnusedLocals`/`noUnusedParameters` on)
- **Vite 8** (SWC) build; **Tailwind CSS v4** (CSS-first, **no `tailwind.config.js`**) + **PrimeReact 10** for UI
- **React Router v7** routing
- **TanStack React Query v5** wrapping the mock API + **Zustand** (only a few feature-scoped stores)
- **React Hook Form** + **Joi** validation (via wrappers, see §7)
- Motion/GSAP/Lenis (animation; mostly the public portal), Chart.js/Recharts (charts), oidc-client-ts (auth — mocked)

## 4. Import aliases (tsconfig `paths` + vite-tsconfig-paths)

Use bare aliases, **not** long relative paths:

```ts
import { GridPanel, FormPage } from 'shared/new-components';
import { Button } from 'shared/components/buttons';
import { ApiService, ToastService } from 'services';
```

| Alias                     | Resolves to                                 |
| ------------------------- | ------------------------------------------- |
| `shared/*`                | `src/shared/*`                              |
| `services` / `services/*` | `src/services/index.ts` / `src/services/*`  |
| `features` / `features/*` | `src/features/index.tsx` / `src/features/*` |
| `config/*`                | `src/config/*`                              |
| `auth` / `auth/*`         | `src/auth/*`                                |
| `types/*`                 | `src/types/*`                               |

## 5. Directory map

```
src/
├── App.tsx              # <LanguageProvider> + <Toast>; sets ToastService ref; wires PubSub api-error → toast
├── main.tsx             # Providers: PrimeReact > Router > QueryClient > Auth > App
├── index.css            # ~2,100-line Tailwind v4 @theme tokens + :root semantic/dark layer (§6 in projectdetails)
├── config/
│   ├── menu-routes.ts   # THE navigation tree (~9,200 lines) — menuConfig + useMenu(); drives sidebar/home tiles
│   └── initConfig.ts, errors.ts
├── features/            # ~58 domain modules (see §6) + index.tsx route tree + public-portal/ marketing site
├── shared/              # Reusable UI + logic (see §7). SINGLE SOURCE OF TRUTH for UI.
│   ├── components/      # Base primitives: buttons, forms, grid, layout, panels, popups, progress, workspace-layout, Icon
│   ├── new-components/  # Preferred design-system components — barrel: index.ts
│   ├── hooks/           # useAppForm (form.ts), useModal, useParamsId, useLocalStorage
│   ├── utils/           # validation (Joi wrapper), permissionCheck, date/string/export helpers
│   ├── context/         # LanguageProvider — the DOM-MutationObserver i18n engine (§11 in projectdetails)
│   ├── constants/       # translations.ts (~12,600-line Hindi dict)
│   └── di/              # getCacheService() + feature service getters (Static…Repository wiring)
├── services/            # index.ts: ApiService (mock), ToastService, PubSubService (+ cache/)
├── auth/                # OIDC-shaped but mocked — LoginPage accepts any credentials
├── types/               # Global TS namespaces (*.d.ts) — see §8
└── mocks/               # findMock registry feeding ApiService
```

## 6. Feature module anatomy (two coexisting patterns)

**A. React-Query CRUD** (the majority — ~123 `api.ts`/`queries.ts` pairs), e.g.
`src/features/cms-management/courses/`:

```
index.tsx  urls.ts  pages/(List|Create|Edit).tsx  components/<Entity>Form.tsx + form.hook.ts
api.ts     # <Entity>Api → ApiService (a MOCK) against a string root, e.g. 'cms/courses'
queries.ts # React Query hooks wrapping api.ts
```

> Still 100% static: `ApiService` is a mock, and page save handlers fire `ToastService.success(...)`.

**B. Pure static** (e.g. `alumni-management/`, `academics/`, `civil-infrastructure/`): no
`api.ts`/`queries.ts` — pages import a `data.ts` array directly; mutations only fire a toast.
`features/index.tsx` composes all modules into the route tree (inside `<MainLayout>`).

## 7. Shared UI & canonical page composition

**Always compose pages from shared components** (see `AI_DEVELOPMENT_RULES.md`). Two folders:
`shared/components/` (base) and `shared/new-components/` (**preferred**, single barrel).

Key `new-components`: `FormPage`, `FormCard`, `FormGrid`, `FormActions`, `FormPopup`, `GridPanel`,
`ConfirmDialog`, `InlineCreatePanel`, `ActionOverlay`, `Breadcrumb`, `StatCard`, `StatusBadge`,
`Stepper`, `Tabs`, `PortalSelector`, `SkeletonLoader`, `PaymentDialog`, `ReceiptDialog`,
`BulkSelectTable`, `GenericDataTablePage`, `PreviewField/Section/Summary`.

Canonical **list page**:

```tsx
<FormPage title="…" description="…">
  <FormCard>
    <GridPanel data={rows} columns={[{ field, header }, …]} onEdit={…} onRemove={…}
      toolbar={<Button label="Create" icon="plus" variant="primary" onClick={…} />} searchBox />
  </FormCard>
  <FormPopup visible={…} onHide={…} title="…">…</FormPopup>
</FormPage>
```

Canonical **form** (`<Entity>Form.tsx` + `form.hook.ts`): Joi schema via `validation.create<T>` +
`validation.resolver`, fed to `useAppForm` (wraps react-hook-form; `register(key)` returns
`{ control, name }`). Fields wrapped in `<FormGrid columns={…}>` with `<FormActions onSave onReset/>`.

## 8. Global TypeScript namespaces (no import needed)

Global `namespace`s in `src/types/*.d.ts` (and a few co-located `.d.ts`). Reference directly:
`Forms.SubmitFunc<T>`, `Controls.GridProps<T>`/`FormProps<T>`, `Menu.MenuItem`, `Api.*`, `Data.*`,
`User.*`, plus domain models (`UserManagement.*`, `Cms.*`, `Examination.*`,
`AffiliationManagementSystem.*`, `Master.*`, …). Example:
`function handleSubmit(data: UserManagement.UserForm) {…}`.

## 9. Services & cross-cutting

- **`ToastService`** — `.success(msg)` / `.error(msg, title?)` only (no `warn`). Ref set in `App.tsx`.
  The primary way the app simulates a successful save.
- **`ApiService`** — **mock** HTTP wrapper (`findMock` + fake delay; writes `console.log`).
- **`PubSubService`** — app-level event bus; `App.tsx` toasts `@event/api-*` errors. **Separate**
  from the `window` CustomEvent bus used by the Customization Engine (§14a in projectdetails).

## 10. Navigation, RBAC, portals & i18n (the non-obvious bits)

- `config/menu-routes.ts` is the whole menu tree; each leaf has `label`/`path`/`icon`/`colorScheme`
  and an optional `feature`+`action` RBAC key. **RBAC is inert** — `hasPermission()` is stubbed to
  `return true`, so nothing is filtered.
- **Portal landing pages** render full-width without a sidebar via the hand-maintained
  `PORTAL_PATHS` array in `MainLayout.tsx` — add new portal paths there.
- **i18n is a DOM `MutationObserver`** that string-matches live text against `translations.ts`'s
  `hi` dict (keyed by **exact English text**), _not_ a `t('key')` system. New user-facing copy
  needs a `hi` entry or it stays English. See `projectdetails.md` §11 before touching translated screens.
- **Customization Engine** broadcasts settings as `window` `CustomEvent`s (documented table in
  `projectdetails.md` §14a) — treat new broadcast settings as a public contract to document.

## 11. Conventions & gotchas

- **Shared-component-first, no inline styles (except genuinely dynamic values),
  PrimeReact-first** — enforced; see `AI_DEVELOPMENT_RULES.md`.
- Match the **surrounding file's** style (Tailwind utilities, no `style={{}}`; add `dark:` variants).
- After changes, verify with **`npx tsc -b`** (not `npm run type-check` — see §2). ESLint barely
  covers the app, so TS is your real safety net.
- Do **not** create changelog/summary `.md` files (the maintainer removes them). `projectdetails.md`
  is the one living state doc — keep it in sync per `AI_DOCUMENTATION_RULES.md`, don't append history.
- New domain modules are a scope decision — the app is already the full scaffold; confirm intent
  before adding another top-level module.
