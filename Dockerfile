FROM node:22-alpine AS base

FROM base AS builder
RUN apk add --no-cache g++ make py3-pip libc6-compat git
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# standalone output: only the files needed to run are copied
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]