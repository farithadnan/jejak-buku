FROM node:20-alpine

# Install build dependencies for better-sqlite3 and bash for devcontainer
RUN apk add --no-cache \
    bash \
    git \
    python3 \
    make \
    g++

WORKDIR /app

EXPOSE 5000

# Create an entrypoint script to install dependencies on startup
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then' >> /entrypoint.sh && \
    echo '  echo "Installing dependencies..."' >> /entrypoint.sh && \
    echo '  npm install --legacy-peer-deps' >> /entrypoint.sh && \
    echo '  npm rebuild better-sqlite3' >> /entrypoint.sh && \
    echo '  touch node_modules/.installed' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "dev"]