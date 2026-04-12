"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Play,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";

interface TimelineEvent {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  date?: Date | null;
  active: boolean;
  completed: boolean;
}

interface OrderTimelineProps {
  status: string;
  createdAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
  dueDate?: Date | null;
  revisionCount?: number;
}

const statusOrder = ["PENDING", "IN_PROGRESS", "REVISION", "REVIEW", "DONE"];

function buildTimeline(
  status: string,
  createdAt: Date,
  startedAt?: Date | null,
  completedAt?: Date | null,
  revisionCount?: number,
): TimelineEvent[] {
  const currentIdx = statusOrder.indexOf(status);

  const events: TimelineEvent[] = [
    {
      id: "created",
      label: "Order Placed",
      description: "Your order was received and is being reviewed by our team.",
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/40",
      date: createdAt,
      completed: true,
      active: status === "PENDING",
    },
    {
      id: "in_progress",
      label: "Work Started",
      description: "Our team has started working on your project actively.",
      icon: Play,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500/40",
      date: startedAt,
      completed: currentIdx >= statusOrder.indexOf("IN_PROGRESS"),
      active: status === "IN_PROGRESS",
    },
    {
      id: "revision",
      label: "Revision Requested",
      description: `${revisionCount || 0} revision${(revisionCount || 0) !== 1 ? "s" : ""} requested. Our team is implementing your feedback.`,
      icon: RotateCcw,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/40",
      date: null,
      completed:
        currentIdx > statusOrder.indexOf("REVISION") ||
        (status === "REVISION" && (revisionCount || 0) > 0),
      active: status === "REVISION",
    },
    {
      id: "review",
      label: "Under Review",
      description:
        "Your project is being reviewed and quality-tested before delivery.",
      icon: Eye,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/40",
      date: null,
      completed: currentIdx >= statusOrder.indexOf("REVIEW"),
      active: status === "REVIEW",
    },
    {
      id: "done",
      label: "Project Delivered",
      description:
        "Your project has been successfully completed and delivered.",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/40",
      date: completedAt,
      completed: status === "DONE",
      active: status === "DONE",
    },
  ];

  // Insert CANCELLED event if applicable
  if (status === "CANCELLED") {
    events.push({
      id: "cancelled",
      label: "Order Cancelled",
      description: "This order has been cancelled.",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/40",
      date: null,
      completed: true,
      active: true,
    });
  }

  return events;
}

function formatTimelineDate(date: Date | null | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderTimeline({
  status,
  createdAt,
  startedAt,
  completedAt,
  dueDate,
  revisionCount,
}: OrderTimelineProps) {
  const events = buildTimeline(
    status,
    createdAt,
    startedAt,
    completedAt,
    revisionCount,
  );
  const completedCount = events.filter((e) => e.completed).length;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-medium">
              Overall Progress
            </span>
            <span className="text-blue-400 text-sm font-bold">
              {Math.round(
                (completedCount /
                  (events.length - (status === "CANCELLED" ? 0 : 1))) *
                  100,
              )}
              %
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${Math.round((completedCount / (events.length - (status === "CANCELLED" ? 0 : 1))) * 100)}%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        {dueDate && status !== "DONE" && status !== "CANCELLED" && (
          <div className="text-right shrink-0">
            <p className="text-slate-400 text-xs">Due Date</p>
            <p className="text-white text-sm font-medium">
              {new Date(dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Timeline events */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="relative flex gap-4"
              >
                {/* Icon dot */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      event.active
                        ? `${event.bgColor} ${event.borderColor} shadow-lg`
                        : event.completed
                          ? "bg-white/10 border-white/20"
                          : "bg-white/5 border-white/10"
                    }`}
                  >
                    {event.active ? (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Icon className={`w-4 h-4 ${event.color}`} />
                      </motion.div>
                    ) : event.completed ? (
                      <Icon className="w-4 h-4 text-white/60" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    event.active
                      ? `${event.bgColor} ${event.borderColor}`
                      : event.completed
                        ? "bg-white/5 border-white/10"
                        : "bg-transparent border-transparent opacity-40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`font-semibold text-sm ${
                          event.active
                            ? event.color
                            : event.completed
                              ? "text-white"
                              : "text-slate-500"
                        }`}
                      >
                        {event.label}
                        {event.active && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-normal">
                            Current
                          </span>
                        )}
                      </h4>
                      <p
                        className={`text-xs mt-1 ${
                          event.active || event.completed
                            ? "text-slate-400"
                            : "text-slate-600"
                        }`}
                      >
                        {event.description}
                      </p>
                    </div>
                    {event.date && (
                      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                        {formatTimelineDate(event.date)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
