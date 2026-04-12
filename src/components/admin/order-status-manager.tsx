"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Calendar, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending Review", color: "text-yellow-400" },
  { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-400" },
  { value: "REVISION", label: "Revision", color: "text-orange-400" },
  { value: "REVIEW", label: "Under Review", color: "text-purple-400" },
  { value: "DONE", label: "Completed", color: "text-green-400" },
  { value: "CANCELLED", label: "Cancelled", color: "text-red-400" },
];

interface AdminOrderStatusManagerProps {
  orderId: string;
  currentStatus: string;
  currentDueDate: string | null;
}

export function AdminOrderStatusManager({
  orderId,
  currentStatus,
  currentDueDate,
}: AdminOrderStatusManagerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [dueDate, setDueDate] = useState(
    currentDueDate ? new Date(currentDueDate).toISOString().split("T")[0] : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleSave() {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          dueDate: dueDate || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } else {
        setError(data?.message || "Failed to update order");
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update order";
      setError(errorMsg);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-400/60 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status selector */}
      <div className="space-y-1.5">
        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">
          Order Status
        </label>
        <Select value={status} onValueChange={setStatus} disabled={isSaving}>
          <SelectTrigger className="glass border-white/10 bg-white/5 text-white h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card border-white/10">
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <span className={s.color}>{s.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Due date */}
      <div className="space-y-1.5">
        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          Due Date
        </label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSaving}
          className="glass border-white/10 bg-white/5 text-white h-9 text-sm"
        />
      </div>

      {/* Save */}
      <Button
        size="sm"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
        ) : saved ? (
          <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-400" />
        ) : null}
        {isSaving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </Button>

      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-green-400 text-xs text-center"
          >
            ✓ Order updated successfully
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
