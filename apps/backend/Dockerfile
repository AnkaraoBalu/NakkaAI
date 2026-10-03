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
USER node
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/main.js"]
