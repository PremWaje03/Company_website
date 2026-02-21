# Company Website (Frontend + Backend)

Production-ready company website project with:
- Public marketing website (React + Vite)
- Admin dashboard for content management
- Spring Boot backend API with JWT auth
- MongoDB persistence
- Docker setup for full-stack deployment

## 1. Project Structure

```text
Company_Project/
  project/                    # React frontend
  company-website-backend/    # Spring Boot backend
  docker-compose.yml          # Full stack (frontend + backend + mongodb)
```

## 2. Key Features

- Dynamic public sections:
  - Company profile
  - Services
  - Projects
  - Technologies
  - Team
  - Testimonials
  - Contact form
- Admin panel:
  - CRUD/toggle for all content modules
  - Contact message status management
  - Company information management
  - Team image upload from local system
- Security:
  - JWT-based admin authentication
  - Protected `/api/admin/**` routes
  - Configurable CORS
- Deployment:
  - Dockerfile for frontend
  - Dockerfile for backend
  - Docker Compose for complete stack

## 3. Tech Stack

- Frontend: React, Vite, Axios, CSS
- Backend: Spring Boot 4, Spring Security, Spring Data MongoDB
- Database: MongoDB
- Deployment: Docker, Docker Compose, Nginx

## 4. Run Locally (Step-by-Step)

### 4.1 Start MongoDB

Make sure MongoDB runs on:
- `mongodb://localhost:27017/companydb`

### 4.2 Start Backend

```powershell
cd company-website-backend
./mvnw spring-boot:run
```

Backend URL:
- `http://localhost:8081`

### 4.3 Start Frontend

```powershell
cd project
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## 5. Admin Login

Default seeded credentials:
- Email: `admin@gmail.com`
- Password: `admin123`

Change these for production using backend environment variables.

## 6. Environment Variables

### 6.1 Frontend (`project/.env`)

Use `project/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8081
```

### 6.2 Backend (env or properties)

Use `company-website-backend/.env.example`:

```env
SERVER_PORT=8081
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/companydb
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
APP_UPLOAD_DIR=uploads
JWT_SECRET=replace-with-a-secure-32-byte-plus-secret
JWT_EXPIRATION=18000000
APP_ADMIN_EMAIL=admin@gmail.com
APP_ADMIN_PASSWORD=admin123
```

## 7. Run With Docker

From root directory:

```powershell
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8081`
- MongoDB: `mongodb://localhost:27017`

To stop:

```powershell
docker compose down
```

## 8. API Overview

Public:
- `GET /api/company`
- `GET /api/services`
- `GET /api/projects`
- `GET /api/projects/featured`
- `GET /api/technologies`
- `GET /api/team`
- `GET /api/testimonials`
- `POST /api/contact`
- `POST /api/auth/login`

Admin (JWT required):
- `/api/admin/services/**`
- `/api/admin/projects/**`
- `/api/admin/technologies/**`
- `/api/admin/team/**`
- `/api/admin/testimonials/**`
- `/api/admin/contacts/**`
- `/api/admin/company`
- `/api/admin/uploads/team-image`

## 9. GitHub Upload Checklist

Before pushing:
1. Ensure `.env` files are not committed.
2. Use strong production values for `JWT_SECRET` and admin credentials.
3. Keep `uploads/` and logs ignored (already configured in backend `.gitignore`).
4. Commit from project root with both app folders and `docker-compose.yml`.

## 10. Production Deployment (Single Domain)

This project includes:
- `docker-compose.prod.yml`
- `deploy/nginx/prod.conf`
- `.env.production.example`

Steps:
1. Copy `.env.production.example` to `.env.production` and set real values.
2. Set your domain in `APP_CORS_ALLOWED_ORIGINS`.
3. Deploy with:

```powershell
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

In production mode:
- `proxy` serves frontend and forwards `/api/*` + `/uploads/*` to backend.
- Backend and MongoDB are internal services (not exposed directly).

## 11. CI Pipeline

GitHub Actions workflow is available at:
- `.github/workflows/ci.yml`

On push/pull request to `main`, it runs:
1. Frontend lint and build
2. Backend compile
3. Docker image build checks for frontend and backend

## 12. Operations

See `docs/OPERATIONS.md` for:
- MongoDB backup/restore commands
- Security hardening checklist
- Monitoring recommendations
- Cloud media migration notes
