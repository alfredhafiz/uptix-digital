"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  RotateCcw,
  XCircle,
  Calendar,
  DollarSign,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Timer,
  CreditCard,
  FileText,
  TrendingUp,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderTimeline } from "@/components/dashboard/order-timeline";
import { OrderChat } from "@/components/dashboard/order-chat";
import { OrderAuditTimeline } from "@/components/admin/order-audit-timeline";
import { DeadlineCard } from "@/components/shared/deadline-indicator";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  orderId: string;
  action: string;
  details: string;
  createdAt: Date | string;
}

interface OrderUser {
  id: string;
  name: string | null;
  email: string;
}

interface OrderDetail {
  id: string;
  title: string;
  description: string;
  serviceType: string;
  status: string;
  budget: number | null;
  timeline: string | null;
  dueDate: string | null;
  revisionCount: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  files: string[];
  user: OrderUser;
  payments: Payment[];
  auditLogs?: AuditLog[];
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    glow: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending Review",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    glow: "shadow-yellow-500/20",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "shadow-blue-500/20",
    icon: TrendingUp,
  },
  REVISION: {
    label: "Revision",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/20",
    icon: RotateCcw,
  },
  REVIEW: {
    label: "Under Review",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    icon: AlertCircle,
  },
  DONE: {
    label: "Completed",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "shadow-green-500/20",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/20",
    icon: XCircle,
  },
};

const SERVICE_LABELS: Record<string, string> = {
  WEB_DEVELOPMENT: "Web Development",
  APP_DEVELOPMENT: "App Development",
  API_DEVELOPMENT: "API Development",
  PYTHON_APPLICATION: "Python Application",
  MOBILE_APP: "Mobile App",
  PERFORMANCE_OPTIMIZATION: "Performance Optimization",
  FULL_STACK: "Full Stack Development",
  CONSULTATION: "Consultation",
};

// ─── Time left helpers ────────────────────────────────────────────────────────
function getTimeLeft(
  dueDate: string | null,
  timeline: string | null,
  createdAt: string,
) {
  let due: Date | null = null;

  if (dueDate) {
    due = new Date(dueDate);
  } else if (timeline) {
    // Try to parse "2 months", "3 weeks", "30 days" etc.
    const created = new Date(createdAt);
    const match = timeline.match(/(\d+)\s*(day|week|month)/i);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      due = new Date(created);
      if (unit.startsWith("d")) due.setDate(due.getDate() + num);
      else if (unit.startsWith("w")) due.setDate(due.getDate() + num * 7);
      else if (unit.startsWith("m")) due.setMonth(due.getMonth() + num);
    }
  }

  if (!due) return null;

  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const totalDuration = due.getTime() - new Date(createdAt).getTime();
  const elapsed = now.getTime() - new Date(createdAt).getTime();
  const progressPct = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalDuration) * 100)),
  );

  return {
    days: Math.abs(totalDays),
    isOverdue: diff < 0,
    progressPct,
    dueStr: due.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

// ─── Mini stat card ───────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-blue-400",
  bg = "bg-blue-500/10",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
  bg?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border border-white/10 ${bg}`}
    >
      <div
        className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0 border border-white/10`}
      >
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-white font-semibold text-sm truncate">{value}</p>
        {sub && <p className="text-slate-500 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface OrderDetailClientProps {
  orderId: string;
  userId: string;
  initialOrder: OrderDetail;
  auditLogs?: Array<{
    id: string;
    orderId: string;
    action: string;
    details: string;
    createdAt: Date | string;
  }>;
}

export function OrderDetailClient({
  orderId,
  userId,
  initialOrder,
  auditLogs = [],
}: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail>(initialOrder);
  const [activeTab, setActiveTab] = useState("overview");
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [revisionSuccess, setRevisionSuccess] = useState(false);

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const timeLeft = getTimeLeft(order.dueDate, order.timeline, order.createdAt);
  const totalPaid = order.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  // Refresh order data
  async function refreshOrder() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch {}
  }

  async function requestRevision() {
    if (isRequestingRevision) return;
    setIsRequestingRevision(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_revision" }),
      });
      if (res.ok) {
        setRevisionSuccess(true);
        await refreshOrder();
        setTimeout(() => setRevisionSuccess(false), 3000);
      }
    } finally {
      setIsRequestingRevision(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Back button ───────────────────────────────────────────────── */}
      <Link href="/client/orders">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </Link>

      {/* ── Hero header card ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border ${statusCfg.border} bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl ${statusCfg.glow}`}
      >
        {/* Decorative glow blob */}
        <div
          className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 ${statusCfg.bg}`}
        />

        <div className="relative flex flex-col md:flex-row md:items-start gap-4">
          {/* Status icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${statusCfg.bg} border ${statusCfg.border}`}
          >
            <motion.div
              animate={
                order.status === "IN_PROGRESS" ? { scale: [1, 1.1, 1] } : {}
              }
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <StatusIcon className={`w-7 h-7 ${statusCfg.color}`} />
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                {order.title}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}
              >
                {statusCfg.label}
              </span>
              {order.revisionCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400">
                  {order.revisionCount} revision
                  {order.revisionCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {SERVICE_LABELS[order.serviceType] ||
                order.serviceType.replace(/_/g, " ")}
              &nbsp;·&nbsp;
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Time left badge */}
          {timeLeft &&
            order.status !== "DONE" &&
            order.status !== "CANCELLED" && (
              <div
                className={`shrink-0 px-4 py-2 rounded-xl border text-center ${
                  timeLeft.isOverdue
                    ? "bg-red-500/15 border-red-500/30"
                    : timeLeft.days <= 3
                      ? "bg-orange-500/15 border-orange-500/30"
                      : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <Timer
                    className={`w-3.5 h-3.5 ${
                      timeLeft.isOverdue
                        ? "text-red-400"
                        : timeLeft.days <= 3
                          ? "text-orange-400"
                          : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      timeLeft.isOverdue
                        ? "text-red-400"
                        : timeLeft.days <= 3
                          ? "text-orange-300"
                          : "text-slate-300"
                    }`}
                  >
                    {timeLeft.isOverdue
                      ? `${timeLeft.days}d overdue`
                      : `${timeLeft.days}d left`}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Due {timeLeft.dueStr}
                </p>
              </div>
            )}
        </div>

        {/* Progress bar */}
        {timeLeft &&
          order.status !== "DONE" &&
          order.status !== "CANCELLED" && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 text-xs">Time elapsed</span>
                <span className="text-slate-400 text-xs">
                  {timeLeft.progressPct}%
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    timeLeft.isOverdue
                      ? "bg-red-500"
                      : timeLeft.progressPct > 80
                        ? "bg-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${timeLeft.progressPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
      </motion.div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={DollarSign}
          label="Budget"
          value={order.budget ? `$${order.budget.toLocaleString()}` : "TBD"}
          color="text-green-400"
          bg="bg-green-500/10"
        />
        <StatCard
          icon={CreditCard}
          label="Paid"
          value={`$${totalPaid.toFixed(2)}`}
          sub={`${order.payments.filter((p) => p.status === "COMPLETED").length} payment(s)`}
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <StatCard
          icon={Calendar}
          label="Timeline"
          value={order.timeline || "Not set"}
          sub={
            order.startedAt
              ? `Started ${new Date(order.startedAt).toLocaleDateString()}`
              : undefined
          }
          color="text-purple-400"
          bg="bg-purple-500/10"
        />
        <StatCard
          icon={Layers}
          label="Service"
          value={SERVICE_LABELS[order.serviceType] || "Custom"}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
        />
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 p-1 h-auto gap-1">
          {[
            { value: "overview", label: "Overview", icon: LayoutDashboard },
            { value: "timeline", label: "Timeline", icon: TrendingUp },
            { value: "chat", label: "Chat", icon: MessageSquare },
            { value: "activity", label: "Activity", icon: Clock },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 hover:text-white px-4 py-2 text-sm"
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4"
          >
            {/* Main details */}
            <div className="lg:col-span-2 space-y-5">
              {/* Description */}
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {order.description}
                  </p>
                </CardContent>
              </Card>

              {/* Payments */}
              {order.payments.length > 0 && (
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-400" />
                      Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8"
                        >
                          <div>
                            <p className="text-white font-semibold text-sm">
                              ${payment.amount.toFixed(2)}
                            </p>
                            <p className="text-slate-500 text-xs capitalize">
                              {payment.method
                                ?.replace(/_/g, " ")
                                .toLowerCase() || "Bank Transfer"}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                payment.status === "COMPLETED"
                                  ? "bg-green-500/15 text-green-400"
                                  : payment.status === "PENDING"
                                    ? "bg-yellow-500/15 text-yellow-400"
                                    : "bg-red-500/15 text-red-400"
                              }`}
                            >
                              {payment.status}
                            </span>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Uploaded files */}
              {order.files && order.files.length > 0 && (
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Attached Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {order.files.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/15 hover:bg-white/15 transition-colors text-sm text-slate-300 hover:text-white"
                        >
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="max-w-[160px] truncate">
                            {url.split("/").pop()}
                          </span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar actions */}
            <div className="space-y-4">
              {/* Deadline card */}
              <DeadlineCard
                dueDate={order.dueDate ? new Date(order.dueDate) : null}
                createdAt={new Date(order.createdAt)}
                completedAt={
                  order.completedAt ? new Date(order.completedAt) : null
                }
              />

              {/* Status card */}
              <Card className={`border ${statusCfg.border} ${statusCfg.bg}`}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-4">
                    <StatusIcon className={`w-5 h-5 ${statusCfg.color}`} />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {statusCfg.label}
                      </p>
                      {order.status === "PENDING" && (
                        <p className="text-slate-400 text-xs">
                          Under review, starting soon
                        </p>
                      )}
                      {order.status === "IN_PROGRESS" && (
                        <p className="text-slate-400 text-xs">
                          Actively being developed
                        </p>
                      )}
                      {order.status === "REVIEW" && (
                        <p className="text-slate-400 text-xs">
                          Quality testing in progress
                        </p>
                      )}
                      {order.status === "REVISION" && (
                        <p className="text-slate-400 text-xs">
                          Implementing your feedback
                        </p>
                      )}
                      {order.status === "DONE" && (
                        <p className="text-green-400 text-xs font-medium">
                          🎉 Project complete!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Request Revision – only when REVIEW or DONE */}
                    {(order.status === "REVIEW" || order.status === "DONE") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 text-xs"
                        onClick={requestRevision}
                        disabled={isRequestingRevision}
                      >
                        {isRequestingRevision ? (
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3 mr-1.5" />
                        )}
                        Request Revision
                      </Button>
                    )}

                    <AnimatePresence>
                      {revisionSuccess && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-orange-400 text-center py-1"
                        >
                          ✓ Revision requested
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Make payment */}
                    {order.status !== "DONE" &&
                      order.status !== "CANCELLED" &&
                      order.budget &&
                      order.budget > 0 && (
                        <Link href={`/client/payment?orderId=${order.id}`}>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs"
                          >
                            <CreditCard className="w-3 h-3 mr-1.5" />
                            Make Payment
                          </Button>
                        </Link>
                      )}

                    {/* Go to chat tab */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs"
                      onClick={() => setActiveTab("chat")}
                    >
                      <MessageSquare className="w-3 h-3 mr-1.5" />
                      Message Team
                    </Button>

                    <Link href="/client/invoices">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-slate-400 hover:text-white text-xs"
                      >
                        View Invoices
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Order meta info */}
              <Card className="glass-card border-white/10">
                <CardContent className="pt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Order ID</span>
                    <span className="text-white font-mono text-xs">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Created</span>
                    <span className="text-white text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {order.startedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Started</span>
                      <span className="text-white text-xs">
                        {new Date(order.startedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {order.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Completed</span>
                      <span className="text-green-400 text-xs font-medium">
                        {new Date(order.completedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  )}
                  {order.revisionCount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Revisions</span>
                      <span className="text-orange-400 text-xs font-medium">
                        {order.revisionCount}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>

        {/* ── TIMELINE TAB ─────────────────────────────────────────────── */}
        <TabsContent value="timeline">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-2xl"
          >
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline
                  status={order.status}
                  createdAt={new Date(order.createdAt)}
                  startedAt={order.startedAt ? new Date(order.startedAt) : null}
                  completedAt={
                    order.completedAt ? new Date(order.completedAt) : null
                  }
                  dueDate={order.dueDate ? new Date(order.dueDate) : null}
                  revisionCount={order.revisionCount}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── CHAT TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="chat">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <OrderChat orderId={orderId} clientId={userId} />
          </motion.div>
        </TabsContent>

        {/* ── ACTIVITY TAB ─────────────────────────────────────────────── */}
        <TabsContent value="activity">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-2xl"
          >
            <Card className="glass-card border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderAuditTimeline logs={auditLogs} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
