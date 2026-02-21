# Frontend (React + Vite)

Public website + admin dashboard UI.

## Run

```powershell
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Environment

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8081
```

## Build

```powershell
npm run build
```

## Docker

```powershell
docker build -t company-frontend .
docker run --rm -p 5173:80 company-frontend
```
