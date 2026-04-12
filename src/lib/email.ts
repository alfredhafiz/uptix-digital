import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!resend) {
    console.warn("Resend not configured. Email would have been sent:", {
      to,
      subject,
    });
    return { success: false, error: "Email service not configured" };
  }

  try {
    const data = await resend.emails.send({
      from: from || "Uptix Digital <hello@uptixdigital.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export function generateWelcomeEmail(name: string) {
  return `
    <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
          Welcome to Uptix Digital
        </h1>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Hi ${name},
      </p>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Thank you for joining Uptix Digital! We're excited to help you transform your digital presence.
      </p>
      
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h2 style="color: #fff; font-size: 18px; margin-bottom: 16px;">What's Next?</h2>
        <ul style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
          <li>Explore our services</li>
          <li>Create your first project</li>
          <li>Chat with our team</li>
          <li>Track your orders</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://uptixdigital.com/client/dashboard" 
           style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
          Go to Dashboard
        </a>
      </div>
      
      <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center;">
        <p style="color: #64748b; font-size: 14px;">
          Need help? Contact us at hello@uptixdigital.com
        </p>
      </div>
    </div>
  `;
}

export function generateOrderConfirmationEmail(orderDetails: {
  orderId: string;
  title: string;
  amount: number;
  clientName: string;
}) {
  return `
    <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
          Order Confirmation
        </h1>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Hi ${orderDetails.clientName},
      </p>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Your order has been received and is being processed. Here are the details:
      </p>
      
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Order ID:</span>
          <span style="color: #fff; font-family: monospace; margin-left: 8px;">${orderDetails.orderId}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Project:</span>
          <span style="color: #fff; margin-left: 8px;">${orderDetails.title}</span>
        </div>
        <div>
          <span style="color: #64748b; font-size: 14px;">Amount:</span>
          <span style="color: #fff; margin-left: 8px; font-weight: 600;">$${orderDetails.amount.toFixed(2)}</span>
        </div>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        You can track the progress of your order in your dashboard. We'll notify you of any updates.
      </p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://uptixdigital.com/client/dashboard" 
           style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
          View Order
        </a>
      </div>
    </div>
  `;
}

export function generatePaymentConfirmationEmail(paymentDetails: {
  amount: number;
  method: string;
  orderId: string;
  clientName: string;
}) {
  return `
    <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 64px; height: 64px; background: rgba(34, 197, 94, 0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
          Payment Successful
        </h1>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Hi ${paymentDetails.clientName},
      </p>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        Your payment has been successfully processed. Thank you for your business!
      </p>
      
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Amount Paid:</span>
          <span style="color: #22c55e; font-weight: 600; margin-left: 8px;">$${paymentDetails.amount.toFixed(2)}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Payment Method:</span>
          <span style="color: #fff; margin-left: 8px;">${paymentDetails.method}</span>
        </div>
        <div>
          <span style="color: #64748b; font-size: 14px;">Order ID:</span>
          <span style="color: #fff; font-family: monospace; margin-left: 8px;">${paymentDetails.orderId}</span>
        </div>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        You will receive an invoice shortly. If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
  `;
}

export function generateNewOrderNotificationEmail(orderDetails: {
  orderId: string;
  title: string;
  clientName: string;
  clientEmail: string;
  amount?: number;
}) {
  return `
    <div style="font-family: 'JetBrains Mono', monospace; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0;">
          New Order Received
        </h1>
      </div>
      
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
        A new order has been placed on the platform.
      </p>
      
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Order ID:</span>
          <span style="color: #fff; font-family: monospace; margin-left: 8px;">${orderDetails.orderId}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Project:</span>
          <span style="color: #fff; margin-left: 8px;">${orderDetails.title}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="color: #64748b; font-size: 14px;">Client:</span>
          <span style="color: #fff; margin-left: 8px;">${orderDetails.clientName} (${orderDetails.clientEmail})</span>
        </div>
        ${
          orderDetails.amount
            ? `
        <div>
          <span style="color: #64748b; font-size: 14px;">Budget:</span>
          <span style="color: #fff; margin-left: 8px; font-weight: 600;">$${orderDetails.amount.toFixed(2)}</span>
        </div>
        `
            : ""
        }
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://uptixdigital.com/admin/orders" 
           style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
          View in Admin
        </a>
      </div>
    </div>
  `;
}
