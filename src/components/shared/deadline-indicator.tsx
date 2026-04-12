"use client";

import {
  getDeadlineStatus,
  formatDeadline,
  getDeadlineProgressPercentage,
  getDeadlineIcon,
} from "@/lib/deadline-utils";
import { motion } from "framer-motion";

interface DeadlineIndicatorProps {
  dueDate: Date | null | undefined;
  createdAt: Date | null | undefined;
  completedAt: Date | null | undefined;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  showLabel?: boolean;
}

export function DeadlineIndicator({
  dueDate,
  createdAt,
  completedAt,
  size = "md",
  showProgress = true,
  showLabel = true,
}: DeadlineIndicatorProps) {
  const status = getDeadlineStatus(dueDate, createdAt, completedAt);
  const progress = getDeadlineProgressPercentage(
    createdAt,
    dueDate,
    completedAt,
  );
  const icon = getDeadlineIcon(status.status);

  const sizes = {
    sm: {
      container: "gap-2",
      icon: "text-base",
      text: "text-xs",
      badge: "px-2 py-1",
    },
    md: {
      container: "gap-2.5",
      icon: "text-lg",
      text: "text-sm",
      badge: "px-3 py-1.5",
    },
    lg: {
      container: "gap-3",
      icon: "text-xl",
      text: "text-base",
      badge: "px-4 py-2",
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center ${sizeConfig.container}`}>
      <span className={sizeConfig.icon}>{icon}</span>
      <div className="flex-1">
        {dueDate && (
          <div className="text-xs text-slate-400 mb-1">
            Due: {formatDeadline(dueDate)}
          </div>
        )}
        {showProgress && dueDate && !completedAt && (
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
            <motion.div
              className={`h-full rounded-full`}
              style={{
                backgroundColor:
                  status.status === "overdue"
                    ? "#ef4444"
                    : status.status === "due-soon"
                      ? "#f97316"
                      : "#3b82f6",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
        {showLabel && (
          <motion.div
            className={`inline-block ${sizeConfig.badge} rounded-lg font-medium ${status.bgColor} border ${status.borderColor}`}
            style={{ color: status.color }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {status.label}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function DeadlineCard({
  dueDate,
  createdAt,
  completedAt,
}: {
  dueDate: Date | null | undefined;
  createdAt: Date | null | undefined;
  completedAt: Date | null | undefined;
}) {
  const status = getDeadlineStatus(dueDate, createdAt, completedAt);
  const progress = getDeadlineProgressPercentage(
    createdAt,
    dueDate,
    completedAt,
  );

  return (
    <motion.div
      className={`
        rounded-xl p-4 border backdrop-blur-md
        ${status.bgColor} ${status.borderColor}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getDeadlineIcon(status.status)}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">Deadline</h3>
            <p className="text-xs text-slate-400">{formatDeadline(dueDate)}</p>
          </div>
        </div>
        <div className="text-right">
          <p style={{ color: status.color }} className="font-bold text-sm">
            {status.label}
          </p>
        </div>
      </div>

      {!completedAt && dueDate && (
        <>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor:
                  status.status === "overdue"
                    ? "#ef4444"
                    : status.status === "due-soon"
                      ? "#f97316"
                      : "#3b82f6",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{progress}% complete</span>
            <span>
              {status.daysRemaining !== null && (
                <>
                  {status.daysRemaining === 0
                    ? "Today"
                    : `${status.daysRemaining} day${status.daysRemaining > 1 ? "s" : ""}`}
                </>
              )}
            </span>
          </div>
        </>
      )}

      {completedAt && (
        <div className="text-xs text-green-400 flex items-center gap-1">
          <span>✓</span>
          <span>
            Completed{" "}
            {new Date(completedAt) <= new Date(dueDate || new Date())
              ? "on time"
              : "late"}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function OrderCardDeadlineBar({
  dueDate,
  createdAt,
  completedAt,
}: {
  dueDate: Date | null | undefined;
  createdAt: Date | null | undefined;
  completedAt: Date | null | undefined;
}) {
  const status = getDeadlineStatus(dueDate, createdAt, completedAt);
  const progress = getDeadlineProgressPercentage(
    createdAt,
    dueDate,
    completedAt,
  );

  if (!dueDate) return null;

  return (
    <motion.div
      className="mt-3 space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <span>{getDeadlineIcon(status.status)}</span>
          {formatDeadline(dueDate)}
        </span>
        <span className="font-medium" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
      {!completedAt && (
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                status.status === "overdue"
                  ? "#ef4444"
                  : status.status === "due-soon"
                    ? "#f97316"
                    : "#3b82f6",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
}
