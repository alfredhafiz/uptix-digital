"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  userId: string;
  orderId: string | null;
  isGeneral: boolean;
  createdAt: string;
  read: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ChatInterfaceProps {
  orderId?: string;
  isGeneral?: boolean;
  title?: string;
}

export function ChatInterface({
  orderId,
  isGeneral = false,
  title = "Chat",
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = orderId
        ? `/api/messages?orderId=${orderId}`
        : isGeneral
          ? `/api/messages?isGeneral=true`
          : `/api/messages`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, isGeneral]);

  useEffect(() => {
    loadMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session?.user) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: inputMessage,
          orderId: orderId || null,
          isGeneral: isGeneral,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="glass-card border-white/10 h-[600px] flex flex-col">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>{title}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMessages}
            disabled={isLoading}
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start the conversation!</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => {
                  const isOwnMessage = message.userId === session?.user?.id;
                  const showAvatar =
                    index === 0 ||
                    messages[index - 1].userId !== message.userId;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end space-x-2 max-w-[80%] ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        {showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {message.user.name?.charAt(0).toUpperCase() || (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                        )}
                        {!showAvatar && <div className="w-8" />}

                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm"
                              : "glass-card text-slate-200 rounded-bl-sm"
                          }`}
                        >
                          {showAvatar && (
                            <p className="text-xs opacity-70 mb-1">
                              {message.user.name || "Anonymous"}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${isOwnMessage ? "text-white/70" : "text-slate-500"}`}
                          >
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Messages refresh automatically every 5 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
