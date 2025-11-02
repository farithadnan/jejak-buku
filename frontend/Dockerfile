FROM node:20-alpine

# Install bash for better devcontainer experience
RUN apk add --no-cache bash git

WORKDIR /app

EXPOSE 4200

# Create an entrypoint script to install dependencies on startup
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then' >> /entrypoint.sh && \
    echo '  echo "Installing dependencies..."' >> /entrypoint.sh && \
    echo '  npm install --legacy-peer-deps' >> /entrypoint.sh && \
    echo '  touch node_modules/.installed' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]