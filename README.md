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
    features/
      auth/                  POST /api/auth/signup, POST /api/auth/login,
                             GET /api/auth/me, POST /api/auth/logout
```

- New features go in `src/app/features/<name>/` with their own module, controller, service, and `dto/`.
- Auth stores users in Postgres, hashes passwords with scrypt, and issues opaque bearer tokens (`Authorization: Bearer <token>`). Sessions are still kept in memory, so everyone is signed out when the server restarts.
- Google/GitHub sign-in goes through Clerk: the browser finishes OAuth with Clerk (`/sso-callback`), then `POST /api/auth/oauth/clerk` verifies the Clerk token. Each connected Google/GitHub account is a row in `user_identities`; sign-in matches that row first, then links an existing user with the same *verified* email, then creates a user. Set `CLERK_SECRET_KEY` (backend) and `VITE_CLERK_PUBLISHABLE_KEY` (frontend) to enable it.
- **VS Code extension** (routes fixed by the extension, at the domain root, not under `/api`):
  - `GET /auth?state=…&redirect=vscode://Nakka.nakka/auth` redirects to the website's `/auth` page. There the person signs in, confirms, and is sent to `vscode://Nakka.nakka/auth?state=…&token=…`. Each `state` works once, for 10 minutes; any other redirect is refused.
  - `GET /account` (email, plan, usage windows), `GET /v1/models` (models for the plan), `POST /auth/revoke`. A bad, expired or revoked token gets `401`.
  - `POST /v1/messages` (Anthropic) and `POST /v1/chat/completions` (OpenAI, Gemini, xAI) forward the request with our API key and stream the answer back unchanged. The model must be in `plan_models` for the user's plan; its `provider` picks the company and `upstream_model` the name sent (the body is otherwise forwarded byte for byte). Usage is recorded after the stream ends: one `usage_events` row with token counts, and +1 in each `usage_windows` window. A used-up window answers `402` with `window`, `resetsAt`, `message` and `manageUrl`. Our own key being refused becomes `502`, so the extension never mistakes it for the user's token expiring.
  - Provider keys go in `.env` (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`); a provider without a key answers `503` for its models. `MANAGE_URL` is the billing link in `402`s and `GET /account`.
  - Tokens (website and extension) live in `auth_tokens`, stored as SHA-256 hashes; extension tokens last 90 days (`EXTENSION_TOKEN_TTL_DAYS`). Plans, plan models, subscriptions and usage have their own tables (migration 006); plans start with no limits or models.
  - In development, the Vite server forwards `/v1`, `/account` and `/auth/revoke` to the backend, so `http://localhost:3000` works as the extension's base URL.
- `/api/account/*` (signed-in only): list sign-in methods, connect or disconnect Google/GitHub, set or change the password. The dashboard's Settings page uses these.
- Database credentials come from the `PG*` variables in `apps/backend/.env`. Schema changes are SQL files in `apps/backend/database/migrations/`, applied in name order by `yarn backend:migrate` (each runs once).
- `yarn backend:dev` runs `nest start --watch`; `yarn backend:test` runs the Vitest specs (`*.spec.ts`). Copy `.env.example` to `.env` to change `PORT`, `CORS_ORIGINS`, or `SESSION_TTL_HOURS`.

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
- Build command: `yarn build`
- Build output directory: `apps/frontend/dist`

`.nvmrc` pins Node 22. Pages serves `index.html` for unknown paths because the build has no `404.html`.
