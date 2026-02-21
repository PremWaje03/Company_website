# Operations Guide

## 1. MongoDB Backup and Restore

### Backup

```bash
mongodump --uri="mongodb://localhost:27017/companydb" --out=./backups/companydb-$(date +%Y%m%d)
```

### Restore

```bash
mongorestore --uri="mongodb://localhost:27017/companydb" --drop ./backups/companydb-YYYYMMDD/companydb
```

## 2. Security Checklist

1. Set strong `JWT_SECRET` (32+ bytes).
2. Replace default admin credentials.
3. Restrict `APP_CORS_ALLOWED_ORIGINS` to your exact frontend domain.
4. Use HTTPS with a reverse proxy.

## 3. Recommended Monitoring

1. Add structured logging sink (for example, Loki/ELK).
2. Track backend API status with uptime checks.
3. Configure Docker container restart policy (`unless-stopped` is already used).

## 4. Optional Cloud Media Upgrade

Current team images are stored on local disk via `/uploads`.
For horizontal scaling, move to cloud object storage:
1. Add S3/Cloudinary service adapter.
2. Store only public URL in `photoUrl`.
3. Keep existing API contract unchanged.
