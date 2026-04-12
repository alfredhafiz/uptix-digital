# 🚀 Uptix Digital Agency - Complete Documentation

A production-ready full-stack **Service Agency Platform** built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**. Features role-based authentication, client/admin dashboards, real-time messaging, project management, and comprehensive analytics.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Database Architecture](#database-architecture)
5. [Installation & Setup](#installation--setup)
6. [Project Structure](#project-structure)
7. [Authentication & Authorization](#authentication--authorization)
8. [API Documentation](#api-documentation)
9. [Admin Features](#admin-features)
10. [Client Features](#client-features)
11. [Development Guide](#development-guide)
12. [Deployment](#deployment)

---

## 🎯 Overview

**Uptix Digital** is a complete digital agency management system that handles:

- **Multi-user platform** with ADMIN and CLIENT roles
- **Real-world service management** - Web, Mobile, API, Python, Performance, Full-Stack services
- **Complete project lifecycle** - from order creation to payment and completion
- **Admin control panel** for managing all aspects of the platform
- **Client portal** for managing their orders and communications
- **Payment integration** - Binance Pay, Stripe, PayPal (ready)
- **Analytics & monitoring** - Page views, audit logs, user analytics

---

## ✨ Key Features

### 🌐 **Public Website**

- Landing page with glassmorphism design
- Service showcase pages with pricing and features
- Project portfolio with filtering and search
- Blog/News system with full CMS
- FAQ, Contact, About, Terms, Privacy pages
- SEO optimized with sitemaps and metadata
- Custom interactive cursor with gradient effects
- Responsive design for all devices

### 👤 **Client Dashboard** (`/client/*`)

- **Dashboard** - Overview of orders, messages, and activity
- **Orders** → Create new orders, track status, manage files
- **Messages** → Real-time chat with admin team
- **Payments** → Invoice tracking and payment history
- **Invoices** → Download and view all invoices
- **Settings** → Profile management, password change

### 🛠️ **Admin Dashboard** (`/admin/*`)

- **Dashboard** → System overview and quick stats
- **Analytics** → Page views, user metrics, performance data
- **Users** → Manage clients, view profiles, reset passwords
- **Orders** → Track all orders, update status, manage payments
- **Messages Panel** → Real-time chat with all clients (NEW)
- **Blog Management** → Create/edit/publish posts
- **Projects** → Add/edit showcase projects
- **Services** → Configure service offerings
- **Settings** → Site configuration and email settings

### 🔐 **Authentication & Security**

- Google OAuth integration
- Email/Password authentication
- JWT-based sessions (30 days)
- NextAuth.js v4
- Password hashing with bcryptjs
- Rate limiting on sensitive endpoints
- XSS protection via DOMPurify
- Two-factor authentication support (2FA)
- Email verification flow

### 💬 **Messaging System**

- Client-to-Admin real-time messaging
- Message persistence in database
- View read status
- Search and filter messages
- Auto-scroll to latest messages

### 💳 **Payment System**

- Multiple payment methods (Binance Pay, Stripe, PayPal)
- Payment status tracking
- Invoice generation
- Transaction history

---

## 🛠️ Tech Stack

| Layer                | Technology                      |
| -------------------- | ------------------------------- |
| **Framework**        | Next.js 16 (App Router)         |
| **Language**         | TypeScript 5.2                  |
| **Styling**          | Tailwind CSS 3.4 + PostCSS      |
| **UI Components**    | Shadcn UI + Radix UI            |
| **Database**         | PostgreSQL (Supabase)           |
| **ORM**              | Prisma 5.22                     |
| **Authentication**   | NextAuth.js 4.24 + Google OAuth |
| **Password Hashing** | bcryptjs 2.4                    |
| **Email**            | Resend + Nodemailer 7.0         |
| **File Upload**      | Custom multipart handler        |
| **Real-time**        | Socket.io 4.7                   |
| **Animations**       | Framer Motion 10.18             |
| **Monitoring**       | Sentry, New Relic               |
| **Search**           | Algolia                         |
| **Speed Insights**   | Vercel Speed Insights           |

---

## 🗄️ Database Schema Overview

**11 Core Models:**

- **User** - Accounts, authentication, roles
- **Service** - Service offerings and pricing
- **Order** - Client project orders
- **Message** - Order and admin messaging
- **Payment** - Transaction tracking
- **Blog** - Content management system
- **Project** - Portfolio showcase items
- **Settings** - Site configuration
- **AuditLog** - Activity logging
- **PageView** - Analytics tracking
- **Account, Session, VerificationToken** - NextAuth support

---

## 💿 Installation & Setup

### **Prerequisites**

- Node.js 18+
- PostgreSQL (Supabase recommended)
- npm 9+

### **Quick Start**

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (.env.local)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 3. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Run development server
npm run dev
# Visit http://localhost:3000
```

### **Admin Access After Setup**

```
Email: uptixdigital@gmail.com
Password: uptix442X@#
Access: http://localhost:3000/admin/dashboard
```

---

## 🔐 Authentication

- **Supports:** Google OAuth, Email/Password
- **Password Hashing:** bcryptjs (10 salt rounds)
- **Session:** JWT, 30 days max age
- **Default Admin:** Created automatically on seed

---

## 📡 Key APIs

### Admin Messages (NEW)

- `GET /api/admin/messages?userId={id}` - Get client messages
- `POST /api/admin/messages` - Send message to client

### Orders

- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order

### Messages

- `GET /api/messages?orderId={id}` - Order messages
- `POST /api/messages` - Send message

### Payments

- `GET /api/payments/{orderId}` - Payment history
- `POST /api/payments` - Create payment

---

## 🎛️ Admin Dashboard Features

1. **Messages** - Real-time chat with clients (auto-refresh every 2 seconds)
2. **Dashboard** - System metrics and recent activity
3. **Users** - Manage client accounts
4. **Orders** - Track and manage all orders
5. **Blog** - Content management
6. **Projects** - Manage portfolio
7. **Services** - Configure service offerings
8. **Analytics** - Traffic and usage statistics
9. **Settings** - Site configuration

---

## 👤 Client Dashboard Features

1. **Dashboard** - Overview and quick stats
2. **Orders** - Create and track orders
3. **Messages** - Chat with admin team
4. **Payments** - Payment gateway and tracking
5. **Invoices** - Download invoices
6. **Settings** - Account management

---

## 📁 Key Directories

- `/src/app/admin/*` - Admin pages
- `/src/app/client/*` - Client pages
- `/src/app/api/admin/*` - Admin API
- `/src/app/api/client/*` - Client API (if any)
- `/src/components/admin/*` - Admin components
- `/src/lib/*` - Business logic and utilities
- `/prisma/` - Database schema and migrations

---

## 🚀 Deployment (Vercel Recommended)

```bash
git push origin main  # Auto-deploys
```

For full production deployment (Vercel + any PostgreSQL + VPS/aaPanel), see:

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

### Prisma Migration (Squashed)

Migrations were consolidated into a single baseline migration:

- `prisma/migrations/20260409204500_baseline/migration.sql`

Use this baseline for **fresh databases**.

For existing databases, follow the migration strategy in `DEPLOYMENT_GUIDE.md` before applying changes in production.

---

## 📊 What's Included

✅ Full authentication system
✅ Role-based access control (ADMIN/CLIENT)
✅ Real-time admin messaging panel
✅ Order management system
✅ Payment integrations (ready)
✅ Blog/CMS system
✅ Analytics tracking
✅ File upload support
✅ Email notifications
✅ 2FA support (ready)
✅ Audit logging
✅ Production-optimized code

---

## 🛠️ Development Commands

```bash
# Development
npm run dev
npm run build
npm start

# Database
npm run db:migrate      # Create migration
npm run db:seed         # Seed with demo data
npm run db:studio       # Open GUI

# Code Quality
npm run lint
npm run type-check
npm run format
```

---

**Version:** 1.0.0 | **Last Updated:** Feb 19, 2026 | **Status:** Production Ready ✅
