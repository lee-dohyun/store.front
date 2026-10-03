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

# next.config.ts 의 output: "standalone" 산출물만 싣는다 - 빌드 도구와 devDependencies 는 들어가지 않는다.
# .next 는 런타임 사용자 소유여야 한다: ISR 이 재생성한 페이지를 여기에 쓰는데, 못 쓰면 조용히
# 옛 페이지만 계속 내보낸다(c3f3c2e).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
