# Project Details — UMS Static Frontend (Octagon ERP)

> **This file is the living source of truth for project structure and architecture.**
> It is kept in sync per the rules in [`AI_DOCUMENTATION_RULES.md`](AI_DOCUMENTATION_RULES.md).
> For coding conventions (how to write code here), see [`AI_DEVELOPMENT_RULES.md`](AI_DEVELOPMENT_RULES.md).
> This is a **state** document, not a changelog — it describes what _is_, not the history of
> how it got there (see `git log` for history).

---

## 1. What this project is

A React/TypeScript **static/prototype frontend** for a University Management System (ERP),
white-labeled in-app as **"Octagon ERP"** (the browser `<title>` in `index.html` is the
generic "University ERP"). It renders full, reviewable UI screens meant to be wired to a real
backend later — but today **nothing talks to a real server**:

- `ApiService` is a **mock** (see §15) — every call resolves against in-memory mock data with a
  fake 500ms delay; writes just `console.log` the payload.
- Save/submit handlers across the app simulate success by firing a `ToastService.success(...)`
  toast (~349 call sites) rather than persisting anything.

**Scope is the FULL scaffold — intentionally broad.** Unlike a trimmed prototype, this app
still contains **~58 domain modules** under `src/features/` (admissions, HRMS, payroll,
examination, hostel, LMS, legal, research, transport, etc.), wired end-to-end through the mock
layer. If you are asked to _remove_ modules or trim scope, treat that as a deliberate, confirm
-first decision — the current shape is "everything, statically rendered."

> **Sibling project note:** `D:\work\university-management-system\ums-static-nalanda-campus` is a
> _different_ build of the same base, deliberately stripped to 3 modules and branded for DAVV.
> Do **not** copy facts from it — this project's scope, branding, and some systems differ. This
> file describes _this_ repo only.

---

## 2. Tech stack

- **React 19**, **TypeScript** (strict — `noUnusedLocals` / `noUnusedParameters` on; target ES2022)
- **Vite 8** (`@vitejs/plugin-react-swc`, `vite-plugin-checker` for an in-browser ESLint overlay, `vite-plugin-mkcert` for local HTTPS, `vite-tsconfig-paths` for aliases)
- **Tailwind CSS v4**, **CSS-first** (`@import 'tailwindcss'` + `@theme` in `src/index.css`; **there is no `tailwind.config.js`**) — see §6. **PrimeReact 10** (`lara-light-indigo` base theme) + PrimeIcons + local Material Symbols font
- **React Router v7**
- **TanStack React Query v5** (wraps the mock API in ~123 sub-features) + **Zustand** (present, but only as a few _feature-scoped_ stores — not a global store; see §17)
- **React Hook Form** + **Joi** (via `shared/utils/validation` + `shared/hooks/form.ts`'s `useAppForm`)
- `oidc-client-ts` (auth — **mocked**, see §12), `lucide-react` + PrimeIcons + Material Symbols (icons), Chart.js/Recharts (charts), `motion` + **GSAP** + **Lenis** (animation/smooth-scroll — mostly the public marketing portal, §18), `jspdf`/`to-words`/`nanoid`/`jsencrypt`/`moment`/`clsx`/`react-modal`

## 3. Commands

| Task                     | Command         | Notes                                                                                                                                                                                                                                                                               |
| ------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev server               | `npm run dev`   | Vite, **HTTPS on port 5200** (`https://localhost:5200`, mkcert). `vite-plugin-checker` shows an ESLint error overlay.                                                                                                                                                               |
| Build                    | `npm run build` | `tsc -b && vite build` (variants: `build-local`, `build-testing`, `build-prod`)                                                                                                                                                                                                     |
| Lint                     | `npm run lint`  | `eslint .` — **but the flat config only matches `**/*.{js,jsx}`\*\*, so it does *not\* lint the `.tsx` app source (see §16).                                                                                                                                                        |
| **Real type-check**      | `npx tsc -b`    | See warning below.                                                                                                                                                                                                                                                                  |
| ~~`npm run type-check`~~ | `tsc --noEmit`  | **Do not rely on this.** Root `tsconfig.json` has `"files": []` and only `references` — this command type-checks _nothing_ and always exits 0, even with broken imports. `tsc -b` (what `npm run build` runs) or Vite's dev-server import analysis is what actually catches errors. |

Environment is **Windows / PowerShell**. Prettier runs on commit via husky + lint-staged.

## 4. Directory structure (current, accurate)

```
src/
├── App.tsx                # <LanguageProvider> wrapping <Toast> + <Features/>; registers
│                          #   ToastService.setToastRef; subscribes PubSub api-error events → ToastService.error
├── main.tsx               # Providers (outer→inner): StrictMode > PrimeReactProvider > BrowserRouter
│                          #   > QueryClientProvider > AuthProvider > App. Imports index.css + PrimeReact theme; initConfig()
├── index.css              # ~2,100-line global stylesheet: Tailwind v4 @theme tokens + :root semantic/dark layer (see §6)
├── config/
│   ├── menu-routes.ts     # THE navigation tree (~9,200 lines) — menuConfig + useMenu(); see §7
│   ├── initConfig.ts      # QueryClient (refetchOnWindowFocus:false) + ApiService.setApiRoot(VITE_API_HOST)
│   └── errors.ts
├── features/
│   ├── index.tsx          # Root route tree — see §7
│   ├── components/         # Shared feature-level Select components (NOT a domain module)
│   ├── home/               # Portal shell: service-tile menu / sub-menu pages (rendered outside MainLayout)
│   ├── public-portal/      # Public marketing site ("cms/*" routes) — Lenis/GSAP/IntersectionObserver; see §18
│   ├── master/             # Master-data CRUD hub (user-management, cms-management nested here, HR/college/academic masters)
│   ├── mocks.ts            # (per-feature) findMock data sources feed ApiService
│   └── … ~55 more domain modules …  # admissions-management, hrms, payroll, examination-management,
│                           #   hostel-management, lms, legal-case-management, civil-infrastructure, etc. (§8)
├── shared/                # SINGLE SOURCE OF TRUTH for UI — see §9
│   ├── components/         # Base primitives (per-subfolder barrels): buttons, forms, grid, panels,
│   │                       #   popups, progress, layout, workspace-layout, Icon, Tiles
│   ├── new-components/     # PREFERRED design-system layer — single barrel: shared/new-components/index.ts
│   ├── hooks/             # useAppForm (form.ts), useModal.ts, params.ts (useParamsId), useLocalStorage.ts
│   ├── utils/             # validation/ (Joi wrapper), permissionCheck.ts, string-utils, crypto, random,
│   │                       #   photoUrl, exportToCSV, timeFormat, dateUtils (see §16 for dead date-utils.ts)
│   ├── context/           # LanguageProvider / LanguageContext / useLanguage — the i18n engine (§11)
│   ├── constants/         # translations.ts — the Hindi dictionary (~12,600 lines), see §11
│   └── di/                # getCacheService() + student-application/profile/training-placement service getters (§15)
├── services/             # index.ts barrel: ApiService (mock), ToastService, PubSubService; + cache/, api/, toast.tsx, pub-sub.ts
├── auth/                 # AuthContext, AuthService, ProtectedRoute, useAuth, LoginPage(+.css) — OIDC-shaped, mocked (§12)
├── types/                # Global `.d.ts` namespaces — see §10
├── mocks/                # index.ts (findMock registry) + academicMocks / employeeMocks / masterMocks / sisMocks
└── public/               # favicon.png, images
```

**Root-level codemod scripts** (`fix_imports.cjs`, `fix_routes.cjs`, `fix_routes2.cjs`,
`generate_pages.cjs`, `update_breadcrumbs.cjs`, `update_indexes.cjs`, `update_portals.cjs`) are
one-off `ts-morph`-based scaffolding scripts used to bulk-generate/patch modules. They are not
part of the runtime and are not wired into any npm script.

## 5. Import aliases

Use bare aliases, not long relative paths. Defined in `tsconfig.app.json` `paths` + resolved at
build by `vite-tsconfig-paths`.

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
| `auth` / `auth/*`         | `src/auth/index.ts` / `src/auth/*`          |
| `types/*`                 | `src/types/*`                               |

There is **no** `components/*` or `new-components/*` alias — reach them via `shared/components/*`
and `shared/new-components`.

## 6. Global styling system

Tailwind v4, **CSS-first**, imported once in `src/index.css` (`@import 'tailwindcss'`). No
`tailwind.config.js` exists — all tokens live in CSS. Two layers of custom properties:

**Layer 1 — `@theme` block** (registers real Tailwind utilities, e.g. `--color-primary` ⇒
`bg-primary`/`text-primary` work as first-class classes):

| Token                                                                                                                                            | Value                                         | Notes                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-primary` / `--color-primary-hover` / `--color-primary-shadow`                                                                           | `#002069` / `#1e56be` / `#041c8a`             | The app's **user-configurable** brand color (deep navy) — see §14. Rewritten at runtime via `document.documentElement.style.setProperty('--color-primary', …)`. |
| `--color-success` / `--color-danger` / `--color-warning` / `--color-info`                                                                        | `#10b981` / `#d1143e` / `#f59e0b` / `#06b6d4` | Semantic status colors                                                                                                                                          |
| `--color-gray-100`…`900`, `--color-blue-500` (`#007bff`), `--color-green-700` (`#057e29`)                                                        | neutral + accents                             |                                                                                                                                                                 |
| `--radius-xs`…`3xl` (`0.25rem`…`2rem`), `--font-size-*`, `--line-height-*`, `--font-weight-*`                                                    | scales                                        |                                                                                                                                                                 |
| `--font-sans`                                                                                                                                    | `'Plus Jakarta Sans', …`                      | App font (Google Fonts)                                                                                                                                         |
| `--color-navy`, `--color-accent`, `--font-display` (`'Sora'`), `--font-inter`, `--shadow-card/-hover/-glow`, `fadeUp`/`fadeIn`/`float` keyframes | marketing sub-theme                           | Scoped to the public portal (§18)                                                                                                                               |

**Layer 2 — `:root` block** (semantic aliases pointing back at Layer 1, plus a full dark set):
`--primary-color`, `--body-bg`, `--main-content-bg` (`#fafafa`), toast gradients, and a **~35-var
`--dark-*` family** (`--dark-bg`, `--dark-surface`, `--dark-card-bg`, `--dark-text`,
`--dark-input-bg`, `--dark-border`, `--dark-navbar-bg`, `--dark-dropdown-*`, …) consumed by a
large hand-written `.dark …` PrimeReact-override block later in the file.

**Dark mode** is a Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` keyed off a
`.dark` class on **`document.body`** (not `<html>`), toggled by the header and persisted to
`localStorage['theme']`. Always add a `dark:` variant alongside any new light-mode color/bg/border.

**Brand literals vs. the token system:** the product brand is Octagon ERP navy (`#002069`). A few
non-token literals exist for specific surfaces — the ERP-section blue `#15398f` (`.bg-erp-section`),
the success green pair `#057e29`/`#263b28`, octagon-selection blues. **There is no
saffron/green institutional tricolor** in this project (that's the sibling DAVV build). For
app chrome use `--color-primary` via `bg-primary`/`text-primary`; don't invent new literals.

**No inline styles** except a value genuinely computed at runtime that cannot be a static class
(e.g. `ProgressBar`'s `width: ${pct}%`, `Grid`'s per-column `width` via PrimeReact's `<Column>`
API, the theme-color swatch's `backgroundColor`). Tailwind's own docs endorse `style={{}}` for
exactly that case. All-static inline styles (`style={{ display:'flex' }}`) are dead weight to
convert to utilities, not a pattern to copy.

## 7. Routing & navigation

`features/index.tsx` is the root route tree:

```
cms/*                       → Public marketing portal (PublicPortalLayout, lazy: Home/Solutions/About/Contact/Grievance)
public/*                    → placeholder
login                       → LoginPage (public)
callback                    → UniversityLoader (OIDC callback shell)
admission-portal/*          → AdmissionPortal (standalone, OUTSIDE MainLayout)
/*  (ProtectedRoute)
  ├── home/*                → Home shell (service-tile menu / sub-menu), OUTSIDE MainLayout
  └── /* (MainLayout)       → ~52 domain module routes; index → <Navigate to="/home">
```

`config/menu-routes.ts` (`menuConfig` + `useMenu()`) is the **entire** navigation/sidebar tree —
a 3-level structure (category grouping → module/portal → page leaf) under **10 top-level
categories**: _Student Lifecycle, HRMS, Academic Centre, Examination Hub, Student Services,
Finance, Campus Facilities, Governance, Auxiliary Services, Other_. Each leaf (`Menu.MenuItem`)
carries `label`, `icon` (Material Symbols name), `colorScheme` (blue|purple|gray|green|orange|red|
pink|teal|indigo|amber), `path`, `description`, optional `navigationStyle` (`'sidebar'|'tabs'`),
and an optional `feature`/`action` RBAC pair (see §13). `useMenu()` filters the tree by permission
and drops any parent left with zero visible children.

**Portal selector pages** render full-width with **no sidebar**. `MainLayout.tsx` holds a
hardcoded `PORTAL_PATHS` array (~65 exact route strings); `isPortalPath()` exact-matches the
current pathname to suppress the sidebar and module-tab logic. **This list is manually maintained**
— a new portal route silently renders _with_ a sidebar until someone appends it here. All current
entries resolve to live routes (not stale), but the list is fragile by design.

## 8. Feature module anatomy

Two patterns coexist — pick based on which the module already uses:

**A. React-Query-backed CRUD** (the majority — ~123 `api.ts`/`queries.ts` pairs):

```
index.tsx      # <Routes> for the module
urls.ts        # URL builder object (root, create, edit(id))
pages/         # List.tsx, Create.tsx, Edit.tsx, Dashboard.tsx, …
components/    # <Entity>Form.tsx + form.hook.ts (Joi schema + useAppForm)
api.ts         # <Entity>Api object → ApiService.getList/get/post/put/del against a string root (e.g. 'cms/courses')
queries.ts     # React Query hooks (xKeys, useXQuery, useCreateXMutation, … with invalidateQueries)
mockdata.ts    # seed data (also registered in src/mocks or src/features/mocks for findMock)
```

> **This is still 100% static.** `api.ts` calls `ApiService`, which is a mock (§15) — the
> React Query layer wraps a fake network. Page-level save handlers additionally fire
> `ToastService.success(...)` to simulate the write.

**B. Pure static** (e.g. `alumni-management/`, `academics/`, `civil-infrastructure/`): no
`api.ts`/`queries.ts`, no React Query. Pages import a `data.ts`/`mockData.ts` array directly;
create/edit/delete handlers only fire a `ToastService` toast. Use this for genuinely static
reference/demo screens; use pattern A to simulate a real backend round-trip.

Representative pattern-A module: `src/features/cms-management/courses/`
(`CourseApi` → `courseKeys`/`useCoursesQuery`/`useCreateCourseMutation`, `components/CourseForm.tsx`,
`pages/List.tsx`). Representative pattern-B: `src/features/alumni-management/` (imports
`data/mockData.ts` directly).

## 9. Shared UI library

Two folders. Prefer **`new-components`** for page composition.

- **`shared/components/`** (base primitives, barrel-exported _per subfolder_, no top-level index):
  `buttons/` (`Button`, `ButtonPanel`, `LinkButton`, `StatusButton`), `forms/` (21 controls, §below),
  `grid/` (`Grid` = PrimeReact DataTable wrapper + re-exported `Column`/`ColumnGroup`/`Row`),
  `panels/` (`AlertPanel`, `Card`, `InputPanel`, `Page`, `PageHeader`), `popups/` (`ConfirmDialog`,
  `Modal`), `progress/` (`Loader`, `SkeletonLoader`, `UniversityLoader`), `layout/`
  (`MainLayout`, `MainHeader`, `Footer`, `BottomNav`, `TopmostBar`), `workspace-layout/`
  (`WorkspaceNavbar`, `WorkspaceTopBar`, `WorkspaceHeader`, `WorkspaceFooterBar/Nav`,
  `ThemeSettingsSidebar`), `Icon/`, `Tiles/`.

- **`shared/new-components/index.ts`** (single barrel — **preferred**): `ActionOverlay`,
  `Breadcrumb`, `BulkSelectTable`, `ConfirmDialog`, `FormActions`, `FormCard`, `FormGrid`,
  `FormPage`, `FormPopup`, `GenericDataTablePage`, `GridPanel`, `InlineCreatePanel`,
  `PaymentDialog`, `PortalSelector`, `PreviewField`/`PreviewSection`/`PreviewSummary`,
  `ProgressBar`, `ReceiptDialog`, `Sidebar`, `SkeletonLoader`, `StatCard`, `StatusBadge`,
  `Stepper`, `Tabs`, `UploadValidationTabs`, `WaffleMenu`.

Canonical **list page**:

```tsx
<FormPage title="…" description="…">        {/* shell: heading + auto Breadcrumb + back button */}
  <FormCard>
    <GridPanel data={rows} columns={[{ field, header }, …]} onEdit={…} onRemove={…}
      toolbar={<Button label="Create" icon="plus" variant="primary" onClick={…} />} searchBox />
  </FormCard>
  <FormPopup visible={…} onHide={…} title="…">…</FormPopup>   {/* create/edit modal */}
</FormPage>
```

Canonical **form** (`<Entity>Form.tsx` + `form.hook.ts`):

```ts
// form.hook.ts — Joi via the shared wrapper
const schema = validation.create<T>(o => ({
  name: o.string().required().label('Name'),
}));
export const useEntityForm = defaultValues =>
  useAppForm<T>({ resolver: validation.resolver(schema), defaultValues });
```

```tsx
// Form.tsx — controls bind control-based (register returns { control, name })
<form onSubmit={handleSubmit(onSubmit)}>
  <FormGrid columns={2}><TextBox label="Name" {...register('name')} required /></FormGrid>
  <FormActions isEditMode={…} isLoading={…} onSave={handleSubmit(onSubmit)} onReset={reset} />
</form>
```

**Form controls** (`shared/components/forms/`, barrel): `Captcha`, `Checkbox`, `CheckboxList`,
`DatePicker`, `Declaration`, `DropDownList`, `FileUpload`, `FormSubSection`, `FormWizard`,
`InputBlock`, `MaskedBox`, `MultiSelectList`, `NumberBox`, `OtpModal`, `PasswordBox`, `PickList`,
`RadioButtonList`, `Switch`, `TextArea`, `TextBox`, `TimePicker`. All built around `InputBlock`
(label/error wrapper) and React Hook Form's `Controller`. **`useAppForm`** (`shared/hooks/form.ts`)
wraps `useForm`, hides native `register`, and returns a custom `register(key) → { control, name }`.

## 10. Global TypeScript namespaces

Declared as global `namespace`s (no import needed). **Infra:** `Api`/`Events`
(`src/services/types.d.ts`), `Forms` (`Forms.SubmitFunc`/`FetchDataFunc`), `Controls`
(`GridProps`/`ColumnProps`/`FormProps`/`InputBlockProps`, split across `forms/types.d.ts` +
`grid/types.d.ts`), `Data`, `Menu` (`Menu.MenuItem`), `User`. **Domain:** `UserManagement`,
`Cms`, `AffiliationManagementSystem` + `AffiliationMaster`, `CareerAdvancement`,
`EmployeeManagement`, `HostelManagement`, `ResearchManagement`,
`ResidentialAllocationManagement`, `Examination`, `SIS`, `Master` (+ nested `Scheme`/`Other`/
`Grant`/`Employee`/`SubjectMaster`/`HR`), `CollegeMaster`.

All domain namespaces are **currently referenced** by live features (verified) — unlike the
sibling DAVV build, there are no dead namespaces here (nothing was removed). One naming quirk:
`UserManagement` has no top-level `user-management/` feature folder — it lives under `master/`.

Example: `function handleSubmit(data: UserManagement.UserForm) {…}` — no import for the type.

## 11. Internationalization (i18n)

Two-language (English/Hindi), and the mechanism is **not** the usual `t('key')` pattern — it is a
**runtime DOM `MutationObserver` string-replacement engine**. Understand it before touching any
user-facing copy:

- `shared/context/LanguageProvider.tsx` holds `language: 'en'|'hi'` (persisted to
  **`sessionStorage['app_language']`**, default `'en'`), wrapping the whole app (inside
  Auth/Query/Router). When `language==='hi'`, a `useEffect`:
  1. Builds word-boundary regexes for every `hi` key, **sorted longest-first** (so `"Examination"`
     wins over `"Exam"`), with alpha lookbehind/lookahead guards.
  2. Walks **text nodes** + `placeholder`/`title`/`alt` attributes of `document.body`, replacing
     any exact English substring with its Hindi value (stashing originals on the node).
  3. Installs a `MutationObserver` (`childList`+`subtree`+`characterData`) that translates
     newly added/changed nodes — **disconnecting itself during its own writes** to avoid loops.
  4. Switching back to `'en'` restores the stashed originals and disconnects.
     Icon guards skip PrimeIcons/Material Symbols/FontAwesome so ligatures aren't mangled.
- `shared/constants/translations.ts` — `{ en: {}, hi: { 'Exact English string': 'हिन्दी', … } }`.
  **The `en` dict is empty** (English is the source text). The `hi` dict is enormous (~12,600
  lines), keyed by the **exact English text as it appears in the DOM**.
- The context also exposes a `t(key)` function, but **nothing calls it** — every consumer uses
  only `language`/`toggleLanguage`/`setLanguage`. Translation is 100% DOM text-swapping.
- **Practical consequence:** write plain English in JSX (no keys, no wrappers), then add a `hi`
  entry keyed by the verbatim English string. If that exact string (or a JSX text-node _fragment_
  of it — a heading split as `"Foo " + <span>Bar</span>` translates as two independent lookups)
  has no `hi` entry, it silently stays English on toggle. Keep a translatable sentence as one
  text node. Language is toggled from `WorkspaceHeader` (EN/हिं), `LoginPage`, and
  `ThemeSettingsSidebar`.

## 12. Auth

`auth/` is **OIDC-shaped but fully mocked** — no real IdP. `AuthService.ts` returns a hardcoded
`mockUser` ("Admin User", fake tokens); `signinRedirect`/`getUser`/etc. are stubs.
`AuthContext`/`AuthProvider` gates on **`localStorage['static_logged_in'] === 'true'`**, hardcodes
`permissions = { Student, Admin, HRMS: ['read','write','delete'] }`, and exposes `{ user,
authenticated, isLoading, permissions, login, logout }`. `LoginPage.tsx` **accepts any
credentials** (prefilled `admin`/`admin`, 800ms fake delay → `login()` → `/home`); forgot-password
and "University SSO" are cosmetic. `ProtectedRoute` shows `UniversityLoader` while loading, else
renders children or `<Navigate to="/login">`.

## 13. Navigation & RBAC

Each `menu-routes.ts` leaf can carry a `feature` + `action` pair (Casbin-style key, e.g.
`@employee-management/dashboard` + `read`) checked by `shared/utils/permissionCheck.ts`'s
`hasPermission()`, which `useMenu()` applies before rendering. **RBAC is scaffolded but inert:**
`hasPermission()` is stubbed to **always `return true`** ("for the static frontend showcase, we
bypass permissions to show all pages"), so the full menu always renders. The `feature`/`action`
metadata is in place and gating could be reactivated by implementing `hasPermission`.

## 14. Runtime theme color

The header cog (Customization Engine, §14a) → `ThemeSettingsSidebar.changeThemeColor()` runs
`document.documentElement.style.setProperty('--color-primary', color)` and saves
`localStorage['themeColor']`; `WorkspaceHeader` re-applies it on mount. Nine presets in
`PREDEFINED_COLORS` (Default Blue `#002069`, Dark Teal, Dark Gold `#82660b`, Dark Green `#263b28`,
Deep Purple, Orange `#772500`, …). This is a **direct CSS-var write**, not an event (contrast §14a).

## 14a. The Customization Engine (window CustomEvent bus)

`shared/components/workspace-layout/ThemeSettingsSidebar.tsx` (opened from `WorkspaceHeader`'s cog)
is a PrimeReact `Sidebar` titled "Customization". Every control persists to `localStorage` **and**
broadcasts a `window.dispatchEvent(new CustomEvent(...))` that layout components listen for via
`addEventListener`. This is an implicit cross-file contract with no central registry — **if you
add a broadcast-driven setting, document it here:**

| Setting         | localStorage key     | Event name                    | Detail type                         | Consumed by                                                   |
| --------------- | -------------------- | ----------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| Theme color     | `themeColor`         | — (direct CSS-var write)      | —                                   | `--color-primary` (§14)                                       |
| Dark mode       | `theme`              | — (direct `.dark` on body)    | —                                   | `document.body.classList`                                     |
| Top Navbar      | `showTopNavbar`      | `toggle-top-navbar`           | `boolean`                           | `WorkspaceLayout.tsx`                                         |
| Desktop Sidebar | `showDesktopSidebar` | `toggle-desktop-sidebar`      | `boolean`                           | `WorkspaceLayout.tsx`                                         |
| Sidebar Style   | `sidebarLayoutType`  | `change-sidebar-layout-type`  | `'detached'\|'flat'`                | `WorkspaceLayout.tsx` (`.layout-*` class)                     |
| Sidebar Fill    | `sidebarBgType`      | `change-sidebar-bg-type`      | `'default'\|'primary'`              | `WorkspaceLayout.tsx` (`.sidebar-bg-*`)                       |
| Layout Width    | `layoutWidth`        | `layout-width-changed`        | `'fluid'\|'boxed'`                  | `WorkspaceLayout.tsx` (`.layout-boxed`)                       |
| Header Behavior | `headerBehavior`     | `header-behavior-changed`     | `'sticky'\|'static'`                | `WorkspaceLayout.tsx`                                         |
| Sidebar Mode    | `sidebarMode`        | `global-sidebar-mode-changed` | `'expanded'\|'collapsed'\|'hidden'` | `shared/new-components/Sidebar.tsx` (**not** WorkspaceLayout) |

**Related layout events on the same window bus** (different sources): `toggle-sidebar-collapse`
(header hamburger ≥1024px → `Sidebar` flips collapse, rewrites `sidebarMode`, re-emits
`global-sidebar-mode-changed`); `toggle-mobile-sidebar` (hamburger <1024px → `WorkspaceLayout` +
legacy `MainLayout`); `sidebar-mode-changed` + `request-sidebar-status` (a request/response
handshake between `MainLayout` and `WorkspaceLayout`). This `window` bus is **separate** from the
app-level `PubSubService` bus (§15).

## 15. Services & data layer

- **`ApiService`** (`services/api/`) — a **MOCK HTTP client.** All reads route through
  `mockRequest` → `findMock(url)` (from `src/mocks`) with a 500ms fake delay; `post/put/patch/del`
  just `console.log` the payload and return the mock lookup. Surface: `get`, `getList`, `post`,
  `put`, `del`, `patch`, `*FormData`, `getFile` (empty `Blob`), `setApiRoot`/`getApiRoot`.
- **`ToastService`** (`services/toast.tsx`) — `setToastRef`, `success(msg)`, `error(msg|string[],
title?)`. **Only success + error** (no `warn`/`info`). Ref registered in `App.tsx`. This is the
  primary "simulate a successful mutation" mechanism (~349 call sites).
- **`PubSubService`** (`services/pub-sub.ts`) — app-level singleton event bus
  (`subscribe`/`unsubscribe`/`publish`, typed to `Events.Event`). `App.tsx` subscribes to
  `@event/api-error`, `@event/api-validation-error`, `@event/api-not-ok` → all `ToastService.error`.
  **Separate from the window CustomEvent bus (§14a).**
- **Cache** (`services/cache`, alias `services/cache`) — `ICacheService` (`get`/`set`/`remove`/
  `clear`), impls `LocalStorageCacheService` + `InMemoryCacheService`, and `CacheKeys` (const map:
  `STUDENT_APPLICATION_DRAFT`, `STUDENT_SUBMITTED_APPLICATIONS`, `STUDENT_PROFILE`, `TP_SEED_DATA`).
- **DI container** (`shared/di`) — lazy singletons `getCacheService()`,
  `getStudentApplicationService()`, `getStudentProfileService()`, `getTrainingPlacementService()`,
  `resetServices()`. Wires feature `Static…Repository` classes into feature services — the closest
  thing to "real" persistence in the app (localStorage-backed, e.g. the student application draft).

## 16. Known technical debt (accurate as of last verification)

- **`npm run type-check` is a no-op** (root `tsconfig.json` has `"files": []`) — use `npx tsc -b`.
- **ESLint doesn't cover the app.** `eslint.config.js` only matches `**/*.{js,jsx}` with a single
  `no-unused-vars` rule; the `.tsx` source is unlinted. Real safety comes from TS strict + `tsc -b`.
- **Duplicate route:** `affiliation-management-system/*` is registered **twice** in
  `features/index.tsx` (~line 162 and ~line 328). Harmless (same element) but dead weight.
- **Empty stub:** `src/features/hrms/` — `index.tsx` and `urls.ts` are both **0 bytes**; not
  routed anywhere (only referenced as the menu slug `'hrms'`).
- **Orphan module:** `src/features/students/` (`StudentsFeature` + `pages/Students.tsx`) is not
  imported anywhere. Distinct from the live `student-management/` and `student-lifecycle/` modules.
- **Path↔dir mismatches:** route `payroll-management/*` → dir `payroll/`; route
  `content-federation/*` → dir `content-federation-system/`.
- **Dead util:** `shared/utils/date-utils.ts` has **zero imports** (fully dead); a near-duplicate
  `shared/utils/dateUtils.ts` is imported in exactly one place. Both are `moment`-based `formatDate`.
- **Duplicated components** across layers: `ConfirmDialog` and `SkeletonLoader` exist in both
  `components/` and `new-components/`. Feature code should consume the `new-components/` versions.
- **`PORTAL_PATHS`** (~65 entries in `MainLayout.tsx`) is a hand-maintained list — not stale today,
  but a new portal route silently renders with a sidebar until manually appended.
- **`cms-management`** is reachable only nested under `/master/cms-management/*`, not as a
  top-level route.
- **Root `*.cjs` codemod scripts** are one-off scaffolding tools, not runtime code.

## 17. State management

`Zustand` is present but used only as a handful of **feature-scoped** stores, not a global store:
`features/student-lifecycle/store/useLifecycleStore.ts`,
`features/payroll/store/usePayrollStore.ts`, `features/master/admission-fee/store/useFeeStore.ts`.
Server/data state is React Query (over the mock API); most other state is local component state.

## 18. Public marketing portal & other DOM-global behaviors

- **`features/public-portal/`** (the `cms/*` routes, `PublicPortalLayout`) is a marketing site
  layered with DOM-global hooks: `useLenis` (Lenis smooth scroll), `useScrollReveal`
  (IntersectionObserver at threshold 0.1 adding `.visible` to `.reveal*` elements), `useGSAPAnimations`.
  It toggles a `public-portal-active` class on **both `<html>` and `<body>`** to override global
  `overflow`/`user-select`, and uses `sessionStorage['octagon_intro_seen']` (preloader gate) and
  `sessionStorage['just_logged_out']` (post-logout redirect).
- **Dark-mode `MutationObserver`s:** `shared/new-components/Sidebar.tsx` and the `new-components`
  `SkeletonLoader` each observe `document.body`'s `class` attribute to keep an `isDark` flag in
  sync with the body-class dark-mode mechanism (§6) rather than reading a context.
- **Cross-tab localStorage store:** the entire `features/civil-infrastructure/**` module (admin/
  engineer/finance, ~11 pages) persists shared state to `localStorage` keys (`civil_works`,
  `civil_ra_bills`, …) and re-hydrates via the native `window` `storage` event — a poor-man's
  shared store across pages/tabs. Treat those keys as a cross-page contract.

---

_Last verified against the codebase: 2026-07-11._
