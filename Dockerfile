# -------- Base: dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# -------- Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# -------- Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/uploads /uploads
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NUXT_PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
