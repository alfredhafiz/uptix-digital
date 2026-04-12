import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyPaymentReceived } from "@/lib/order-notifications";
import { NextResponse } from "next/server";
import crypto from "crypto";
import type { PaymentStatus } from "@prisma/client";
import { z } from "zod";

const paymentSchema = z.object({
  orderId: z.string().cuid("Invalid order ID"),
  amount: z.preprocess(
    (value) => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
      }
      return value;
    },
    z
      .number()
      .positive("Amount must be positive")
      .max(999999, "Amount exceeds maximum"),
  ),
  method: z.enum(["BINANCE_PAY", "STRIPE", "PAYPAL", "BANK_TRANSFER"]),
});

// Binance Pay API Configuration
const BINANCE_PAY_API_KEY = process.env.BINANCE_PAY_API_KEY;
const BINANCE_PAY_SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY;
const BINANCE_PAY_BASE_URL = "https://bpay.binanceapi.com";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validationResult = paymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationResult.error.errors },
        { status: 400 },
      );
    }

    const { orderId, amount, method } = validationResult.data;

    if (session.user.role !== "ADMIN") {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
        },
        select: { id: true },
      });

      if (!order) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        method,
        status: "PENDING",
      },
    });

    let paymentData;

    // Handle different payment methods
    switch (method.toUpperCase()) {
      case "BINANCE_PAY":
        paymentData = await createBinancePayPayment(payment.id, amount);
        break;
      case "STRIPE":
        paymentData = await createStripePayment(payment.id, amount);
        break;
      case "PAYPAL":
        paymentData = await createPayPalPayment(payment.id, amount);
        break;
      default:
        return NextResponse.json(
          { message: "Unsupported payment method" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      payment,
      paymentData,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { message: "Failed to create payment" },
      { status: 500 },
    );
  }
}

// Binance Pay Integration
async function createBinancePayPayment(paymentId: string, amount: number) {
  if (!BINANCE_PAY_API_KEY || !BINANCE_PAY_SECRET_KEY) {
    throw new Error("Binance Pay credentials not configured");
  }

  const timestamp = Date.now();
  const nonce = crypto.randomUUID();

  const body = {
    env: {
      terminalType: "WEB",
    },
    merchantTradeNo: paymentId,
    orderAmount: amount,
    currency: "USDT",
    goods: {
      goodsType: "01",
      goodsCategory: "D000",
      referenceGoodsId: paymentId,
      goodsName: `Uptix Digital Service - ${paymentId}`,
      goodsDetail: "Digital services payment",
    },
  };

  const payload = JSON.stringify(body);
  const signature = generateBinanceSignature(timestamp, nonce, payload);

  try {
    const response = await fetch(
      `${BINANCE_PAY_BASE_URL}/binancepay/openapi/v3/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "BinancePay-Timestamp": timestamp.toString(),
          "BinancePay-Nonce": nonce,
          "BinancePay-Certificate-SN": BINANCE_PAY_API_KEY,
          "BinancePay-Signature": signature,
        },
        body: payload,
      },
    );

    const data = await response.json();

    if (data.status === "SUCCESS") {
      // Update payment with transaction ID
      await prisma.payment.update({
        where: { id: paymentId },
        data: { txnId: data.data.prepayId },
      });

      return {
        prepayId: data.data.prepayId,
        checkoutUrl: data.data.checkoutUrl,
        expireTime: data.data.expireTime,
      };
    } else {
      throw new Error(data.errorMessage || "Binance Pay error");
    }
  } catch (error) {
    console.error("Binance Pay error:", error);
    throw error;
  }
}

function generateBinanceSignature(
  timestamp: number,
  nonce: string,
  payload: string,
) {
  const dataToSign = `${timestamp}\n${nonce}\n${payload}\n`;
  return crypto
    .createHmac("sha512", BINANCE_PAY_SECRET_KEY!)
    .update(dataToSign)
    .digest("hex")
    .toUpperCase();
}

// Stripe Integration (Placeholder)
async function createStripePayment(paymentId: string, amount: number) {
  // This is a placeholder implementation
  // In production, use Stripe Node.js library
  return {
    clientSecret: "pi_placeholder_secret",
    paymentIntentId: `pi_${paymentId}`,
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  };
}

// PayPal Integration (Placeholder)
async function createPayPalPayment(paymentId: string, amount: number) {
  // This is a placeholder implementation
  // In production, use PayPal SDK
  return {
    orderId: `ORDER-${paymentId}`,
    approvalUrl: "https://www.paypal.com/checkout",
  };
}

// Webhook handler for payment status updates
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentId, status, txnId } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const normalizedStatus = String(status).toUpperCase() as PaymentStatus;
    const allowedStatuses: PaymentStatus[] = [
      "PENDING",
      "COMPLETED",
      "FAILED",
      "REFUNDED",
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { message: "Invalid payment status" },
        { status: 400 },
      );
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        amount: true,
        order: {
          select: {
            id: true,
            userId: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 },
      );
    }

    if (
      session.user.role !== "ADMIN" &&
      existingPayment.order.userId !== session.user.id
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: normalizedStatus,
        ...(txnId && { txnId }),
      },
    });

    // Send payment received notification when payment is completed
    if (normalizedStatus === "COMPLETED" && existingPayment.order.user) {
      try {
        await notifyPaymentReceived({
          orderId: existingPayment.order.id,
          amount: existingPayment.amount,
          clientEmail: existingPayment.order.user.email,
          clientName: existingPayment.order.user.name || "Client",
        });
      } catch (error) {
        console.warn("Failed to send payment notification:", error);
      }
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { message: "Failed to update payment" },
      { status: 500 },
    );
  }
}
