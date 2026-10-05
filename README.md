# Nakka

Monorepo for Nakka, built with Yarn 4 workspaces, Turborepo, and TypeScript.

```sh
corepack enable    # once per machine; picks up Yarn 4 from package.json
yarn install
yarn dev           # frontend at http://localhost:3000, backend at http://localhost:8080
```

| Command              | What it does                                          |
| -------------------- | ----------------------------------------------------- |
| `yarn dev`           | Run frontend and backend together                     |
| `yarn ui:dev`        | Frontend only, at http://localhost:3000               |
| `yarn backend:dev`   | Backend only, at http://localhost:8080 (auto-reloads) |
| `yarn ui:build`      | Typecheck and build the frontend to `apps/frontend/dist` |
| `yarn backend:build` | Compile the backend to `apps/backend/dist`            |
| `yarn backend:start` | Run the compiled backend                              |
| `yarn backend:test`  | Run the backend unit tests                            |
| `yarn backend:migrate` | Apply pending database migrations                   |
| `yarn build`         | Typecheck and build everything                        |
| `yarn typecheck`     | Run `tsc` across all workspaces                       |
| `yarn ui:preview`    | Build the frontend, then serve the production output  |

Run a task for a single workspace with `yarn workspace @nakka/frontend <script>` or `yarn turbo run build --filter=@nakka/frontend`.

## Layout

```
apps/
  frontend/               @nakka/frontend — landing page (Vite + React + React Router + Tailwind)
  backend/                @nakka/backend — API server (NestJS + TypeScript)
packages/
  tsconfig/               @nakka/tsconfig — shared base, react-app, and node tsconfigs
  tailwind-config/        @nakka/tailwind-config — shared design tokens as a Tailwind preset
  types/                  @nakka/types — API types shared by frontend and backend (types only)
docs/
  design/                 DESIGN.md and reference images
```

New apps go in `apps/`, shared code in `packages/`. Reference internal packages with `"workspace:*"`.

### apps/frontend

- `src/main.tsx` mounts the app; `src/AppRouter.tsx` defines the routes.
- `src/components/` holds shared components (layout, header, footer, background); `src/constants/` holds the extension ID, install command, and Marketplace URL.
- `src/home/Home.tsx` composes the page: `HeroSection`, `EditorDemo` (an interactive VS Code mock split into `Explorer`, `CodePane`, `AgentPanel`, and `StatusBar`), and `PricingSection`. It also connects the hero's "Try prompting" pills to the demo agent's input.
- `src/components/Login/` is the log in / sign up modal. Any component can open it with `useAuthModal().openAuth("login" | "signup")` from `src/context/`.
- `src/api/` calls the backend at `VITE_API_URL` + `/api` (default `http://localhost:8080`); `src/api-hooks/auth` exports `useAuth()` for the current user plus `login`, `signup`, and `logout`. The session token is kept in `localStorage`.
- Signed-in pages share one shell, `components/DashboardLayout` (sidebar, top bar), configured by `components/UserLayout` for `/dashboard` (Overview, Usage, Settings) and `components/AdminLayout` for `/admin`. Pages live in `pages/dashboard/` and `pages/admin/`.
- The admin pages have their own session (`api/adminSession.ts`, key `nakka.adminToken`), `context/AdminAuthProvider.tsx`, `useAdminAuth()` and the `RequireAdmin` guard; a 401 from any admin call returns to `/admin/login`.
- Shared building blocks: `UsageMeter`, `BarChart` (plain HTML, no chart library), `DataTable`, `StatTile`, `PlanBadge`, `SegmentedControl`; card styles in `styles/card.style.ts`; formatting in `utils/format.ts`.
- The design is a light theme set in the browser's Times serif; the tokens live in `packages/tailwind-config`. `public/` holds static files such as the favicon.
- Every component lives in its own folder:

  ```
  Footer/
    Footer.tsx         the component
    Footer.style.ts    exports `styles`: the root class, any class used more than once, and conditional classes as functions
    index.ts           re-exports the default, so imports stay `components/Footer`
  ```

  One-off Tailwind classes stay inline in the `.tsx`.
- `index.html` and `code.html` are both build entry points for the same app.

Production hosting must serve `index.html` for unknown paths so BrowserRouter can handle direct links. The IDE demo is a static mock. Header links other than Pricing, the footer links, and the pricing buttons are placeholders until those pages exist.

### apps/backend

NestJS 12 (ESM) API, served under `/api` on port 8080.

```
src/
  main.ts                    bootstrap: /api prefix, CORS, validation
  app/
    app.module.ts            root module; GET /api/health lives in app.controller.ts
    common/
      config/                app.config.ts (PORT, CORS_ORIGINS)
      database/              Postgres pool (DATABASE token) and table names (TABLES)
      pipes/                 request-body validation
      crypto/                secret-box.ts: AES-256-GCM for provider keys
    features/
      auth/                  POST /api/auth/signup, POST /api/auth/login,
                             GET /api/auth/me, POST /api/auth/logout
      account/               /api/account/* (Settings page)
      extension/             routes the VS Code extension calls (/auth, /account, /v1/models)
      proxy/                 /v1/messages, /v1/chat/completions: forwards AI requests
      plans/                 plans, plan models, allowance windows, subscriptions (shared)
      provider-keys/         our API key per AI provider: encrypted in the DB, .env fallback
      usage/                 GET /api/usage (website Usage page) + usage reports
      admin/                 /api/admin/*: admin sign-in, keys, plans, users, usage
```

- New features go in `src/app/features/<name>/` with their own module, controller, service, and `dto/`.
- Auth stores users in Postgres, hashes passwords with scrypt, and issues opaque bearer tokens (`Authorization: Bearer <token>`), kept as SHA-256 hashes in `auth_tokens`.
- Google/GitHub sign-in goes through Clerk: the browser finishes OAuth with Clerk (`/sso-callback`), then `POST /api/auth/oauth/clerk` verifies the Clerk token. Each connected Google/GitHub account is a row in `user_identities`; sign-in matches that row first, then links an existing user with the same *verified* email, then creates a user. Set `CLERK_SECRET_KEY` (backend) and `VITE_CLERK_PUBLISHABLE_KEY` (frontend) to enable it.
- **VS Code extension** (routes fixed by the extension, at the domain root, not under `/api`):
  - `GET /auth?state=…&redirect=vscode://Nakka.nakka/auth` redirects to the website's `/auth` page. There the person signs in, confirms, and is sent to `vscode://Nakka.nakka/auth?state=…&token=…`. Each `state` works once, for 10 minutes; any other redirect is refused.
  - `GET /account` (email, plan, usage windows), `GET /v1/models` (models for the plan), `POST /auth/revoke`. A bad, expired or revoked token gets `401`.
  - `POST /v1/messages` (Anthropic) and `POST /v1/chat/completions` (OpenAI, Gemini, xAI) forward the request with our API key and stream the answer back unchanged. The model must be in `plan_models` for the user's plan; its `provider` picks the company and `upstream_model` the name sent (the body is otherwise forwarded byte for byte, except that streamed OpenAI-style requests get `stream_options.include_usage` so the provider reports tokens).
  - **Allowances measure cost, like Claude Code's**, not requests. Each plan model has prices (US$ per million tokens: input, output, cache read, cache write); a model without input/output prices answers `503`. When the stream ends, the request's cost (tokens × prices, in micro-dollars) is saved on its `usage_events` row and added to each of the plan's `usage_windows` (`plans.windows[].limit` is micro-dollars too), and only then is the response ended, so the next request sees it. Token counts mean the same for every provider: input excludes cached input, which is split into cache reads and writes. If a provider reports no usage, the request is charged by its size. A request may start while every window is under 100%; a used-up window answers `402` with `window`, `resetsAt`, `message` and `manageUrl`. Our own key being refused becomes `502`, so the extension never mistakes it for the user's token expiring.
  - Provider keys are set on the admin page and stored AES-256-GCM encrypted with `PROVIDER_KEYS_SECRET` (only the last 4 characters are ever shown). A provider with no saved key falls back to `.env` (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`); with neither, its models answer `503`. `MANAGE_URL` is the billing link in `402`s and `GET /account`.
  - A user's plan is their `subscriptions` row when it is active (or past due) and before `current_period_end`, otherwise Free. `activePlanSql` in `features/plans/plans.repository.ts` is the one definition every query uses.
  - Tokens (website and extension) live in `auth_tokens`, stored as SHA-256 hashes; extension tokens last 90 days (`EXTENSION_TOKEN_TTL_DAYS`). Plans, plan models, subscriptions and usage have their own tables (migration 006); plans start with no limits or models.
  - In development, the Vite server forwards `/v1`, `/account` and `/auth/revoke` to the backend, so `http://localhost:3000` works as the extension's base URL.
- `/api/account/*` (signed-in only): list sign-in methods, connect or disconnect Google/GitHub, set or change the password. The dashboard's Settings page uses these.
- `GET /api/usage?days=7|30|90` (signed-in only): the user's plan, allowance windows as percent used (the same numbers as the extension's `GET /account`, where `used` is 0–100 and `limit` is 100; users never see dollars), models and usage history. The dashboard's Overview and Usage pages use it.
- **Admin dashboard** (`/admin` on the website, `/api/admin/*` on the backend). Admins are separate accounts in `admin_users` with their own sessions in `admin_tokens` (12 hours, `ADMIN_SESSION_TTL_HOURS`), so a user's token never opens an admin route. Five failed sign-ins per email and address pause sign-in for 15 minutes. Admins:
  - set, test and remove provider keys;
  - edit each plan's name, allowance windows (a dollar budget of API cost per window) and models with their prices;
  - search users and move them between Free and Pro by hand, optionally until a date (payments aren't automated yet);
  - see usage and API cost by day, model, provider and top users.
  Every change is written to `admin_audit_log` (never key material). Admins sign in with email and password only (no Google/Clerk). While no admin exists, `/admin/signup` creates the first one (exactly one, even if two people try at once); after that sign-up is closed and admins add other admins on the Admins page (`POST /api/admin/admins`). Admin passwords need at least 12 characters with a letter and a number; changing one (`PUT /api/admin/auth/password`) signs the admin out everywhere else. From the server you can also create an admin, or reset a forgotten password, with `yarn workspace @nakka/backend db:create-admin <email> "<name>"`.
- Database credentials come from the `PG*` variables in `apps/backend/.env`. Schema changes are SQL files in `apps/backend/database/migrations/`, applied in name order by `yarn backend:migrate` (each runs once).
- `yarn backend:dev` runs `nest start --watch`; `yarn backend:test` runs the Vitest specs (`*.spec.ts`). Copy `.env.example` to `.env` to change `PORT`, `CORS_ORIGINS`, or `SESSION_TTL_HOURS`, and set `PROVIDER_KEYS_SECRET` (`openssl rand -base64 32`) before saving keys on the admin page. Keep that secret safe and unchanged: keys saved with it can't be read without it.

## Docker

Build from the repo root so the image can see the shared packages:

```sh
docker build -f apps/frontend/Dockerfile -t nakka-frontend .
docker run --rm -p 3000:80 nakka-frontend

docker build -f apps/backend/Dockerfile -t nakka-backend .
docker run --rm -p 8080:8080 nakka-backend
```

The frontend image serves the built site with nginx at http://localhost:3000 and sends unknown paths to `index.html`. The backend image runs the compiled server on port 8080.

## Deploy the frontend to Cloudflare Pages

Cloudflare Pages builds from GitHub on every push to `main`; it does not use the Dockerfile.

- Root directory: leave empty (the repo root)
- Build command: `yarn install --immutable && yarn ui:build`
- Build output directory: `apps/frontend/dist`

This command explicitly installs dependencies before building only the frontend. If `SKIP_DEPENDENCY_INSTALL` is set in Pages, automatic installation is skipped, so a build command without an install step fails with `turbo: not found`. Keep the explicit install step when using that setting. Use the repository's pinned Yarn version rather than npm to install workspace dependencies.

`.nvmrc` pins Node 22. Pages serves `index.html` for unknown paths because the build has no `404.html`.
