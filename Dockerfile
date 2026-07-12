# 构建上下文为仓库根目录；前端构建后由 Nginx 提供静态文件
# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmmirror.com

COPY scripts ./scripts
COPY index.html vite.config.ts ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY env.d.ts ./
COPY public ./public
COPY src ./src

# 与 Nginx 同域反代 /api，构建产物请求 /api/...
RUN cp .env.production.example .env.production
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /src/dist /usr/share/nginx/html
COPY deploy/docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
