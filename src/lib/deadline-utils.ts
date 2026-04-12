/**
 * Deadline and SLA utilities for visual indicators
 */

interface DeadlineStatus {
  isOverdue: boolean;
  isDueSoon: boolean;
  daysRemaining: number | null;
  hoursRemaining: number | null;
  percentComplete: number;
  status: "overdue" | "due-soon" | "on-track" | "no-deadline";
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DUE_SOON_DAYS = 3; // Consider due if within 3 days

export function getDeadlineStatus(
  dueDate: Date | null | undefined,
  createdAt: Date | null | undefined,
  completedAt: Date | null | undefined,
): DeadlineStatus {
  // No deadline set
  if (!dueDate) {
    return {
      isOverdue: false,
      isDueSoon: false,
      daysRemaining: null,
      hoursRemaining: null,
      percentComplete: 100,
      status: "no-deadline",
      label: "No deadline",
      color: "#64748b",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20",
    };
  }

  const now = new Date();
  const dueDateObj = new Date(dueDate);
  const timeDiff = dueDateObj.getTime() - now.getTime();

  // Already completed
  if (completedAt) {
    const completedOnTime =
      new Date(completedAt).getTime() <= dueDateObj.getTime();
    return {
      isOverdue: false,
      isDueSoon: false,
      daysRemaining: null,
      hoursRemaining: null,
      percentComplete: 100,
      status: "on-track",
      label: completedOnTime ? "Completed on time" : "Completed late",
      color: "#22c55e",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    };
  }

  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.ceil(timeDiff / (1000 * 60 * 60));

  // Overdue
  if (timeDiff < 0) {
    const progress = getDeadlineProgressPercentage(
      createdAt,
      dueDate,
      completedAt,
    );
    return {
      isOverdue: true,
      isDueSoon: false,
      daysRemaining: daysRemaining,
      hoursRemaining: hoursRemaining,
      percentComplete: progress,
      status: "overdue",
      label: `${Math.abs(daysRemaining)} days overdue`,
      color: "#ef4444",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    };
  }

  // Due soon (within DUE_SOON_DAYS)
  if (daysRemaining <= DUE_SOON_DAYS) {
    const progress = getDeadlineProgressPercentage(
      createdAt,
      dueDate,
      completedAt,
    );
    return {
      isOverdue: false,
      isDueSoon: true,
      daysRemaining: daysRemaining,
      hoursRemaining: hoursRemaining,
      percentComplete: progress,
      status: "due-soon",
      label:
        daysRemaining === 0
          ? "Due today"
          : `Due in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`,
      color: "#f97316",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    };
  }

  // On track
  const progress = getDeadlineProgressPercentage(
    createdAt,
    dueDate,
    completedAt,
  );
  return {
    isOverdue: false,
    isDueSoon: false,
    daysRemaining: daysRemaining,
    hoursRemaining: hoursRemaining,
    percentComplete: progress,
    status: "on-track",
    label: `${daysRemaining} days remaining`,
    color: "#3b82f6",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  };
}

export function formatDeadline(date: Date | null | undefined): string {
  if (!date) return "No deadline";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDeadlineProgressPercentage(
  createdAt: Date | null | undefined,
  dueDate: Date | null | undefined,
  completedAt: Date | null | undefined,
): number {
  if (!createdAt || !dueDate) return 0;
  if (completedAt) return 100;

  const created = new Date(createdAt).getTime();
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();

  const totalTime = due - created;
  const elapsedTime = now - created;

  if (elapsedTime >= totalTime) return 100;
  if (elapsedTime <= 0) return 0;

  return Math.round((elapsedTime / totalTime) * 100);
}

export function getDeadlineIcon(status: DeadlineStatus["status"]): string {
  switch (status) {
    case "overdue":
      return "🚨";
    case "due-soon":
      return "⏰";
    case "on-track":
      return "✅";
    case "no-deadline":
      return "📅";
  }
}
