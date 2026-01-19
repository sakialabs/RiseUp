# RiseUp Collective - Setup Guide

## Quick Start (Recommended)

**The fastest way to get started is with Docker:**

```powershell
# Clone and navigate to the project
git clone https://github.com/sakialabs/RiseUp.git
cd RiseUp

# Start API and database containers
docker-compose up -d

# View logs
docker-compose logs -f

# Access the API
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

That's it! Skip to [Frontend Setup](#frontend-setup) to continue.

---

## Docker Setup (Recommended)

### Container Architecture

The RiseUp Collective backend runs in two Docker containers:

- **db** - PostgreSQL 15 database (port 5432)
- **api** - FastAPI backend server (port 8000)

### Common Docker Commands

**Container Management:**

```powershell
# Start all containers
docker-compose up -d

# Stop containers (keep data)
docker-compose stop

# Stop and remove containers + volumes (⚠️ DELETES DATA)
docker-compose down -v

# Restart containers
docker-compose restart

# Rebuild and start (after code changes)
docker-compose up --build -d
```

**Viewing Logs:**

```powershell
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# View specific service logs
docker logs api
docker logs db

# View last 100 lines
docker-compose logs --tail=100
```

**Database Management:**

```powershell
# Connect to PostgreSQL
docker exec -it db psql -U riseup_user -d riseup_db

# Run migrations (inside api container)
docker exec -it api alembic upgrade head

# Create new migration
docker exec -it api alembic revision --autogenerate -m "Migration message"
```

**Container Shell Access:**

```powershell
# Access API container shell
docker exec -it api /bin/bash

# Access DB container shell
docker exec -it db /bin/sh
```

### Development Workflow with Docker

1. **Start containers:**

   ```powershell
   docker-compose up -d
   ```

2. **View API docs:**
   - Open <http://localhost:8000/docs>

3. **Make code changes:**
   - Edit files in `backend/`
   - API auto-reloads (watch mode enabled)

4. **View logs:**

   ```powershell
   docker-compose logs -f api
   ```

5. **Stop when done:**

   ```powershell
   docker-compose down
   ```

### Docker Troubleshooting

**Container won't start:**

```powershell
# Check container status
docker ps -a

# View error logs
docker logs api
docker logs db

# Remove and rebuild
docker-compose down
docker-compose up --build -d
```

**Database connection issues:**

```powershell
# Check if database is healthy
docker ps

# View database logs
docker logs db

# Connect manually
docker exec -it db psql -U riseup_user -d riseup_db
```

**Port already in use:**

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

**Reset everything:**

```powershell
# Stop and remove all containers, volumes, and networks
docker-compose down -v

# Remove images (optional)
docker rmi riseup-api postgres:15-alpine

# Start fresh
docker-compose up --build -d
```

---

## Manual Setup (Alternative)

If you prefer to run services locally without Docker:

### Prerequisites

- **Python 3.11 or higher**
- **Node.js 18 or higher** and npm
- **PostgreSQL 15** (installed locally)
- **Git**

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/sakialabs/RiseUp.git
cd RiseUp
```

---

## Step 2: Backend Setup

### 2.1 Create Python Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure Environment Variables

```bash
# Copy the example environment file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env file with your settings:
# - DATABASE_URL: PostgreSQL connection string
# - SECRET_KEY: Generate a secure random key
# - Other configuration as needed
```

### 2.4 Start PostgreSQL Database

**Option A: Using Docker (Recommended)**

```bash
# From project root
docker-compose up -d db
```

**Option B: Local PostgreSQL**

Create a database named `riseup_db` with user `riseup_user`.

### 2.5 Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 2.6 Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend API will be available at:

- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

---

## Frontend Setup

### Web Frontend (Next.js)

### 3.1 Navigate to Web Directory

```bash
cd ../web
```

### 3.2 Install Node Dependencies

```bash
npm install
```

### 3.3 Configure Environment

```bash
# Copy the example environment file
copy .env.local.example .env.local  # Windows
# cp .env.local.example .env.local  # macOS/Linux
```

### 3.4 Start Development Server

```bash
npm run dev
```

The web application will be available at `http://localhost:3000`

---

### Mobile App (React Native + Expo)

### 4.1 Navigate to Mobile Directory

```bash
cd ../mobile
```

### 4.2 Install Dependencies

```bash
npm install
```

### 4.3 Start Expo Development Server

```bash
npm start
```

### 4.4 Run on Device

- **Android**: Press 'a' in the terminal or scan QR code with Expo Go app
- **iOS**: Press 'i' in the terminal or scan QR code with Expo Go app (macOS only)
- **Web**: Press 'w' in the terminal

---

## Step 5: Verify Installation

### Backend Health Check

Visit `http://localhost:8000/` - you should see:

```json
{
  "message": "RiseUp Collective API",
  "status": "running",
  "docs": "/api/v1/docs"
}
```

### Test API Endpoints

Visit `http://localhost:8000/docs` to see interactive API documentation.

### Test Web Frontend

Visit `http://localhost:3000` - you should see the RiseUp landing page.

---

## Common Issues & Troubleshooting

### Backend Issues

**Database Connection Error**

- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists and credentials are correct

**Migration Errors**

- Delete `alembic/versions/*.py` files and run migration again
- Check database permissions

**Import Errors**

- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Frontend Issues

**Module Not Found**

- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

**API Connection Failed**

- Ensure backend is running
- Check NEXT_PUBLIC_API_URL in .env.local

### Mobile Issues

**Expo Not Starting**

- Clear Expo cache: `expo start -c`
- Update Expo CLI: `npm install -g expo-cli`

**Cannot Connect to Backend**

- Use your computer's IP address instead of localhost
- Update EXPO_PUBLIC_API_URL in the app

---

## Development Workflow

### Creating Database Changes

1. Modify models in `backend/app/models.py`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review generated migration in `alembic/versions/`
4. Apply migration: `alembic upgrade head`

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests (when added)
cd web
npm test
```

### Code Quality

```bash
# Backend linting (add to requirements-dev.txt)
black app/
flake8 app/

# Frontend linting
cd web
npm run lint
```

---

## Production Deployment

### Backend

1. Set production environment variables
2. Use production-grade WSGI server (Gunicorn)
3. Set up SSL/TLS
4. Configure CORS properly
5. Use managed PostgreSQL (Supabase, AWS RDS, etc.)

### Frontend

```bash
cd web
npm run build
npm start
```

Deploy to Vercel, Netlify, or other hosting platform.

### Mobile

1. Configure app signing
2. Build production bundles
3. Submit to App Store / Play Store

---

## Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

---

## Environment Variables Reference

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@host:5432/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
API_V1_STR=/api/v1
PROJECT_NAME=RiseUp Collective
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

### Web (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Mobile

Set in code or use environment variables via Expo config.

---

## Next Steps

1. Review the [Vision](docs/vision.md) to understand the project's purpose
2. Read [Requirements](docs/requirements.md) for feature specifications
3. Check [Design](docs/design.md) for architecture details
4. Follow [Tasks](docs/tasks.md) for implementation roadmap
5. Use [Tone Guide](docs/tone.md) for language consistency
6. Reference [Style Guide](docs/styles.md) for visual design

---

## Getting Help

- Check documentation in `docs/` directory
- Review API documentation at `/docs` endpoint
- Look at existing code examples
- See [CHANGELOG.md](../CHANGELOG.md) for recent changes

---

**Welcome to RiseUp Collective. Let's build something that matters.**
