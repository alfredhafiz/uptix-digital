"use client";

import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
}

export function StatsCards({
  totalOrders,
  activeOrders,
  completedOrders,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      title: "Active Projects",
      value: activeOrders,
      icon: Clock,
      color: "purple",
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
      color: "green",
    },
    {
      title: "Success Rate",
      value:
        totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
      suffix: "%",
      icon: TrendingUp,
      color: "pink",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                    {stat.suffix || ""}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
