import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export async function DashboardShell({ children }: DashboardShellProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const navItems = [
    { href: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/client/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/client/messages", icon: MessageSquare, label: "Messages" },
    { href: "/client/invoices", icon: FileText, label: "Invoices" },
    { href: "/client/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="glass-card rounded-xl p-4 space-y-2 sticky top-24">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <hr className="border-white/10 my-4" />
              <Link
                href="/api/auth/signout"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
