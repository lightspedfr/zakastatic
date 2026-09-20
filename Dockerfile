# =========================
# Node application
# =========================
FROM node:20-bookworm-slim AS node-builder

WORKDIR /app

COPY node/package*.json ./

RUN npm install --omit=dev --include=optional

COPY node/index.js ./


# =========================
# Caddy + Node
# =========================
FROM caddy:2.11

# Install Node.js
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=node-builder /app /app

COPY Caddyfile /etc/caddy/Caddyfile

COPY . /usr/share/caddy/

RUN rm -rf \
    /usr/share/caddy/node \
    /usr/share/caddy/Caddyfile \
    /usr/share/caddy/Dockerfile


# =========================
# Startup
# =========================
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'echo "Starting Node application..."' \
    'node /app/index.js &' \
    'NODE_PID=$!' \
    'echo "Starting Caddy..."' \
    'caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &' \
    'CADDY_PID=$!' \
    'trap "kill $NODE_PID $CADDY_PID 2>/dev/null || true" INT TERM EXIT' \
    'wait -n $NODE_PID $CADDY_PID' \
    'exit $?' \
    > /start.sh

RUN chmod +x /start.sh

EXPOSE 443

CMD ["/start.sh"]
