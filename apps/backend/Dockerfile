# Build from the repo root:  docker build -f apps/backend/Dockerfile -t nakka-backend .

FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN yarn install --immutable
RUN yarn turbo run build --filter=@nakka/backend
RUN yarn workspaces focus @nakka/backend --production

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/backend/package.json ./
COPY --from=build /repo/apps/backend/dist ./dist
# Migrations ship with the image: run `node database/migrate.mjs` once per
# release (it is safe if several servers start it at once).
COPY --from=build /repo/apps/backend/database ./database
USER node
ENV PORT=8080
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null || exit 1
CMD ["node", "dist/main.js"]
