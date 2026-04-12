"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";

interface OrdersListProps {
  orders: Order[];
}

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: ShoppingBag,
  REVISION: AlertCircle,
  REVIEW: AlertCircle,
  DONE: CheckCircle2,
  CANCELLED: AlertCircle,
};

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REVISION: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  DONE: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <Card className="glass-card border-white/10 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" />
          <span>Recent Orders</span>
        </CardTitle>
        <Link
          href="/client/orders"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No orders yet</p>
            <Link
              href="/services"
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order, index) => {
              const StatusIcon = statusIcons[order.status];
              return (
                <Link key={order.id} href={`/client/orders/${order.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[order.status].split(" ")[0]}`}
                      >
                        <StatusIcon
                          className={`w-5 h-5 ${statusColors[order.status].split(" ")[1]}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {order.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusColors[order.status]}
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
