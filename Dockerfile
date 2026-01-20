# Use the official Node.js runtime as the base image
FROM node:22-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments will be passed from docker-compose.yaml
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_PRIVY_APP_ID
ARG PRIVY_APP_SECRET
ARG NILDB_NODES
ARG NILAUTH_URL
ARG NILLION_API_KEY

# Set environment variables for the build stage
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_PRIVY_APP_ID=$NEXT_PUBLIC_PRIVY_APP_ID
ENV PRIVY_APP_SECRET=$PRIVY_APP_SECRET
ENV NILDB_NODES=$NILDB_NODES
ENV NILAUTH_URL=$NILAUTH_URL
ENV NILLION_API_KEY=$NILLION_API_KEY

ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next && \
    chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
