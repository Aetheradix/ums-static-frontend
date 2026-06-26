# UMS Static Frontend - AI Development Rulebook

> **CRITICAL INSTRUCTION FOR ALL AI AGENTS & DEVELOPERS:**
> You MUST read and strictly adhere to this document before generating any code, creating new pages, or adding features to this repository. Failure to follow these rules will result in rejected pull requests.

## 1. Core Development Philosophy

This project is built for scale (50-100 developers contributing simultaneously). To maintain sanity, performance, and a cohesive user experience, we adhere to **100% Component Reusability**.

- **No Duplication:** Never write inline or localized UI logic (buttons, cards, tables, layouts) inside a specific page if a generic version exists or could exist.
- **Visual Consistency:** The styling and layout MUST remain completely identical to the existing static pages.

## 2. The "Shared Component-First" Workflow

Whenever you are tasked with creating a new page or adding a feature, you MUST follow this workflow in exact order:

### Step 1: Analyze & Break Down

Analyze the requested page layout. Break it down into fundamental UI elements (e.g., Page Header, Data Table, Form Layout, Sidebar, Status Badge).

### Step 2: Search `src/shared/`

Before writing _any_ new UI code in the `src/features/` directory, thoroughly search `src/shared/` and its subdirectories (`components`, `layouts`, `ui`, etc.) for existing components that match the required elements.

### Step 3: Build Shared First (If Missing)

If a required UI element (or a "big feature" block) does not exist in `src/shared/`:

1. **DO NOT** build it inside the feature's specific folder.
2. **DO** build it as a highly reusable, generic component inside `src/shared/`.
3. Ensure the new shared component relies on props for all specific data, avoiding any hardcoded business logic.

### Step 4: Compose the Page

Once all necessary building blocks exist in `src/shared/`, navigate to `src/features/<feature-name>/`.
Compose the new page **strictly by importing and assembling the shared components**. The files in `src/features/` should contain business logic, data fetching (React Query), state management, and component composition—**NOT raw HTML/Tailwind styling for generic UI elements.**

## 3. Directory Structure Rules

- **`src/shared/`**: The single source of truth for UI. Contains generic buttons, inputs, layout wrappers, data tables, typography, and standard modal wrappers.
- **`src/features/`**: Contains domain-specific modules (e.g., `students`, `hrms`). Pages here act as "Controllers" that wire data to the views (Shared Components).

## 4. Styling & Layout Guidelines

- **Frameworks:** We use **Tailwind CSS v4** and **PrimeReact**.
- **PrimeReact Priority:** Always prefer using a PrimeReact component (styled with Tailwind via classNames or pass-through if configured) over building a complex interactive element from scratch.
- **No Inline Styles:** Do not use `style={{ ... }}`. Use Tailwind utility classes exclusively.
- **Design Tokens:** Respect the established semantic color palettes and spacing variables found in the global CSS (`index.css` or Tailwind config).

## 5. Routing and Portal Selectors

When configuring the navigation structure in `src/config/menu-routes.ts` and `src/shared/components/layout/MainLayout.tsx`, observe these strict rules:

- **Portal Landing Pages:** Top-level modules that have complex bifurcations (like Employee Services splitting into HR Admin and ESS) should act as "Portal Selectors".
- **Bypassing the SubMenu Grid:** To make a top-level menu item bypass the default sub-menu grid and go straight to a custom Portal Selector page, you MUST assign a direct `path` property to the parent item in `menu-routes.ts` (e.g., `path: '/employee-management'`).
- **Hiding the Sidebar:** Portal landing pages must render full-width without the sidebar. Any new portal landing path MUST be added to the `PORTAL_PATHS` array inside `MainLayout.tsx` (e.g., `'/employee-management'`). This ensures the sidebar and mobile drawer toggle are completely hidden on that screen.
- **Deep Sidebar Matching:** `MainLayout.tsx` computes sidebar tabs by finding the deepest parent whose children contain a direct match to the current route. Ensure nested children in `menu-routes.ts` correctly define their `path` relative to their module so the sidebar resolves the exact specific feature group (like EMS vs ESS).

## 6. Enforcement Checklist for AI

Before concluding a task, verify:

- [ ] Did I check `src/shared/` before creating a new UI element?
- [ ] Are all generic UI elements used on this new page imported from `src/shared/`?
- [ ] Is the page visually identical in layout and typography to existing pages?
- [ ] Are there zero inline styles?
- [ ] For new modules, did I add them to `PORTAL_PATHS` in `MainLayout` if they need a full-width selector view without a sidebar?

**END OF RULES**
