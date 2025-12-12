FROM node:24-slim AS base

FROM base AS deps
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

#RUN apt update && apt upgrade
COPY ./package.json ./

RUN npm i;


FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN  npm run build



FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node",  "server.js"]

 