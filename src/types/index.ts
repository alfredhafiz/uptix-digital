export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: "ADMIN" | "CLIENT";
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  budget?: number | null;
  status: OrderStatus;
  timeline?: string | null;
  files: string[];
  dueDate?: Date | null;
  revisionCount: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  messages?: Message[];
  payments?: Payment[];
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  orderId?: string | null;
  recipientId?: string | null;
  isGeneral: boolean;
  attachments: string[];
  createdAt: Date;
  read: boolean;
  user?: User;
  order?: Order;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  authorId: string;
  author?: User;
  tags: string[];
  metaTitle?: string | null;
  metaDesc?: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  previewUrl?: string | null;
  repoUrl?: string | null;
  images: string[];
  techStack: string[];
  category: string;
  featured: boolean;
  published: boolean;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  order?: Order;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  txnId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceType =
  | "WEB_DEVELOPMENT"
  | "APP_DEVELOPMENT"
  | "PERFORMANCE_OPTIMIZATION"
  | "API_DEVELOPMENT"
  | "PYTHON_APPLICATION"
  | "MOBILE_APP"
  | "CONSULTATION"
  | "FULL_STACK";

export type OrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "REVISION"
  | "REVIEW"
  | "DONE"
  | "CANCELLED";

export type PaymentMethod =
  | "BINANCE_PAY"
  | "STRIPE"
  | "PAYPAL"
  | "BANK_TRANSFER";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
