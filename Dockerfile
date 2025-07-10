FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN rm -f .env

RUN addgroup -g 1001 -S nodejs && \
    adduser -S hono -u 1001 && \
    chown -R hono:nodejs /app

USER hono

EXPOSE 3001

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm run dev"]