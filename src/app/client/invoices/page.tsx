import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoices | Uptix Digital",
  description: "View and download your invoices.",
};

export default async function InvoicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const payments = await prisma.payment.findMany({
    where: {
      order: {
        userId: session.user.id,
      },
      status: "COMPLETED",
    },
    include: {
      order: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Invoices"
        text="View and download your payment invoices."
      />
      <div className="grid gap-6">
        {payments.length === 0 ? (
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">No invoices found.</p>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment: (typeof payments)[0]) => (
            <Card key={payment.id} className="glass-card border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">
                      Invoice #{payment.id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {payment.order.title}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Payment Method</p>
                    <p className="text-white capitalize">
                      {payment.method.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Transaction ID</p>
                    <p className="text-white font-mono">
                      {payment.txnId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Paid
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
