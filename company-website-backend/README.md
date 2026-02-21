# Backend (Spring Boot + MongoDB)

REST API for public website content and admin dashboard.

## Run

```powershell
./mvnw spring-boot:run
```

Default URL: `http://localhost:8081`

## Required Services

- MongoDB running on `mongodb://localhost:27017/companydb` (default)

## Environment Variables

See `.env.example` in this folder for all supported variables.

## Build

```powershell
./mvnw clean package
```

## Docker

```powershell
docker build -t company-backend .
docker run --rm -p 8081:8081 company-backend
```
