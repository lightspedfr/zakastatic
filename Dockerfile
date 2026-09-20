# =========================
# Build Node application
# =========================
FROM node:20-bookworm-slim AS node-builder

WORKDIR /app

COPY node/package*.json ./

RUN npm install --omit=dev --include=optional

COPY node/index.js ./


# =========================
# Caddy + Node
# =========================
FROM caddy:2.11-builder AS caddy-builder

# Nothing needed here; this stage just gives us
# the Caddy binary from the official image.


FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Caddy dependencies + Node.js
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

# Copy Caddy from official Caddy image
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy

WORKDIR /app

# Copy Node application and its dependencies
COPY --from=node-builder /app /app

# Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Website files
COPY . /usr/share/caddy/

# Don't expose these files publicly
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
    'trap "kill $NODE_PID $CADDY_PID 2>/dev/null || true" INT TERM EXIT' \
    '' \
    'wait -n $NODE_PID $CADDY_PID' \
    'exit $?' \
    > /start.sh

RUN chmod +x /start.sh

EXPOSE 443

CMD ["/start.sh"]
