import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/admin-shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderTimeline } from "@/components/dashboard/order-timeline";
import { OrderChat } from "@/components/dashboard/order-chat";
import { AdminOrderStatusManager } from "@/components/admin/order-status-manager";
import { OrderInternalNotes } from "@/components/admin/order-internal-notes";
import { OrderAuditTimeline } from "@/components/admin/order-audit-timeline";
import { DeadlineCard } from "@/components/shared/deadline-indicator";
import { getOrderAuditLogs } from "@/lib/order-audit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Details | Uptix Admin",
  description: "View and manage this order.",
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  REVISION: {
    label: "Revision",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
  REVIEW: {
    label: "Under Review",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  DONE: {
    label: "Completed",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") redirect("/auth/login");
  if (!id) redirect("/admin/orders");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      payments: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) redirect("/admin/orders");

  // Fetch audit logs separately (will populate once Prisma client regenerates)
  let auditLogs: any[] = [];
  try {
    auditLogs = await getOrderAuditLogs(id);
  } catch (error) {
    console.warn("Audit logs not yet available");
  }

  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const totalPaid = order.payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Back */}
        <Link href="/admin/orders">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <DashboardHeader
            heading={order.title}
            text={`Order #${order.id.slice(-8).toUpperCase()}`}
          />
          <Badge className={`${cfg.className} border text-sm px-3 py-1 h-auto`}>
            {cfg.label}
          </Badge>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="bg-white/5 border border-white/10 p-1 h-auto gap-1">
            {[
              { value: "overview", label: "Overview" },
              { value: "timeline", label: "Timeline" },
              { value: "chat", label: "Order Chat" },
              { value: "activity", label: "Activity" },
            ].map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 px-4 py-2 text-sm"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
              <div className="lg:col-span-2 space-y-5">
                {/* Details grid */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        {
                          icon: FileText,
                          label: "Service",
                          value: order.serviceType.replace(/_/g, " "),
                        },
                        {
                          icon: DollarSign,
                          label: "Budget",
                          value: order.budget
                            ? `$${order.budget.toLocaleString()}`
                            : "TBD",
                        },
                        {
                          icon: Clock,
                          label: "Timeline",
                          value: order.timeline || "Not set",
                        },
                        {
                          icon: Calendar,
                          label: "Created",
                          value: new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          ),
                        },
                        {
                          icon: DollarSign,
                          label: "Total Paid",
                          value: `$${totalPaid.toFixed(2)}`,
                        },
                        {
                          icon: RotateCcw,
                          label: "Revisions",
                          value: String(order.revisionCount),
                        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5"
                        >
                          <Icon className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-slate-500 text-xs">{label}</p>
                            <p className="text-white text-sm font-medium">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Deadline Card */}
                <DeadlineCard
                  dueDate={order.dueDate}
                  createdAt={order.createdAt}
                  completedAt={order.completedAt}
                />

                {/* Description */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">
                      Description
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
                      <CardTitle className="text-white text-base">
                        Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                          >
                            <div>
                              <p className="text-white font-semibold text-sm">
                                ${payment.amount.toFixed(2)}
                              </p>
                              <p className="text-slate-500 text-xs capitalize">
                                {payment.method
                                  ?.replace(/_/g, " ")
                                  .toLowerCase()}
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
                                {new Date(
                                  payment.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Status manager */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">
                      Manage Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdminOrderStatusManager
                      orderId={order.id}
                      currentStatus={order.status}
                      currentDueDate={order.dueDate?.toISOString() ?? null}
                    />
                  </CardContent>
                </Card>

                {/* Internal Notes */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">
                      Internal Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OrderInternalNotes
                      orderId={order.id}
                      initialNotes={order.internalNotes}
                    />
                  </CardContent>
                </Card>

                {/* Client info */}
                <Card className="glass-card border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(order.user.name || order.user.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {order.user.name || "No name"}
                        </p>
                        <p className="text-slate-400 text-xs truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/users/${order.user.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 text-slate-400 hover:text-white text-xs"
                      >
                        View Client Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TIMELINE */}
          <TabsContent value="timeline">
            <div className="mt-4 max-w-2xl">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-base">
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline
                    status={order.status}
                    createdAt={order.createdAt}
                    startedAt={order.startedAt}
                    completedAt={order.completedAt}
                    dueDate={order.dueDate}
                    revisionCount={order.revisionCount}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CHAT */}
          <TabsContent value="chat">
            <div className="mt-4">
              <OrderChat orderId={order.id} clientId={order.userId} />
            </div>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity">
            <div className="mt-4 max-w-2xl">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
