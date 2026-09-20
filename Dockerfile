# =========================
# Build Node application
# =========================
FROM node:20-alpine AS node-builder

WORKDIR /app

COPY node/package*.json ./

RUN npm install --omit=dev

COPY node/index.js ./


# =========================
# Final image
# =========================
FROM caddy:2.11-alpine

# Install Node.js
RUN apk add --no-cache nodejs npm

WORKDIR /app

# Copy Node application
COPY --from=node-builder /app /app

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy website files
COPY . /usr/share/caddy/

# Remove files that shouldn't be served
RUN rm -rf \
    /usr/share/caddy/node \
    /usr/share/caddy/Caddyfile \
    /usr/share/caddy/Dockerfile

# Startup script
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '' \
    'echo "Starting Node application..."' \
    'node /app/index.js &' \
    'NODE_PID=$!' \
    '' \
    'echo "Starting Caddy..."' \
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
