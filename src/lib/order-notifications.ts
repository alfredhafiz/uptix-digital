import { sendEmail } from "./email";
import { prisma } from "./prisma";

interface StatusChangeNotification {
  orderId: string;
  previousStatus: string;
  newStatus: string;
  message?: string;
}

interface RevisionRequestNotification {
  orderId: string;
  revisionCount: number;
  clientEmail: string;
  clientName: string;
}

interface PaymentNotification {
  orderId: string;
  amount: number;
  clientEmail: string;
  clientName: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://uptixdigital.com";

function toStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function notifyStatusChange({
  orderId,
  previousStatus,
  newStatus,
  message,
}: StatusChangeNotification) {
  try {
    // Fetch only necessary order details (avoid wasteful query)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        title: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order || !order.user) return;

    // Validate message parameter
    const sanitizedMessage =
      typeof message === "string" ? message.slice(0, 500) : undefined;

    // Status-specific messaging and colors
    const statusMessages: Record<
      string,
      { title: string; emoji: string; color: string }
    > = {
      PENDING: { title: "Order Pending", emoji: "⏳", color: "#eab308" },
      IN_PROGRESS: {
        title: "Order In Progress",
        emoji: "🚀",
        color: "#3b82f6",
      },
      REVIEW: { title: "Ready for Review", emoji: "👀", color: "#8b5cf6" },
      REVISION: { title: "Revision Requested", emoji: "✏️", color: "#f97316" },
      DONE: { title: "Order Completed", emoji: "✅", color: "#22c55e" },
      CANCELLED: { title: "Order Cancelled", emoji: "❌", color: "#ef4444" },
      "In Progress": {
        title: "Order In Progress",
        emoji: "🚀",
        color: "#3b82f6",
      },
      Review: { title: "Ready for Review", emoji: "👀", color: "#8b5cf6" },
      Revision: { title: "Revision Requested", emoji: "✏️", color: "#f97316" },
      "In Revision": {
        title: "Your Revision is Here",
        emoji: "✏️",
        color: "#f97316",
      },
      Completed: { title: "Order Completed", emoji: "✅", color: "#22c55e" },
      "On Hold": { title: "Order On Hold", emoji: "⏸️", color: "#eab308" },
      Cancelled: { title: "Order Cancelled", emoji: "❌", color: "#ef4444" },
    };

    const statusInfo = statusMessages[newStatus] || {
      title: `Status Updated to ${toStatusLabel(newStatus)}`,
      emoji: "📝",
      color: "#6366f1",
    };

    const html = `
      <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 16px;">${statusInfo.emoji}</div>
          <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
            ${statusInfo.title}
          </h1>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Hi ${order.user.name || "there"},
        </p>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Your order "${order.title}" has been updated.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Order ID:</span>
            <span style="color: #fff; font-family: monospace; margin-left: 8px;">${orderId}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Project:</span>
            <span style="color: #fff; margin-left: 8px;">${order.title}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Previous Status:</span>
            <span style="color: #94a3b8; margin-left: 8px;">${toStatusLabel(previousStatus)}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">New Status:</span>
            <span style="color: ${statusInfo.color}; margin-left: 8px; font-weight: 600;">${toStatusLabel(newStatus)}</span>
          </div>
          ${
            message
              ? `
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
            <span style="color: #64748b; font-size: 14px;">Message:</span>
            <p style="color: #e2e8f0; margin: 8px 0 0 0; line-height: 1.6;">${sanitizedMessage}</p>
          </div>
          `
              : ""
          }
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${APP_URL}/client/orders/${orderId}" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
            View Order
          </a>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 14px;">
            Need help? Contact us at hello@uptixdigital.com
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: order.user.email,
      subject: `${statusInfo.emoji} ${statusInfo.title} - Order #${orderId.slice(-8).toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("Error sending status change notification:", error);
  }
}

export async function notifyRevisionRequest({
  orderId,
  revisionCount,
  clientEmail,
  clientName,
}: RevisionRequestNotification) {
  try {
    // Fetch only title (avoid wasteful query)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, title: true },
    });

    if (!order) return;

    const html = `
      <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔄</div>
          <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
            Revision Requested
          </h1>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Hi ${clientName},
        </p>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          A revision has been requested for your order. Please review the changes and provide feedback.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Order ID:</span>
            <span style="color: #fff; font-family: monospace; margin-left: 8px;">${orderId}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Project:</span>
            <span style="color: #fff; margin-left: 8px;">${order.title}</span>
          </div>
          <div>
            <span style="color: #64748b; font-size: 14px;">Total Revisions:</span>
            <span style="color: #f97316; margin-left: 8px; font-weight: 600;">${revisionCount}</span>
          </div>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Please log in to your dashboard to review the detailed comments and provide your feedback.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${APP_URL}/client/orders/${orderId}" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
            Review Revision
          </a>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 14px;">
            Questions? Contact us at hello@uptixdigital.com
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: clientEmail,
      subject: `🔄 Revision Requested - Order #${orderId.slice(-8).toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("Error sending revision notification:", error);
  }
}

export async function notifyPaymentReceived({
  orderId,
  amount,
  clientEmail,
  clientName,
}: PaymentNotification) {
  try {
    // Fetch only title (avoid wasteful query)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, title: true },
    });

    if (!order) return;

    const html = `
      <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 64px; height: 64px; background: rgba(34, 197, 94, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
            Payment Received
          </h1>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Hi ${clientName},
        </p>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          We have received your payment. Thank you for your business!
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Order ID:</span>
            <span style="color: #fff; font-family: monospace; margin-left: 8px;">${orderId}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #64748b; font-size: 14px;">Project:</span>
            <span style="color: #fff; margin-left: 8px;">${order.title}</span>
          </div>
          <div>
            <span style="color: #64748b; font-size: 14px;">Amount Paid:</span>
            <span style="color: #22c55e; margin-left: 8px; font-weight: 600;">$${amount.toFixed(2)}</span>
          </div>
        </div>
        
        <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
          Your order is now in our queue and will be processed shortly. You will receive updates as work progresses.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${APP_URL}/client/orders/${orderId}" 
             style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
            View Order
          </a>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 14px;">
            Questions? Contact us at hello@uptixdigital.com
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: clientEmail,
      subject: `✅ Payment Received - Order #${orderId.slice(-8).toUpperCase()}`,
      html,
    });
  } catch (error) {
    console.error("Error sending payment notification:", error);
  }
}
