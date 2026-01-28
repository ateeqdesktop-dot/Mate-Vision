# Stage 1: Build Flutter Web App
FROM debian:bookworm-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -ms /bin/bash flutter
USER flutter
WORKDIR /home/flutter

# Download and install Flutter SDK
ENV FLUTTER_VERSION=3.27.3
RUN curl -LO https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz \
    && tar xf flutter_linux_${FLUTTER_VERSION}-stable.tar.xz \
    && rm flutter_linux_${FLUTTER_VERSION}-stable.tar.xz

# Set Flutter path
ENV PATH="/home/flutter/flutter/bin:${PATH}"

# Disable analytics and configure Flutter
RUN flutter config --no-analytics \
    && flutter config --enable-web \
    && flutter precache --web

# Copy app source
WORKDIR /home/flutter/app
COPY --chown=flutter:flutter . .

# Get dependencies
RUN flutter pub get

# Build web app with production settings
ARG API_BASE_URL=http://localhost:8000
RUN flutter build web --release --dart-define=API_BASE_URL=${API_BASE_URL}

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built web app
COPY --from=builder /home/flutter/app/build/web /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
