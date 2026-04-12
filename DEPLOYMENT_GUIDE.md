# Production Deployment Guide

This guide covers:

- Prisma migration strategy with a **single baseline migration**
- Demo data seeding
- Deploying to **Vercel + PostgreSQL**
- Deploying to **your own VPS (including aaPanel)**

---

## 1) Prisma Migration Status (Single File)

Your migrations are now consolidated into:

- `prisma/migrations/20260409204500_baseline/migration.sql`

Current migration folder contains only:

- `prisma/migrations/migration_lock.toml`
- `prisma/migrations/20260409204500_baseline/migration.sql`

### Important

- This baseline migration is ideal for **new/fresh databases**.
- For an **existing production DB**, do **not** drop data. Use the safe workflow below.

---

## 2) Database Environments

Recommended:

- **Development DB**
- **Staging DB**
- **Production DB**

Use separate connection strings for each.

Required env vars:

- `DATABASE_URL` (Prisma runtime)
- `DIRECT_URL` (Prisma migrations, usually direct DB host connection)

---

## 3) Safe Prisma Workflow

### A) Fresh Database (new project setup)

```bash
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
```

What happens:

- Baseline schema is created
- Demo/admin data is inserted via `prisma/seed.ts`

### B) Existing Database (already has data)

1. Backup DB first.
2. Ensure schema in production already matches the current `schema.prisma`.
3. Mark baseline migration as applied without re-running SQL:

```bash
npx prisma migrate resolve --applied 20260409204500_baseline
```

4. Then for future schema changes, create new migrations normally:

```bash
npx prisma migrate dev --name <change_name>
```

5. Deploy those new migrations with:

```bash
npx prisma migrate deploy
```

---

## 4) Demo Data / Seed Data

Seed file:

- `prisma/seed.ts`

It includes:

- Default admin user
- Services
- Projects
- Default site settings

Run seed:

```bash
npm run db:seed
```

If data already exists, seed logic uses checks/upserts and skips duplicates where implemented.

---

## 5) Vercel + PostgreSQL Deployment (Live)

## Step 1: Create PostgreSQL DB

Use any managed PostgreSQL provider:

- Supabase
- Neon
- Railway
- Render
- RDS

Collect:

- Connection string (pooled/runtime)
- Direct connection string (non-pooled, for migrations)

## Step 2: Set Vercel Environment Variables

In Vercel Project → Settings → Environment Variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY` (if using email)
- Any payment/env keys you use

## Step 3: Build/Install settings

Recommended build command:

```bash
npm run build
```

Add post-deploy migration command via Vercel build pipeline if needed:

```bash
npx prisma migrate deploy && npm run build
```

## Step 4: Seed once (optional)

Run from local machine or CI against production DB:

```bash
DATABASE_URL=... DIRECT_URL=... npm run db:seed
```

## Step 5: Verify

- App loads
- Login works
- Admin dashboard works
- Orders/messages/payments pages query DB correctly

---

## 6) VPS Deployment (Node + Nginx + PM2)

This is the recommended VPS path (works with Ubuntu/Debian).

## Step 1: Install dependencies on VPS

```bash
sudo apt update
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

## Step 2: Deploy app code

```bash
git clone <your-repo-url> app
cd app
npm install
```

## Step 3: Configure environment

Create `.env.production` (or `.env`) with:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=https://your-domain.com`
- Other required keys

## Step 4: Prisma + build

```bash
npm run db:generate
npx prisma migrate deploy
npm run build
```

Optional first-time seed:

```bash
npm run db:seed
```

## Step 5: Run with PM2

```bash
pm2 start npm --name "uptix-agency" -- start
pm2 save
pm2 startup
```

## Step 6: Nginx reverse proxy

Example `/etc/nginx/sites-available/uptix`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/uptix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Add SSL:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 7) VPS with aaPanel (Step-by-step)

## Step 1: Prepare aaPanel

- Create site for your domain
- Enable reverse proxy
- Install Node.js manager (or use PM2 from terminal)

## Step 2: Upload/clone project

- Put project under something like:
  - `/www/wwwroot/agency-website`

## Step 3: Environment file

Create `.env.production` in project root with all required variables.

## Step 4: Install + build + migrate

From aaPanel terminal:

```bash
cd /www/wwwroot/agency-website
npm install
npm run db:generate
npx prisma migrate deploy
npm run build
```

Optional seed:

```bash
npm run db:seed
```

## Step 5: Start app process

Using PM2:

```bash
pm2 start npm --name "uptix-agency" -- start
pm2 save
```

## Step 6: Configure aaPanel reverse proxy

Proxy domain → `http://127.0.0.1:3000`

Enable SSL from aaPanel (Let’s Encrypt).

---

## 8) Production Checklist

- [ ] `DATABASE_URL` and `DIRECT_URL` correct
- [ ] `NEXTAUTH_URL` set to live domain
- [ ] `NEXTAUTH_SECRET` strong random value
- [ ] `npx prisma migrate deploy` executed
- [ ] Seed run only when needed
- [ ] SSL enabled
- [ ] PM2 auto-start enabled
- [ ] File upload directory writable (`public/uploads/*`)
- [ ] Google OAuth redirect URLs updated for production

---

## 9) Useful Commands

```bash
# Prisma
npm run db:generate
npx prisma migrate deploy
npx prisma migrate resolve --applied 20260409204500_baseline
npm run db:seed

# App
npm run build
npm start

# PM2
pm2 status
pm2 logs uptix-agency
pm2 restart uptix-agency
```

---

If you want, I can also prepare:

- a production-ready `ecosystem.config.js` for PM2
- an aaPanel-specific Nginx config snippet including caching/static optimization
- a CI deploy script (GitHub Actions) for zero-downtime VPS deploy
