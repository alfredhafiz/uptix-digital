"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  userId: string;
  recipientId: string | null;
  createdAt: Date;
  read: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface AdminChatInterfaceProps {
  clientId: string;
  clientName?: string;
}

export function AdminChatInterface({
  clientId,
  clientName = "Client",
}: AdminChatInterfaceProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  // Ref for the inner scroll container div
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  const adminId = session?.user?.id;

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/messages?userId=${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Failed to load messages:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Only scroll when message count changes (new message arrived), NOT on every re-render
  useEffect(() => {
    if (messages.length !== prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      // Scroll only within the chat container, not the whole page
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          recipientId: clientId,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        await loadMessages();
      } else {
        console.error("Failed to send message:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[460px] p-4">
      {/* Chat messages container - isolated scroll, won't affect page */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <p className="text-slate-400 text-center py-8 text-sm">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => {
            const isFromAdmin = msg.userId === adminId;
            return (
              <div
                key={msg.id}
                className={`flex ${isFromAdmin ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isFromAdmin
                      ? "bg-blue-600/30 text-blue-100 border border-blue-500/30 rounded-br-sm"
                      : "bg-white/10 text-white border border-white/10 rounded-bl-sm"
                  }`}
                >
                  {!isFromAdmin && (
                    <p className="text-xs text-slate-400 mb-1 font-medium">
                      {clientName}
                    </p>
                  )}
                  <p className="text-sm break-words leading-relaxed">
                    {msg.content}
                  </p>
                  <p className="text-xs mt-1 opacity-50 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Send form */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-white/10 pt-3"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${clientName}...`}
          disabled={isSending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as any);
            }
          }}
          className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
        <Button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 px-4"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
