# Build from the repo root:  docker build -f apps/frontend/Dockerfile -t nakka-frontend .

# Build the static site
FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml turbo.json ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend
RUN yarn install --immutable
RUN yarn turbo run build --filter=@nakka/frontend

# Serve it with nginx
FROM nginx:1.27-alpine
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
