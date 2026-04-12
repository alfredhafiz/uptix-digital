"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Users, FileText, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    title: "New Order",
    description: "Create a new order for a client",
    icon: Plus,
    href: "/admin/orders/new",
    color: "blue",
  },
  {
    title: "Manage Users",
    description: "View and manage client accounts",
    icon: Users,
    href: "/admin/users",
    color: "purple",
  },
  {
    title: "New Blog Post",
    description: "Create a new blog article",
    icon: FileText,
    href: "/admin/blog/new",
    color: "pink",
  },
  {
    title: "Add Project",
    description: "Add a new project to store",
    icon: Package,
    href: "/admin/projects/new",
    color: "green",
  },
];

export function QuickActions() {
  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <action.icon className={`w-5 h-5 text-${action.color}-400`} />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
