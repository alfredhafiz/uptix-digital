"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types";

interface RecentMessagesProps {
  orders: Order[];
}

export function RecentMessages({ orders }: RecentMessagesProps) {
  // Get all messages from orders and flatten them
  const allMessages = orders
    .flatMap(
      (order) =>
        order.messages?.map((msg) => ({
          ...msg,
          orderTitle: order.title,
        })) || [],
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <span>Recent Messages</span>
        </CardTitle>
        <Link
          href="/client/messages"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {allMessages.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <p className="text-sm text-slate-300 line-clamp-2">
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    {message.orderTitle}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
