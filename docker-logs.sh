#!/bin/bash

SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
    echo "📋 Showing all services logs..."
    docker compose logs -f
else
    echo "📋 Showing $SERVICE logs..."
    docker compose logs -f "$SERVICE"
fi
