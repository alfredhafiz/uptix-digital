/**
 * Application Constants
 * Centralized place for magic strings, enum values, and configuration
 */

// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Order Status
export const ORDER_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Service Types
export const SERVICE_TYPES = {
  WEB_DEVELOPMENT: "WEB_DEVELOPMENT",
  APP_DEVELOPMENT: "APP_DEVELOPMENT",
  PERFORMANCE_OPTIMIZATION: "PERFORMANCE_OPTIMIZATION",
  API_DEVELOPMENT: "API_DEVELOPMENT",
  PYTHON_APPLICATION: "PYTHON_APPLICATION",
  MOBILE_APP: "MOBILE_APP",
  CONSULTATION: "CONSULTATION",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

// Payment Methods
export const PAYMENT_METHODS = {
  BINANCE_PAY: "BINANCE_PAY",
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"],
} as const;

// Content Length Constraints
export const CONTENT_LIMITS = {
  EMAIL_MAX: 255,
  USER_NAME_MIN: 2,
  USER_NAME_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  BLOG_TITLE_MAX: 200,
  BLOG_EXCERPT_MAX: 500,
  BLOG_CONTENT_MAX: 50000,
  PROJECT_TITLE_MAX: 200,
  PROJECT_DESC_MAX: 2000,
  MESSAGE_MAX: 5000,
  CONTACT_MESSAGE_MAX: 2000,
  ORDER_TITLE_MAX: 200,
  ORDER_DESC_MAX: 5000,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  CONTACT_FORM: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
  },
  REGISTRATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
  },
  LOGIN_ATTEMPT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
  },
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  CLIENT_DASHBOARD: "/client/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  BLOG: "/blog",
  SERVICES: "/services",
  PROJECTS: "/projects",
  CONTACT: "/contact",
  ABOUT: "/about",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/nextauth",
    LOGOUT: "/api/auth/signout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },
  ORDERS: "/api/orders",
  MESSAGES: "/api/messages",
  PAYMENTS: "/api/payments",
  CONTACT: "/api/contact",
  UPLOAD: "/api/upload",
  USER: {
    PROFILE: "/api/user/profile",
    PASSWORD: "/api/user/password",
  },
  ADMIN: {
    ANALYTICS: "/api/admin/analytics",
    BLOG: "/api/admin/blog",
    PROJECTS: "/api/admin/projects",
    SERVICES: "/api/admin/services",
    SETTINGS: "/api/admin/settings",
  },
} as const;

// Cookie Names
export const COOKIES = {
  SESSION_TOKEN: "next-auth.session-token",
  SECURE_SESSION_TOKEN: "__Secure-next-auth.session-token",
  CSRF_TOKEN: "__Host-csrf-token",
  VERIFICATION_EMAIL_TOKEN: "__Host-verification-token",
  PASSWORD_RESET_TOKEN: "__Host-reset-token",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "This email is already registered.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  UNAUTHORIZED: "You do not have permission to access this resource.",
  FORBIDDEN: "Access forbidden.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "An error occurred. Please try again later.",
  INVALID_FILE: "Invalid file. Please check the file type and size.",
  EMAIL_SEND_FAILED: "Failed to send email. Please try again later.",
  PAYMENT_FAILED: "Payment processing failed. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS:
    "Registration successful! Please check your email to verify your account.",
  LOGIN_SUCCESS: "Logged in successfully.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  PASSWORD_CHANGED: "Password changed successfully.",
  PROFILE_UPDATED: "Profile updated successfully.",
  EMAIL_SENT: "Email sent successfully.",
  ORDER_CREATED: "Order created successfully.",
  PAYMENT_INITIATED: "Payment initiated. Redirecting to payment gateway...",
} as const;

// Email Configuration
export const EMAIL = {
  LOGO_URL: process.env.NEXT_PUBLIC_APP_URL + "/logo.png",
  SUPPORT_EMAIL: process.env.ADMIN_EMAIL || "support@example.com",
  TEMPLATES: {
    WELCOME: "welcome",
    ORDER_CONFIRMATION: "order-confirmation",
    PAYMENT_CONFIRMATION: "payment-confirmation",
    NEW_ORDER_ADMIN: "new-order-admin",
    VERIFICATION: "email-verification",
    PASSWORD_RESET: "password-reset",
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  BLOG_POST: 3600, // 1 hour
  SERVICE: 3600, // 1 hour
  PROJECT: 3600, // 1 hour
  USER_PROFILE: 600, // 10 minutes
  ANALYTICS: 300, // 5 minutes
} as const;

/**
 * Helper function to get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    [USER_ROLES.ADMIN]: "Administrator",
    [USER_ROLES.CLIENT]: "Client",
  };
  return names[role] || role;
};

/**
 * Helper function to get order status display name
 */
export const getOrderStatusDisplayName = (status: OrderStatus): string => {
  const names: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: "Pending",
    [ORDER_STATUS.IN_PROGRESS]: "In Progress",
    [ORDER_STATUS.REVIEW]: "Under Review",
    [ORDER_STATUS.DONE]: "Completed",
    [ORDER_STATUS.CANCELLED]: "Cancelled",
  };
  return names[status] || status;
};

/**
 * Helper function to get payment status display name
 */
export const getPaymentStatusDisplayName = (status: PaymentStatus): string => {
  const names: Record<PaymentStatus, string> = {
    [PAYMENT_STATUS.PENDING]: "Pending",
    [PAYMENT_STATUS.COMPLETED]: "Completed",
    [PAYMENT_STATUS.FAILED]: "Failed",
    [PAYMENT_STATUS.REFUNDED]: "Refunded",
  };
  return names[status] || status;
};
