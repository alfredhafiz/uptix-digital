"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Check,
  AlertCircle,
  Plus,
  DollarSign,
  FileText,
} from "lucide-react";

interface OrderTimelineProps {
  logs: Array<{
    id: string;
    orderId: string;
    action: string;
    details: string;
    createdAt: Date | string;
  }>;
}

const actionConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  STATUS_CHANGED: {
    icon: <Check className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
    label: "Status Changed",
  },
  DUE_DATE_UPDATED: {
    icon: <Clock className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
    label: "Due Date Updated",
  },
  NOTES_ADDED: {
    icon: <FileText className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
    label: "Notes Added",
  },
  ORDER_CREATED: {
    icon: <Plus className="w-5 h-5" />,
    color: "from-indigo-500 to-blue-500",
    label: "Order Created",
  },
  REVISION_REQUESTED: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: "from-orange-500 to-red-500",
    label: "Revision Requested",
  },
  PAYMENT_MADE: {
    icon: <DollarSign className="w-5 h-5" />,
    color: "from-green-500 to-teal-500",
    label: "Payment Received",
  },
};

export function OrderAuditTimeline({ logs }: OrderTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {logs.map((log, index) => {
        const config = actionConfig[log.action] || {
          icon: <Clock className="w-5 h-5" />,
          color: "from-gray-500 to-slate-500",
          label: log.action.replace(/_/g, " "),
        };

        let details: any = {};
        try {
          details = JSON.parse(log.details);
        } catch {
          details = { message: log.details };
        }

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center pt-2">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}
              >
                {config.icon}
              </div>
              {index < logs.length - 1 && (
                <div className="w-0.5 h-12 bg-gradient-to-b from-current to-transparent opacity-30 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-2 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-semibold">{config.label}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Details */}
              {(details.message ||
                details.before ||
                details.after ||
                details.before === false ||
                details.after === false) && (
                <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300">
                  {details.message && <p className="mb-2">{details.message}</p>}
                  {details.before && (
                    <div className="mb-2">
                      <span className="text-slate-400">Before: </span>
                      <code className="text-xs text-blue-400">
                        {typeof details.before === "object"
                          ? JSON.stringify(details.before)
                          : String(details.before)}
                      </code>
                    </div>
                  )}
                  {details.after !== undefined && (
                    <div>
                      <span className="text-slate-400">After: </span>
                      <code className="text-xs text-green-400">
                        {typeof details.after === "object"
                          ? JSON.stringify(details.after)
                          : String(details.after)}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
