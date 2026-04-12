"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OrderInternalNotesProps {
  orderId: string;
  initialNotes?: string | null;
}

export function OrderInternalNotes({
  orderId,
  initialNotes = "",
}: OrderInternalNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes || "");
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
          internalNotes: notes || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } else {
        setError(data?.message || "Failed to save notes");
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save notes";
      setError(errorMsg);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <span>📝</span>
          Internal Notes
        </CardTitle>
        <p className="text-xs text-slate-500 font-normal mt-1">
          Private notes visible only to admin team
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-400/60 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSaving}
          placeholder="Add internal notes about this order..."
          className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm min-h-[100px]"
        />

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                Saved!
              </>
            ) : (
              "Save Notes"
            )}
          </Button>
        </div>

        <AnimatePresence>
          {saved && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-400 text-xs text-center"
            >
              ✓ Notes saved successfully
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
