# 🐳 Docker Setup - JogoJagad v2

## Quick Start

### Opsi 1: Menggunakan Shell Script (Paling Mudah)
```bash
# Jalankan di root project
./docker-up.sh
```

### Opsi 2: Menggunakan Make Command
```bash
# Jalankan di root project
make up
```

### Opsi 3: Direct Docker Compose
```bash
docker compose up -d --build
```

---

## 📚 Available Commands

### Shell Scripts

| Command | Deskripsi |
|---------|-----------|
| `./docker-up.sh` | Start semua services dengan build |
| `./docker-down.sh` | Stop semua services |
| `./docker-logs.sh [service]` | Lihat logs (opsional: specify service) |

### Make Commands

| Command | Deskripsi |
|---------|-----------|
| `make up` | Start semua services |
| `make down` | Stop semua services |
| `make ps` | Check status services |
| `make logs` | Lihat semua logs |
| `make logs-fe` | Lihat frontend logs |
| `make logs-be` | Lihat backend logs |
| `make restart` | Restart semua services |
| `make clean` | Remove containers & volumes |
| `make backend-sh` | Access backend container |
| `make frontend-sh` | Access frontend container |
| `make migrate` | Run Laravel migrations |
| `make seed` | Run database seeder |
| `make npm-install` | Install npm dependencies di frontend |
| `make composer-install` | Install composer dependencies di backend |

### Docker Compose Commands

```bash
# Check status
docker compose ps

# View logs
docker compose logs -f                  # Semua services
docker compose logs -f backend          # Backend only
docker compose logs -f frontend         # Frontend only

# Stop services
docker compose down

# Clean (remove containers & volumes)
docker compose down -v
```

---

## 🌐 Access Services

- **Frontend**: http://localhost:4173
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306 (MySQL)

---

## 🔧 Configuration

1. Copy environment file:
```bash
cp .env.example .env
```

2. Edit `.env` jika diperlukan:
```env
FRONTEND_PORT=5173
APP_PORT=8080
DB_PORT=3306
VITE_URL_API=http://backend:80  # API URL untuk frontend
MYSQL_DATABASE=jogojagad
MYSQL_USER=jogojagad
MYSQL_PASSWORD=jogojagad123
```

**VITE_URL_API:**
- Development: `http://localhost:8080`
- Docker: `http://backend:80` (internal network)
- Production: `https://your-api-domain.com`

---

## 📂 Project Structure

```
JogoJagad-v2/
├── frontend/               # React + TypeScript
│   └── Dockerfile         # Frontend image
├── backend/               # Laravel PHP
│   └── Dockerfile         # Backend image
├── docker-compose.yml     # Orchestration
├── docker-up.sh          # Start script
├── docker-down.sh        # Stop script
├── docker-logs.sh        # Logs script
├── Makefile              # Make commands
└── .env.example          # Environment template
```

---

## 🚀 Services Included

### Frontend
- Node.js 22 Alpine
- React + TypeScript
- Vite build tool
- Port: 5173

### Backend
- PHP 8.3 Apache
- Laravel Framework
- MySQL 8.4 database
- Queue worker
- Port: 8080

### Database
- MySQL 8.4
- Persistent volume
- Port: 3306

---

## 💡 Troubleshooting

### Services won't start
```bash
# Check logs
make logs

# Rebuild containers
docker compose down
docker compose up -d --build
```

### Port already in use
```bash
# Change ports in .env
FRONTEND_PORT=5174
APP_PORT=8081
DB_PORT=3307
```

### Database connection issues
```bash
# Check database health
docker compose exec db mysqladmin ping

# Access database
docker compose exec db mysql -u jogojagad -p jogojagad
```

---

## 📝 First Time Setup

```bash
# 1. Create .env
cp .env.example .env

# 2. Start services
make up

# 3. Run migrations (if needed)
make migrate

# 4. Seed database (if needed)
make seed

# 5. Access frontend
# Open browser: http://localhost:5173
```

---

## 🛑 Stopping Services

```bash
# Quick stop
make down

# Stop dengan cleanup
make clean
```

---

Enjoy! 🎉
