#!/bin/bash

set -e

echo "🐳 Starting JogoJagad with Docker Compose..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please review and edit if needed."
fi

# Build dan jalankan services
echo "🔨 Building dan starting services..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check services status
echo ""
echo "📊 Services Status:"
docker compose ps

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:4173"
echo "   Backend:   http://localhost:8080"
echo "   Database:  localhost:3306"
echo ""
echo "💡 Useful commands:"
echo "   docker compose logs -f           - View logs"
echo "   docker compose ps                - Check status"
echo "   docker compose down              - Stop services"
echo "   docker compose exec backend bash - Access backend container"
echo "   docker compose exec frontend sh  - Access frontend container"
