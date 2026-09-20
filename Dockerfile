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

WORKDIR /app

# Install Node.js, npm, curl, and certificates
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nodejs \
        npm \
        curl \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*


# =========================
# Install Caddy
# =========================

RUN curl -L \
    https://caddyserver.com/api/download?os=linux\&arch=amd64 \
    -o /usr/bin/caddy \
    && chmod +x /usr/bin/caddy \
    && /usr/bin/caddy version


# =========================
# Copy Node application
# =========================

COPY --from=node-builder /app /app


# =========================
# Caddy configuration
# =========================

COPY Caddyfile /etc/caddy/Caddyfile


# =========================
# Website files
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
    'echo "================================="' \
    'echo "Starting Node application..."' \
    'echo "================================="' \
    'node /app/index.js &' \
    'NODE_PID=$!' \
    '' \
    'sleep 1' \
    '' \
    'echo "================================="' \
    'echo "Starting Caddy..."' \
    'echo "================================="' \
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
