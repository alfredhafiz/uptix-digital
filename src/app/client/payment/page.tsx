import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { PaymentForm } from "@/components/payment/payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment | Uptix Digital",
  description: "Make a payment for your project.",
};

interface PaymentPageProps {
  searchParams: { orderId?: string };
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const orderId = searchParams.orderId;

  if (!orderId) {
    redirect("/client/dashboard");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
  });

  if (!order) {
    redirect("/client/dashboard");
  }

  // Get existing payments
  const payments = await prisma.payment.findMany({
    where: {
      orderId: orderId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPaid = payments
    .filter((p: (typeof payments)[0]) => p.status === "COMPLETED")
    .reduce((sum: number, p: (typeof payments)[0]) => sum + p.amount, 0);

  const remainingBalance = (order.budget || 0) - totalPaid;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Make a Payment"
        text={`Complete payment for your project: ${order.title}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
        <PaymentForm orderId={orderId} defaultAmount={remainingBalance} />

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Project Budget</span>
                <span className="text-white">
                  {formatCurrency(order.budget || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Paid</span>
                <span className="text-green-400">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-white font-semibold">
                  Remaining Balance
                </span>
                <span className="text-white font-bold">
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
            </div>

            {payments.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-slate-300">
                  Recent Transactions
                </h4>
                {payments.slice(0, 5).map((payment: (typeof payments)[0]) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 text-sm"
                  >
                    <div>
                      <p className="text-white">{payment.method}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                      <span
                        className={`text-xs ${
                          payment.status === "COMPLETED"
                            ? "text-green-400"
                            : payment.status === "PENDING"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
