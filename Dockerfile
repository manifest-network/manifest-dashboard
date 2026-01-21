# syntax=docker.io/docker/dockerfile:1

FROM docker.io/oven/bun:1.2-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* bun.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then bun install --no-save; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN apt update && apt install -y git

RUN \
    if [ -f .env ]; then echo ".env file found, continuing..."; else echo ".env file not found, exiting..."; exit 1; fi

RUN \
  if [ -f yarn.lock ]; then yarn run build-release; \
  elif [ -f package-lock.json ]; then npm run build-release; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build-release; \
  elif [ -f bun.lockb ] || [ -f bun.lock ]; then bun run build-release; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN rm -rf .env

# Production image, copy all the files and run bun
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NETWORK=mainnet

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte

COPY --from=builder /app/build ./build
COPY entrypoint.sh /app/entrypoint.sh

RUN chown -R svelte:nodejs /app ; chmod 755 /app/entrypoint.sh

USER svelte

EXPOSE 3000

ENV ORIGIN="http://localhost:3000"
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["/app/entrypoint.sh"]
