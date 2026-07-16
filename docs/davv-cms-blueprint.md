# DAVV University CMS — Design Blueprint

> **Status:** Phase 1 **IMPLEMENTED & verified** (2026-07-11) — the Select-University entry, DAVV landing, directory, and institution login are live at `src/features/davv/`. **Base is a top-level `/davv` tenant** (Octagon stays `/octagon-cms`); URLs written as `/octagon-cms/davv/…` in the diagrams below predate this decision — read them as `/davv/…`. This is the spec for a **DAVV University CMS**
> built as a natural extension of the existing **Octagon** product — _not_ a redesign of Octagon.
> Companion to the `User_Management_Navigation_Blueprint` (the "Select University → Type →
> Institution → Login" flow) and grounded in research of the live DAVV site (`dauniv.ac.in`).

---

## 0. Scope, constraints & the one decision to lock

**What we are NOT touching.** Octagon's theme, branding, color system (`--color-primary` navy
`#002069`), typography (Plus Jakarta Sans / Sora / Inter), the public-portal layout, `Navbar`,
`Footer`, and global styling stay **exactly as-is**. The DAVV CMS _inherits_ that design language.

**The only change inside Octagon** is a new **"Select University"** entry point (§5).

**Everything after selecting DAVV** is the new DAVV CMS (§6–§8), composed almost entirely from
components that already exist in the repo (§9).

### The URL base (resolved & implemented)

Octagon stays at **`/octagon-cms`** (unchanged). DAVV is a **top-level tenant at `/davv`** — not
nested under `/octagon-cms`. Implemented routes: `/davv`, `/davv/campuses`,
`/davv/:type/:institution`. The Select-University screen stays on the Octagon side at
`/octagon-cms/universities`. (Diagrams further below still show `/octagon-cms/davv/…` — read them
as `/davv/…`.)

### The one open decision — institution URL scheme ⚠️

Your two source documents disagree, so this is the single thing to confirm before build:

| Source                   | Scheme                                                  | Example                          |
| ------------------------ | ------------------------------------------------------- | -------------------------------- |
| Navigation Blueprint PDF | `…/davv/{type}/{institution}` (type is its own segment) | `/octagon-cms/davv/utd/iet`      |
| This brief               | `…/davv/{institution-slug}` (type folded into the slug) | `/octagon-cms/davv/davv-iet-utd` |

**Recommendation: the type-as-segment scheme** (`/octagon-cms/davv/utd/iet`). Rationale:

- The **entire premise is that the institution _type_ drives access scope** after login. Making
  `{type}` an explicit path segment means the access guard, breadcrumb, and analytics can read the
  scope straight off the URL — no slug parsing, no lookup table.
- It's cleaner and non-redundant (`davv-iet-utd` repeats "davv", which is already in the path).
- It scales predictably: `/octagon-cms/{university}/{type}/{institution}`.

The IA and data model below are **URL-scheme-agnostic** (the `Institution` record always carries
`type`), so if you prefer the flat slug it's a routing tweak, not a redesign. **This doc assumes
the recommended scheme.**

---

## 1. User journey (Deliverable 2)

One continuous path, understandable at a glance — for **any** university, with DAVV as the worked
example:

```
Octagon marketing home                 Select University            DAVV CMS landing
/octagon-cms                    ──►     (search + cards)     ──►     /octagon-cms/davv
(unchanged, + 1 CTA)                    pick DAVV                     university-specific portal
                                                                            │
                                                                            ▼
   Dashboard              Institution login          Campus / Institution directory
   (scoped by type)  ◄──  /octagon-cms/davv/    ◄──  browse by campus / type / faculty,
   modules gated         utd/iet  (branded login)     or search "IET"
```

Two personas enter differently, both supported:

- **Directed** (a student who knows their institution): global search on the DAVV landing → type
  "IET" → jump straight to the IET login.
- **Exploratory** (an applicant/visitor): DAVV landing → Campus Directory → filter by
  Takshashila / UTD → pick institution → login.

---

## 2. Complete page hierarchy (Deliverable 1)

```
/octagon-cms                                  ● Octagon home (UNCHANGED) + "University Login" CTA
├── /octagon-cms/universities                 ○ NEW — Select University (search + cards)   [only Octagon addition]
│
└── /octagon-cms/davv                         ◆ DAVV CMS — landing (the university portal home)
    ├── /octagon-cms/davv/campuses            ◆ Campus & Institution Directory (faceted: campus · type · faculty · search)
    │   ├── ?campus=takshashila|nalanda|avanti
    │   ├── ?type=utd|constituent|affiliated
    │   └── ?faculty=…
    │
    ├── /octagon-cms/davv/{type}/{institution}  ◆ Institution gateway → branded LOGIN
    │        e.g. /octagon-cms/davv/utd/iet, /octagon-cms/davv/affiliated/pimr
    │        └── → (post-login) Dashboard  [existing app, domain-scoped by {type}]
    │
    ├── /octagon-cms/davv/notices             ◆ Notice Board (filterable, categorized)  [replaces PDF lists]
    ├── /octagon-cms/davv/news-events         ◆ News & Events
    ├── /octagon-cms/davv/results             ◆ Results & Marksheets hub (deep-links MP Online)
    ├── /octagon-cms/davv/admissions          ◆ Admissions hub (CUET / DET / Direct / ODL)
    ├── /octagon-cms/davv/services/students   ◆ Student Services hub (persona lane)
    ├── /octagon-cms/davv/services/academic   ◆ Academic Services hub
    ├── /octagon-cms/davv/services/admin      ◆ Administrative Services hub
    └── /octagon-cms/davv/about               ◆ About DAVV (structure, campuses, leadership)

● unchanged Octagon   ○ new, inside Octagon   ◆ new DAVV CMS
```

**Phase 1 (core flow, build first):** landing (`/davv`), directory (`/davv/campuses`), institution
gateway/login (`/davv/{type}/{institution}`), plus the Octagon `Select University` addition.
**Phase 2:** Notice Board, Results, Admissions, the three Service hubs. **Phase 3:** the
type → domain access wiring (handover to User Management).

---

## 3. URL structure & navigation flow (Deliverable 5)

```
/octagon-cms                                   Octagon product portal (all universities)
    → /octagon-cms/universities                Select University (DAVV, RGPV*, BU* … *placeholders for scale)
        → /octagon-cms/davv                    DAVV CMS home
            → /octagon-cms/davv/campuses       Directory (search + facet browse)
                → /octagon-cms/davv/utd/iet    Institution → scoped login
                    → Dashboard                Existing app, modules gated by {type}
```

**Breadcrumb (persistent from `/davv` down):** `Octagon › DAVV › UTD › IET › Login`.

**Rules that keep it scalable & consistent:**

- `{university}` and `{type}` and `{institution}` are all slugs; `{type} = utd | constituent |
affiliated`.
- **Campus is metadata, never a URL segment.** Takshashila / Nalanda / Avanti are _filters_ on the
  directory, not levels in the path — an institution's campus lives on its data record. (This is why
  you can "browse by campus" yet still land on a stable `…/utd/iet` URL.)
- Every DAVV route is a child of `/octagon-cms/davv`, so a second university (`/octagon-cms/rgpv`)
  slots in with zero structural change.

---

## 4. Information architecture (Deliverable 3)

### 4.1 The core reframe — task/persona-centric, not org-chart-centric

The **single biggest improvement** over the live DAVV site: today its top nav is an org chart
(About, UTDs, Affiliated Colleges, Results, IQAC, AISHE…), and core student tasks are buried under
"Affiliated Colleges" or a footer link. The CMS reorganizes around **who you are and what you came
to do.**

**Primary persona lanes (top-level IA of the DAVV CMS):**

| Lane                  | Who                                   | Anchor tasks                                                                                                                             |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Students**          | Enrolled students                     | SIS login, exam form, results/marksheet, revaluation, certificates, fee payment, scholarships, syllabus, timetable, e-content, grievance |
| **Applicants**        | Prospective students                  | Programmes, CUET/DAVV-CET, DET (PhD), Direct/Merit admission, ODL (CDOE), fee/eligibility                                                |
| **Faculty & Staff**   | University employees                  | Department portals, HRDC/MMTTC, recruitment/rosters, research (RDC), internal services                                                   |
| **Colleges**          | Affiliated/constituent college admins | Affiliation, result-upload schedules, exam notices, MP-Online activities, directories                                                    |
| **Public / Visitors** | Everyone else                         | About, campuses, notices, tenders, RTI, statute/ordinance, contact                                                                       |

### 4.2 Service taxonomy (drives the three Service hubs + landing tiles)

| Group                       | Services (grounded in the real DAVV service set)                                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Student Services**        | Student Information System (SIS) · Exam Form · Results & Marksheets · Re-totaling / View Answer Book / Revaluation · Certificates (Degree, Migration, Provisional, Duplicate Marksheet, Transcript, WES) · Fee Payment · Scholarships (NSP) · ID / ABC-ID / APAAR / DigiLocker · Grievance Redressal |
| **Academic Services**       | Programmes Catalog · Departments (UTDs) · Academic Calendar · Syllabus · Time Tables (UG/PG) · Exam Notices · NEP/Credit (ABC) · Research & PhD (RDC, Compendium) · e-Content / e-Library (SWAYAM, NPTEL, INFLIBNET)                                                                                 |
| **Administrative Services** | Affiliation (College Development Council) · RTI · Tenders · Recruitment / Careers · Notices & Circulars · Downloads / Forms · Governance (Statute, Ordinance, Regulations, Adhiniyam, Policies) · IQAC / NAAC · AISHE                                                                                |

> **Integration reality (important):** DAVV's _transactional_ services live on external systems —
> **MP Online** (SIS, results, fees, revaluation), **Samarth eGov** (admissions), **CUET/NTA**
> (entrance). The CMS is the **unified, organized launchpad** over these: every tile deep-links to
> the correct destination (or, later, embeds it). The value is a single coherent "front door"
> replacing today's fragmented, PDF-and-external-link scatter — not re-implementing MP Online.

### 4.3 Notices taxonomy (replaces the undifferentiated PDF stream)

Categories: `Exams · Results · Admissions · Scholarships · Tenders · Recruitment · Academic ·
General`. Facets: audience (Students / Colleges / Faculty / Public), campus, date, pinned. Every
notice is a structured record (title, category, audience, date, attachment, link) — **not a bare
PDF link**.

---

## 5. The "Select University" enhancement (the ONLY change inside Octagon)

Non-invasive, additive. Two touch-points, nothing else on the marketing site changes:

1. **A `University Login` nav link in the existing `Navbar`** — added to `NAV_LINKS`, so it matches
   the other nav items (Home / Solutions / … / Raise Grievance) exactly, in both the desktop nav
   and the mobile menu. (Built as a nav link rather than a button pill so it follows the header theme.)
2. **A new route `/octagon-cms/universities`** — the **Select University** screen: a _combined
   search + cards_ layout (your brief's preferred option), reusing the `home/menu` searchable-tile
   pattern.

```
┌───────────────────────────────────────────────── /octagon-cms/universities ──┐
│  [Octagon Navbar — unchanged]                                                  │
│                                                                                │
│     Select your University                                                     │
│     ┌──────────────────────────────────────────────┐                          │
│     │  🔍  Search universities…                     │   ← global search        │
│     └──────────────────────────────────────────────┘                          │
│                                                                                │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│     │  DAVV    │  │  RGPV*   │  │   BU*    │  │  + Add   │   ← university cards  │
│     │  Indore  │  │  Bhopal  │  │  Bhopal  │  │  (onboard)│                     │
│     │  [Enter] │  │ (soon)   │  │ (soon)   │  │          │                     │
│     └──────────┘  └──────────┘  └──────────┘  └──────────┘                     │
│           │                                                                     │
│           └── click DAVV → /octagon-cms/davv                                    │
│  [Octagon Footer — unchanged]                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
   *RGPV/BU are illustrative placeholders that prove the multi-tenant model.
```

Why a dedicated screen rather than editing the home page: it honors _"do not modify anything else"_
— the marketing home gains exactly one nav button; the picker is its own route.

---

## 6. DAVV CMS landing — suggested layout (Deliverable 4)

`/davv`. Reads as a university portal, keeping Octagon's typography/spacing/component structure but
expressing a distinct **DAVV identity**: a dedicated deep-green + saffron palette (`--color-davv*`,
in `@theme`), the real **DAVV crest & wordmark**, and **campus imagery**. Implemented — header/footer
logo, campus-photo hero, green/saffron accents throughout, and a campus-image login panel.

```
┌──────────────────────────────────────────── /octagon-cms/davv ───────────────┐
│  [ University Header ]  DAVV crest · "Devi Ahilya Vishwavidyalaya, Indore"     │
│                         Dhiyo Yonah Prachodayat            [ Campus ▾ ] [Login]│
├───────────────────────────────────────────────────────────────────────────────┤
│  HERO / WELCOME                                                               │
│   "Welcome to DAVV" + one-line intro                                          │
│   ┌───────────────────────────────────────────────┐                           │
│   │ 🔍  Search services, notices, departments…     │  ← GLOBAL SEARCH (hero)   │
│   └───────────────────────────────────────────────┘                           │
│   Quick chips: [Results] [Exam Form] [Admissions] [Notices] [Scholarships]    │
├───────────────────────────────────────────────────────────────────────────────┤
│  FREQUENTLY USED SERVICES            (tiles — persona-tagged, icon + label)    │
│   [SIS] [Exam Form] [Results] [Fee Pay] [Revaluation] [Certificates] [Grievance]│
├───────────────────────────────────────────────────────────────────────────────┤
│  CAMPUS SELECTOR              │  NOTICE BOARD (tabs: All·Exams·Admissions·…)   │
│   ┌─Takshashila (Academic)─┐  │   • 12 Jul  Exam form last date …  [Exams]     │
│   │ 28 UTDs · IET·IIPS·IMS │  │   • 11 Jul  UG results uploaded …  [Results]   │
│   └────────────────────────┘  │   • 10 Jul  CUET counselling …    [Admissions]│
│   ┌─Nalanda (Admin)────────┐  │                             [ View all → ]    │
│   │ VC · Registrar · Econ  │  ├────────────────────────────────────────────────┤
│   └────────────────────────┘  │  NEWS & EVENTS (cards w/ date + thumb)        │
│   ┌─Avanti (Academic)──────┐  │   [Convocation] [Sports Meet] [Research Conf]  │
│   └────────────────────────┘  │                                                │
│   [ Browse full directory → ] │                                                │
├───────────────────────────────────────────────────────────────────────────────┤
│  SERVICES BY AUDIENCE   ▸ Students   ▸ Applicants   ▸ Faculty   ▸ Colleges     │
│   (three columns: Student · Academic · Administrative service groups)         │
├───────────────────────────────────────────────────────────────────────────────┤
│  STATISTICS   30+ Departments · 16 Faculties · 294 Affiliated Colleges · 3 Campuses │
├───────────────────────────────────────────────────────────────────────────────┤
│  [ Octagon Footer — inherited ]                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

Section list satisfied: Welcome, Global Search, Frequently Used Services, Campus Selector, Quick
Navigation (chips), Recent Announcements + Notice Board, News & Events, Student/Academic/
Administrative Services, Statistics.

## 7. Campus & Institution Directory — suggested layout (Deliverable 4)

`/octagon-cms/davv/campuses`. A **faceted directory** — the brief's "campus selector" is really a
unified browse-or-search over institutions, with campus/type/faculty as facets.

```
┌────────────────────────────────────── /octagon-cms/davv/campuses ─────────────┐
│  Breadcrumb: Octagon › DAVV › Directory                                       │
│  ┌─────────────────────────────────────────────┐   Sort: [A–Z ▾]             │
│  │ 🔍  Search institutions (e.g. "IET", "Law") │                             │
│  └─────────────────────────────────────────────┘                             │
│  Filters:  Type [ All · UTD · Constituent · Affiliated ]                       │
│            Campus [ All · Takshashila · Nalanda · Avanti ]                     │
│            Faculty [ Engineering · Management · Law · Science · … ]            │
│  ─────────────────────────────────────────────────────────────────────────    │
│  Recently accessed:  [ IET ]  [ IIPS ]                 ← localStorage-backed   │
│  ─────────────────────────────────────────────────────────────────────────    │
│  UTDs (Takshashila)                                                            │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│   │ IET  ⚙️     │ │ IIPS 💼    │ │ IMS 📊     │ │ SCSIT 💻   │  → typed login   │
│   │ Engineering│ │ Prof.Studies│ │ Management │ │ Comp Sci   │                 │
│   └────────────┘ └────────────┘ └────────────┘ └────────────┘                 │
│   [ School of Law ] [ School of Pharmacy ] [ SJMC ] … [ show all 30+ ]         │
│                                                                                │
│  Constituent Colleges  (small set)     Affiliated Colleges  (~294)  [Search ▸]│
│   ┌────────────┐                        ┌────────────┐ ┌────────────┐          │
│   │ MSDGC      │                        │ PIMR       │ │ Christian… │  …paged  │
│   └────────────┘                        └────────────┘ └────────────┘          │
└───────────────────────────────────────────────────────────────────────────────┘
```

Selecting any card → `/octagon-cms/davv/{type}/{institution}`. Affiliated (~294) is search/
pagination-first (not a wall of cards); UTDs and Constituent are browse-first.

## 8. Institution gateway & login — suggested layout (Deliverable 4)

`/octagon-cms/davv/utd/iet`. The institution's **scoped login**, reusing the existing
`auth/LoginPage` shell with institution branding + breadcrumb. The `{type}` in the URL is captured
into the session for post-login scoping.

```
┌──────────────────────────────── /octagon-cms/davv/utd/iet ────────────────────┐
│  Breadcrumb: Octagon › DAVV › UTD › IET                                        │
│  ┌─────────────────────────────┐   ┌──────────────────────────────────────┐   │
│  │  INSTITUTION PANEL           │   │  LOGIN  (existing LoginPage, scoped)  │   │
│  │  DAVV crest · IET            │   │   Institution: IET — DAVV (UTD)       │   │
│  │  Institute of Engineering    │   │   Username  [___________]             │   │
│  │  & Technology                │   │   Password  [___________]             │   │
│  │  Takshashila Campus          │   │   [ Sign in ]   Forgot password?      │   │
│  │  "The college teaches;       │   │   Help · Support                      │   │
│  │   the university examines"   │   │                                        │   │
│  │  (reach note if Affiliated)  │   │   → success → Dashboard (type=utd)     │   │
│  └─────────────────────────────┘   └──────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────┘
```

For an **Affiliated** institution (`/octagon-cms/davv/affiliated/pimr`), the panel surfaces the
**reach note** ("Exams, results, degrees, curriculum, affiliation") so the limited scope is honest
_before_ login.

---

## 9. Component breakdown (Deliverable 6)

Reuse-first. **REUSE** = ships today; **EXTEND** = light wrapper/props; **NEW** = small net-new,
built in `shared/` per the shared-component-first rule.

| Component (brief)                    | Decision              | Source in repo                                                                      |
| ------------------------------------ | --------------------- | ----------------------------------------------------------------------------------- |
| University Header                    | **NEW** (thin)        | Compose from `shared/components/…/MainHeader` + `Breadcrumb`; DAVV crest as content |
| Global Search                        | **EXTEND**            | `home/menu/ServiceFilters` search + `shared/components/forms/TextBox`               |
| Hero Banner / Welcome                | **REUSE**             | `public-portal/components/sections/home/Hero`, `HeroCanvas`, `SectionTitle`         |
| University cards (Select University) | **EXTEND**            | `home/menu/ServicesGrid` tile + `new-components/Card`                               |
| Campus cards / Campus Categories     | **EXTEND**            | `home/sub-menu/SubMenuGrid` + `new-components/PortalSelector`                       |
| Campus Directory (faceted)           | **EXTEND**            | `new-components/GridPanel` (search/paginate) + `ServiceFilters` facets              |
| Featured / Frequently Used Services  | **REUSE**             | `home/menu/ServicesGrid` + `ServiceFilters`                                         |
| Quick Links / Quick Navigation       | **REUSE**             | `home/menu/AllPagesGrid`, chip row                                                  |
| Announcements / Notice Board         | **NEW** (thin)        | `new-components/Tabs` + `GridPanel` + `StatusBadge` (category chips)                |
| News & Events                        | **EXTEND**            | `new-components/Card` grid; date/thumb                                              |
| Statistics                           | **REUSE**             | `new-components/StatCard` (or public-portal stats block)                            |
| Recently Accessed Campuses           | **NEW** (tiny)        | `shared/hooks/useLocalStorage` + card row                                           |
| Institution Login                    | **REUSE**             | `auth/LoginPage` (scoped by route params)                                           |
| Welcome Banner                       | **REUSE**             | `home/menu/WelcomeBanner`                                                           |
| Motion / scroll polish               | **REUSE**             | `public-portal/hooks/useLenis`, `useScrollReveal`, `useGSAPAnimations`              |
| Footer / Navbar                      | **REUSE (unchanged)** | `public-portal/components/layout/Footer`, `Navbar` (+1 CTA)                         |

**Net-new is tiny:** University Header, Notice Board, Recently-Accessed strip. Everything else is
composition — which is exactly what "extend Octagon, don't introduce a conflicting design language"
requires.

### Data model (static seed — matches the app's static nature)

```ts
University   { id; slug: 'davv'; name; shortName; crest; motto; tagline; stats }
Campus       { id; slug: 'takshashila'|'nalanda'|'avanti'; name; role: 'academic'|'administrative'; address }
Institution  { id; slug; name; shortName; type: 'utd'|'constituent'|'affiliated';
               campusSlug?; faculty?; icon; reachNote? }
Service      { id; label; icon; persona: 'student'|'applicant'|'faculty'|'college'|'public';
               group: 'student'|'academic'|'admin'; href; external?: boolean }
Notice       { id; title; category; audience; date; href; pinned?: boolean }
```

Seed with DAVV: 3 campuses, the ~30 UTDs + 3 institutes, a small constituent set, a sample of
affiliated colleges (the full ~294 arrives via search/paginated data later), and the real service
list. `type` on every `Institution` is what makes the URL scheme (and access scoping) work.

---

## 10. UX improvements over the current DAVV website (Deliverable 7)

Each maps to a concrete pain point the research found on `dauniv.ac.in`:

| #   | Today on dauniv.ac.in                                                                   | In the DAVV CMS                                                                         |
| --- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | **PDF-as-database** (programmes, colleges, results, forms, notices are loose PDFs)      | Structured, **searchable & filterable** data — directory, notice board, results hub     |
| 2   | **Fragmented identity** — SIS (MP Online), Samarth, CUET, CBA forms are separate logins | A single **organized launchpad** ("front door") that deep-links each service in context |
| 3   | **Department/org-chart IA**; core tasks buried under "Affiliated Colleges" / footer     | **Task & persona lanes** (Students / Applicants / Faculty / Colleges / Public) up front |
| 4   | **Notice overload, no taxonomy** — one reverse-chron stream of PDF links                | **Categorized, tagged, filterable Notice Board** with audience + search                 |
| 5   | **Offline/online duplication** (a CBA form _and_ a downloadable PDF for the same task)  | One canonical action per task; the form is the primary, PDF is a secondary download     |
| 6   | **Results = paginated PDF table**, then bounce to MP Online with Roll No./Session       | A **Results hub** that routes cleanly and explains the path; student-friendly           |
| 7   | **No global search** across services/departments/notices                                | **Global search** in the hero + directory                                               |
| 8   | **Two sites + "Beta" + broken TLS chain**; opaque encoded URLs                          | One coherent CMS, clean human-readable routes (`/davv/utd/iet`)                         |
| 9   | **Not mobile-first**; dense desktop tables                                              | Responsive tiles/cards, accessible, keyboard-navigable                                  |
| 10  | **No "recently used"/personalization**                                                  | Recently-accessed campuses/services (localStorage)                                      |

---

## 11. Justification for major design decisions (Deliverable 8)

1. **Extend Octagon, compose don't invent.** The constraint is consistency; the payoff is that ~85%
   of the CMS is existing `public-portal` + `home/menu` + `new-components`. Lower risk, faster,
   visually seamless, and it keeps a single design system.
2. **`/octagon-cms/{university}/{type}/{institution}` with type as a URL segment.** The whole model
   hinges on _type → access scope_; putting type in the path makes scoping, breadcrumbs, and guards
   trivial and self-documenting, and makes multi-university onboarding a copy-paste. (Flagged in §0 as
   the one thing to confirm vs. the brief's flat slug.)
3. **Campus as metadata, not a URL level.** Campuses are _locations_ that host UTDs (confirmed:
   Takshashila academic, Nalanda administrative, Avanti academic). Modeling campus as a facet keeps
   institution URLs stable while still allowing "browse by campus."
4. **Task/persona-centric IA.** The clearest, highest-leverage upgrade over DAVV's org-chart site —
   it matches how real users arrive ("I need my marksheet"), not how the university is structured.
5. **Launchpad over re-implementation.** DAVV's transactions genuinely live on MP Online / Samarth /
   CUET. Honestly presenting the CMS as a unifying front door (deep-links now, embed later) is
   realistic, respects the static-prototype nature of this app, and still fixes the fragmentation.
6. **Directory is search-first for Affiliated, browse-first for UTDs.** ~294 affiliated colleges
   can't be a card wall; ~30 UTDs should be browsable. The layout adapts to the cardinality.
7. **Institution type shown _before_ login** (esp. the Affiliated "reach note"). Sets correct
   expectations and previews the post-login scope — good enterprise UX and honest.
8. **Phased delivery.** Ship the navigation spine (landing → directory → login) first; it's the
   demoable core and the foundation everything else hangs off.

---

## 12. Handover to User Management (post-login)

After login, the existing model applies — **`{type}` becomes the domain**:

```
effective access = role ∩ domain,  filtered by the reach rule
  UTD / Constituent → full reach
  Affiliated        → limited to exams · results · degrees · curriculum · affiliation
```

This plugs into the app's existing RBAC (`shared/utils/permissionCheck.ts` / `useMenu`), which is
currently stubbed to allow-all — so the CMS navigation can be built and demoed now, and the reach
rule activated in Phase 3 without rework.

---

_Design blueprint — grounded in research of dauniv.ac.in (structure + services/IA) and an inventory
of the Octagon codebase. Last updated: 2026-07-11._
