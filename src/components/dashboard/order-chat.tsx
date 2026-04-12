"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Download,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface MessageUser {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  attachments: string[];
  createdAt: string;
  user: MessageUser;
}

interface OrderChatProps {
  orderId: string;
  clientId: string;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

function getFileName(url: string): string {
  return url.split("/").pop() || url;
}

export function OrderChat({ orderId, clientId }: OrderChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [error, setError] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = session?.user?.id;

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?orderId=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Auto-scroll only when new messages arrive
  useEffect(() => {
    if (messages.length !== prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...files].slice(0, 5)); // max 5 files
    e.target.value = ""; // reset
  }

  function removePendingFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFiles(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "orders");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        urls.push(data.url);
      }
    }
    return urls;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && pendingFiles.length === 0) return;
    if (isSending) return;

    setError("");
    setIsSending(true);
    setUploadProgress(pendingFiles.length > 0);

    try {
      let attachmentUrls: string[] = [];
      if (pendingFiles.length > 0) {
        attachmentUrls = await uploadFiles(pendingFiles);
        setPendingFiles([]);
        setUploadProgress(false);
      }

      const messageData = {
        content:
          input.trim() || (attachmentUrls.length > 0 ? "📎 Attachment" : ""),
        orderId,
        isGeneral: false,
        attachments: attachmentUrls,
      };

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const responseData = await res.json();

      if (res.ok) {
        setInput("");
        await loadMessages();
      } else {
        const errorMsg = responseData?.message || "Failed to send message";
        console.error("Message send error:", errorMsg, responseData);
        setError(errorMsg);
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to send message";
      console.error("Failed to send message:", err);
      setError(errorMsg);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-white/10 overflow-hidden bg-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-semibold">Order Chat</span>
        </div>
        <span className="text-slate-500 text-xs">
          {messages.length} messages
        </span>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <p className="text-sm">No messages yet — start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isOwn = msg.userId === currentUserId;
              const isAdmin = msg.user?.role === "ADMIN";
              const showAvatar =
                idx === 0 || messages[idx - 1].userId !== msg.userId;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 w-8 self-end">
                    {showAvatar && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden ${
                          isAdmin
                            ? "bg-gradient-to-br from-purple-600 to-blue-600"
                            : "bg-gradient-to-br from-blue-600 to-cyan-600"
                        }`}
                      >
                        {msg.user?.image ? (
                          <Image
                            src={msg.user.image}
                            alt={msg.user.name || ""}
                            width={32}
                            height={32}
                            className="object-cover"
                            unoptimized
                          />
                        ) : isAdmin ? (
                          <ShieldCheck className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white">
                            {getInitials(msg.user?.name)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[72%] space-y-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}
                  >
                    {showAvatar && (
                      <div
                        className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <span className="text-xs text-slate-400 font-medium">
                          {isAdmin ? "Uptix Team" : msg.user?.name || "Client"}
                        </span>
                        {isAdmin && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            Admin
                          </span>
                        )}
                      </div>
                    )}

                    {/* Text bubble */}
                    {msg.content && msg.content !== "📎 Attachment" && (
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          isOwn
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
                            : isAdmin
                              ? "bg-gradient-to-br from-purple-600/30 to-purple-700/20 border border-purple-500/30 text-slate-200 rounded-tl-sm"
                              : "bg-white/8 border border-white/10 text-slate-200 rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.attachments.map((url, i) =>
                          isImageUrl(url) ? (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-colors"
                            >
                              <Image
                                src={url}
                                alt="attachment"
                                width={160}
                                height={120}
                                className="object-cover"
                                unoptimized
                              />
                            </a>
                          ) : (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/15 hover:bg-white/15 transition-colors text-xs text-slate-300 hover:text-white"
                            >
                              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                              <span className="max-w-[120px] truncate">
                                {getFileName(url)}
                              </span>
                              <Download className="w-3 h-3 shrink-0" />
                            </a>
                          ),
                        )}
                      </div>
                    )}

                    <span className="text-xs text-slate-600">
                      {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-t border-white/10 flex-wrap">
          {pendingFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="w-3 h-3" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              <span className="max-w-[100px] truncate">{file.name}</span>
              <button
                onClick={() => removePendingFile(i)}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/3">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Enter to send)"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-9 text-sm"
            disabled={isSending}
          />

          <Button
            type="submit"
            size="sm"
            disabled={isSending || (!input.trim() && pendingFiles.length === 0)}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 h-9 w-9 p-0"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        {uploadProgress && (
          <p className="text-xs text-blue-400 mt-1 ml-10">Uploading files…</p>
        )}
      </div>
    </div>
  );
}
