FROM node:24.22.3-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.12.1 --activate && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

ENV PORT=3000

CMD ["node", "build"]
