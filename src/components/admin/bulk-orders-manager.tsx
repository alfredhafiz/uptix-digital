"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare2,
  X,
  Download,
  Settings,
  Loader2,
  Copy,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date | string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  budget?: number | null;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
}

interface BulkOrdersManagerProps {
  orders: Order[];
  statusColors: Record<string, string>;
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Under Review" },
  { value: "REVISION", label: "Revision" },
  { value: "DONE", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];
const ALL_STATUSES_VALUE = "__ALL_STATUSES__";

export function BulkOrdersManager({
  orders,
  statusColors,
}: BulkOrdersManagerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Calculate filtered orders first (needed by useCallback)
  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  }, [selectedIds.size, filteredOrders]);

  const toggleOrderSelection = useCallback((orderId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  const selectedOrders = filteredOrders.filter((o) => selectedIds.has(o.id));

  const showNotification = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    if (typeof window !== "undefined") {
      alert(`${type === "success" ? "✅" : "❌"} ${message}`);
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;

    setIsProcessing(true);
    try {
      const updatePromises = Array.from(selectedIds).map(async (orderId) => {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        });
        if (!response.ok) throw new Error(`Failed to update ${orderId}`);
        return response.json();
      });

      const results = await Promise.allSettled(updatePromises);
      const successful = results.filter((r) => r.status === "fulfilled").length;

      showNotification(
        `Updated ${successful}/${selectedIds.size} orders to ${bulkStatus}`,
      );

      setSelectedIds(new Set());
      setBulkStatus(null);

      // Reload page to show updates
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      showNotification("Failed to update orders", "error");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (selectedOrders.length === 0) {
      showNotification("No orders selected", "error");
      return;
    }

    const headers = [
      "Order ID",
      "Title",
      "Client",
      "Status",
      "Budget",
      "Created",
    ];
    const rows = selectedOrders.map((order) => [
      order.id.slice(-8).toUpperCase(),
      order.title,
      order.user.name || order.user.email,
      order.status,
      order.budget ? `$${order.budget}` : "N/A",
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification(`Exported ${selectedOrders.length} orders`);
  };

  const handleCopyOrderIds = () => {
    if (selectedIds.size === 0) {
      showNotification("No orders selected", "error");
      return;
    }

    const ids = Array.from(selectedIds)
      .map((id) => id.slice(-8).toUpperCase())
      .join("\n");
    navigator.clipboard.writeText(ids);
    showNotification(`Copied ${selectedIds.size} order IDs`);
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions toolbar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-6 left-6 right-6 z-50 max-w-2xl mx-auto"
          >
            <Card className="glass-card border-blue-500/30 bg-blue-500/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <CheckSquare2 className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">
                      {selectedIds.size} order
                      {selectedIds.size !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={bulkStatus || ""}
                      onValueChange={setBulkStatus}
                    >
                      <SelectTrigger className="w-40 h-9 text-xs">
                        <SelectValue placeholder="Change status..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBulkStatusChange}
                      disabled={!bulkStatus || isProcessing}
                      className="text-xs"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                      ) : (
                        <Settings className="w-3 h-3 mr-1.5" />
                      )}
                      Apply
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1.5" />
                      Export CSV
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyOrderIds}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1.5" />
                      Copy IDs
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedIds(new Set())}
                      className="text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectAll}
            className="gap-2"
          >
            <input
              type="checkbox"
              checked={
                selectedIds.size > 0 &&
                selectedIds.size === filteredOrders.length
              }
              readOnly
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-400">
              {selectedIds.size > 0
                ? `${selectedIds.size} selected`
                : "Select all"}
            </span>
          </Button>
        </div>

        <Select
          value={filterStatus || ALL_STATUSES_VALUE}
          onValueChange={(value) =>
            setFilterStatus(value === ALL_STATUSES_VALUE ? null : value)
          }
        >
          <SelectTrigger className="w-40 h-9 text-xs">
            <SelectValue placeholder="Filter by status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders list with checkboxes */}
      <div className="grid gap-4 -mb-24">
        {filteredOrders.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No orders found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className={`glass-card border-white/10 cursor-pointer transition-all ${
                selectedIds.has(order.id)
                  ? "ring-2 ring-blue-500 border-blue-500/30 bg-blue-500/5"
                  : "hover:border-white/20"
              }`}
              onClick={() => toggleOrderSelection(order.id)}
            >
              <CardHeader>
                <div className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="w-4 h-4 mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {order.title}
                        </CardTitle>
                        <p className="text-slate-400 text-sm">
                          By {order.user.name || order.user.email}
                        </p>
                      </div>
                      <Badge
                        className={`${statusColors[order.status] || "bg-slate-500/10 text-slate-400"}`}
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  {order.description}
                </p>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>
                    {order.budget && `$${order.budget.toLocaleString()}`}
                  </span>
                  <span>
                    Created {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-400 hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
