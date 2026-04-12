-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM (
  'WEB_DEVELOPMENT',
  'APP_DEVELOPMENT',
  'PERFORMANCE_OPTIMIZATION',
  'API_DEVELOPMENT',
  'PYTHON_APPLICATION',
  'MOBILE_APP',
  'CONSULTATION',
  'FULL_STACK'
);

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'REVISION',
  'REVIEW',
  'DONE',
  'CANCELLED'
);

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM (
  'BINANCE_PAY',
  'STRIPE',
  'PAYPAL',
  'BANK_TRANSFER'
);

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "password" TEXT,
  "role" "Role" NOT NULL DEFAULT 'CLIENT',
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "emailVerified" TIMESTAMP(3),

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,

  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "serviceType" "ServiceType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "budget" DOUBLE PRECISION,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "timeline" TEXT,
  "files" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "dueDate" TIMESTAMP(3),
  "revisionCount" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),

  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "recipientId" TEXT,
  "orderId" TEXT,
  "isGeneral" BOOLEAN NOT NULL DEFAULT false,
  "attachments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderAuditLog" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "details" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OrderAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "coverImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "authorId" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "metaTitle" TEXT,
  "metaDesc" TEXT,
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "previewUrl" TEXT,
  "repoUrl" TEXT,
  "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "techStack" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "category" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "downloads" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "method" "PaymentMethod" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "txnId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'string',
  "description" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "icon" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "changes" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "status" TEXT NOT NULL DEFAULT 'SUCCESS',
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "referrer" TEXT,
  "userAgent" TEXT,
  "ip" TEXT,
  "country" TEXT,
  "city" TEXT,
  "device" TEXT,
  "browser" TEXT,
  "os" TEXT,
  "sessionId" TEXT,
  "userId" TEXT,
  "duration" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");
CREATE UNIQUE INDEX "Settings_key_key" ON "Settings"("key");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- Standard indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Message_userId_idx" ON "Message"("userId");
CREATE INDEX "Message_recipientId_idx" ON "Message"("recipientId");
CREATE INDEX "Message_orderId_idx" ON "Message"("orderId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
CREATE INDEX "OrderAuditLog_orderId_idx" ON "OrderAuditLog"("orderId");
CREATE INDEX "OrderAuditLog_userId_idx" ON "OrderAuditLog"("userId");
CREATE INDEX "OrderAuditLog_action_idx" ON "OrderAuditLog"("action");
CREATE INDEX "OrderAuditLog_createdAt_idx" ON "OrderAuditLog"("createdAt");
CREATE INDEX "OrderAuditLog_orderId_createdAt_idx" ON "OrderAuditLog"("orderId", "createdAt");
CREATE INDEX "Blog_slug_idx" ON "Blog"("slug");
CREATE INDEX "Blog_authorId_idx" ON "Blog"("authorId");
CREATE INDEX "Blog_published_idx" ON "Blog"("published");
CREATE INDEX "Blog_createdAt_idx" ON "Blog"("createdAt");
CREATE INDEX "Project_category_idx" ON "Project"("category");
CREATE INDEX "Project_published_idx" ON "Project"("published");
CREATE INDEX "Project_featured_idx" ON "Project"("featured");
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
CREATE INDEX "Service_slug_idx" ON "Service"("slug");
CREATE INDEX "Service_published_idx" ON "Service"("published");
CREATE INDEX "Service_featured_idx" ON "Service"("featured");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX "PageView_path_idx" ON "PageView"("path");
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");
CREATE INDEX "PageView_country_idx" ON "PageView"("country");
CREATE INDEX "PageView_sessionId_idx" ON "PageView"("sessionId");

-- Foreign keys
ALTER TABLE "Account"
  ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Order"
  ADD CONSTRAINT "Order_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_recipientId_fkey"
  FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Message"
  ADD CONSTRAINT "Message_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderAuditLog"
  ADD CONSTRAINT "OrderAuditLog_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderAuditLog"
  ADD CONSTRAINT "OrderAuditLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Blog"
  ADD CONSTRAINT "Blog_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
