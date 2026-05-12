# Database Backups — Elsalam Website

This folder contains PostgreSQL database backups for the `elsalam_db` database.

## How to Restore

```bash
# 1. Create the database (if not exists)
psql -U postgres -c "CREATE DATABASE elsalam_db;"

# 2. Restore from backup
psql -U postgres -d elsalam_db -f elsalam_db_backup_YYYY-MM-DD.sql
```

## How to Create a New Backup

```bash
pg_dump -U postgres -d elsalam_db -F p -f database/elsalam_db_backup_$(date +%Y-%m-%d).sql
```

## Notes
- Backups are plain SQL format (`.sql`) — human readable
- Always backup before running `prisma migrate deploy` in production
