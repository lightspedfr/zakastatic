# =========================
# Node dependency builder
# =========================
FROM node:20-bookworm-slim AS node-builder

WORKDIR /app

COPY node/package*.json ./

RUN npm install --omit=dev --include=optional

COPY node/index.js ./


# =========================
# Final image
# =========================
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js, npm and required tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*


# =========================
# Install Caddy
# =========================

RUN curl -1sLf \
    'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor \
    -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
    && curl -1sLf \
    'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    > /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends caddy \
    && rm -rf /var/lib/apt/lists/*


# =========================
# Node application
# =========================

WORKDIR /app

COPY --from=node-builder /app /app


# =========================
# Caddy configuration
# =========================

COPY Caddyfile /etc/caddy/Caddyfile


# =========================
# Website
# =========================

COPY . /usr/share/caddy/

RUN rm -rf \
    /usr/share/caddy/node \
    /usr/share/caddy/Caddyfile \
    /usr/share/caddy/Dockerfile


# =========================
# Startup script
# =========================

RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '' \
    'echo "Starting Node application..."' \
    'node /app/index.js &' \
    'NODE_PID=$!' \
    '' \
    'sleep 1' \
    '' \
    'echo "Starting Caddy..."' \
    'caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &' \
    'CADDY_PID=$!' \
    '' \
    'cleanup() {' \
    '    kill "$NODE_PID" "$CADDY_PID" 2>/dev/null || true' \
    '}' \
    '' \
    'trap cleanup INT TERM EXIT' \
    '' \
    'wait -n "$NODE_PID" "$CADDY_PID"' \
    > /start.sh

RUN chmod +x /start.sh

EXPOSE 443

CMD ["/start.sh"]
