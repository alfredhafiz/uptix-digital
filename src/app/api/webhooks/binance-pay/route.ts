import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

const BINANCE_PAY_SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("binancepay-signature");

    if (!signature || !BINANCE_PAY_SECRET_KEY) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac("sha512", BINANCE_PAY_SECRET_KEY)
      .update(body)
      .digest("hex")
      .toUpperCase();

    if (signature !== computedSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 },
      );
    }

    const data = JSON.parse(body);
    const { merchantTradeNo, status, transactionId } = data;

    // Update payment status
    await prisma.payment.update({
      where: { id: merchantTradeNo },
      data: {
        status: mapBinanceStatus(status),
        txnId: transactionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

function mapBinanceStatus(binStatus: string): PaymentStatus {
  const statusMap: Record<string, PaymentStatus> = {
    SUCCESS: "COMPLETED",
    FAIL: "FAILED",
    REFUND: "REFUNDED",
    EXPIRED: "FAILED",
  };
  return statusMap[binStatus] || "PENDING";
}
