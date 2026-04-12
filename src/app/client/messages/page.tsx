import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { ChatInterface } from "@/components/chat/chat-interface";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages | Uptix Digital",
  description: "Chat with our team about your projects.",
};

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Messages"
        text="Communicate with our team in real-time."
      />
      <div className="max-w-4xl">
        <ChatInterface isGeneral={true} title="General Support Chat" />
      </div>
    </DashboardShell>
  );
}
