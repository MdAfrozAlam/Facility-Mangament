# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

"Qaydra FM" — a facility-management SaaS admin frontend (assets, planned/reactive maintenance, work orders, reports, organizations/projects/accounts). Next.js 16 App Router + React 19 with the React Compiler enabled (`reactCompiler: true` in `next.config.ts`), MUI 9 (+ X DataGrid / Date Pickers), react-hook-form + zod, axios, chart.js.

## Commands

- `npm run dev` — dev server on **port 3001** (not 3000, despite the README)
- `npm run build` / `npm run start` (start also uses port 3001)
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)
- There is no test framework or test script configured.

Environment variables live in `.env.local` (gitignored): `NEXT_PUBLIC_API_URL` (axios base URL) and `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (login page).

## Architecture

Everything lives under `src/app/` (path alias `@/*` → `src/*`). Code is a mix of TypeScript (routes, layout, sidebar, theme) and plain JSX/JS (feature components, services, schemas, data).

**Routes are thin wrappers.** Each `src/app/admin/(protected)/**/page.tsx` just renders one feature component from `src/app/components/<feature>/`. Put real UI and logic in the component, not the page. `/` redirects to `/admin/login`.

**Layout.** The `(protected)` route group's `layout.tsx` is a client component that renders `Header` + `Sidebar` around page content. There is no route guard or middleware: "protected" is only a layout grouping. Navigation entries (paths, icons, nested groups) are defined in `components/sidebar/Sidebar.tsx`, so add new pages there.

**Feature component pattern** (see `components/organization/Organization.jsx` as the reference implementation):
- MUI `DataGrid` list with shared building blocks from `components/common/` (`PageHeader`, `Breadcrumbs`, `DataTableToolbar`, `DataTableActions`, `ConfirmDialog`, `DialogHeader`, `Loader`)
- Client-side search across the column fields, column visibility, and Excel/PDF export via `utils/excel/` (`exportExcel`, `exportPDF`, `importExcel`, template download/validation for bulk asset registration)
- Add/edit in a dialog subcomponent using react-hook-form + `zodResolver` with a schema from `src/app/schemas/`
- Snackbar feedback; API error text extracted from `error.response.data.message|error`
- Styling with co-located `*.module.css`; global brand tokens are in `globals.css`

**Data: mock vs. API.** Most features still read hard-coded mock data from `src/app/data/*.js`. Only organizations (and login) call the backend so far. Components that are being migrated use a `USE_MOCK_DATA` flag and a `toRow` mapper that normalizes API shapes (e.g. `_id` → `id`, flattening nested `address`) for the grid. When wiring a feature to the API, follow the same approach.

**API layer.**
- `services/api/apiClient.js` — single axios instance (`withCredentials: true`, so auth is cookie-based; the bearer-token and 401-redirect interceptors are deliberately commented out)
- `services/api/apiEndpoints.js` — central `API_ENDPOINTS` map; path params use `:name` placeholders replaced at call time
- `services/<domain>/<domain>Service.js` — per-domain functions returning `response.data`
- Multi-tenancy: login stores `tenantId` in `sessionStorage`; services read it from there (list via `/organizations/tenant/:tenantId`, injected into create payloads). `utils/storage/storage.js` (localStorage token/user helpers) exists but is currently unused.

**Theming.** `theme/theme.ts` defines the MUI theme, including global `MuiDataGrid` style overrides and zebra-row `getRowClassName`. Its colors mirror CSS variables in `globals.css`, so if you change one, update the other. It's applied via `theme/AppThemeProvider.tsx` in the root layout.

## Gotchas

- `components/project/` (single project add form, used by `core/administration/add/project`) and `components/projects/` (projects list) are different components with similar names.
- `tsconfig.json` explicitly lists a couple of `.js`/`.jsx` files in `include`; `allowJs` is on, but most JS files are not type-checked.
- `src/app/config/env.js` is empty.
