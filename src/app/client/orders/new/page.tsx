import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateOrderForm } from "@/components/dashboard/create-order-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Order | Uptix Digital",
  description: "Create a new project order.",
};

export default async function NewOrderPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Order"
        text="Fill in the details below to start your project."
      />
      <CreateOrderForm />
    </DashboardShell>
  );
}
