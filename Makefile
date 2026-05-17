.PHONY: help up down logs ps build restart clean

help:
	@echo "JogoJagad Docker Commands:"
	@echo ""
	@echo "  make up          - Start all services (frontend, backend, db)"
	@echo "  make down        - Stop all services"
	@echo "  make build       - Build images without starting"
	@echo "  make logs        - Show all services logs"
	@echo "  make logs-fe     - Show frontend logs"
	@echo "  make logs-be     - Show backend logs"
	@echo "  make logs-db     - Show database logs"
	@echo "  make ps          - Show services status"
	@echo "  make restart     - Restart all services"
	@echo "  make clean       - Remove containers and volumes"
	@echo "  make backend-sh  - Access backend container shell"
	@echo "  make frontend-sh - Access frontend container shell"
	@echo ""

up:
	@bash docker-up.sh

down:
	@bash docker-down.sh

build:
	@docker compose build

logs:
	@docker compose logs -f

logs-fe:
	@docker compose logs -f frontend

logs-be:
	@docker compose logs -f backend

logs-db:
	@docker compose logs -f db

ps:
	@docker compose ps

restart:
	@docker compose restart

clean:
	@docker compose down -v
	@echo "✅ Cleaned up all containers and volumes"

backend-sh:
	@docker compose exec backend bash

frontend-sh:
	@docker compose exec frontend sh

migrate:
	@docker compose exec backend php artisan migrate

seed:
	@docker compose exec backend php artisan db:seed

npm-install:
	@docker compose exec frontend npm install

npm-update:
	@docker compose exec frontend npm update

composer-install:
	@docker compose exec backend composer install

composer-update:
	@docker compose exec backend composer update
