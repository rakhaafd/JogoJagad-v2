# Build stage
FROM node:22-alpine AS builder

ARG VITE_URL_API=http://localhost:8080

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Create .env for build if it doesn't exist
RUN if [ ! -f .env ]; then \
      echo "VITE_URL_API=${VITE_URL_API}" > .env; \
    fi

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
