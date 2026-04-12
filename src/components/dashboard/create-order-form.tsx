"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceTypes = [
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "APP_DEVELOPMENT", label: "App Development" },
  { value: "API_DEVELOPMENT", label: "API Development" },
  { value: "PYTHON_APPLICATION", label: "Python Application" },
  { value: "MOBILE_APP", label: "Mobile App" },
  { value: "PERFORMANCE_OPTIMIZATION", label: "Performance Optimization" },
  { value: "FULL_STACK", label: "Full Stack Development" },
  { value: "CONSULTATION", label: "Consultation" },
];

function matchServiceType(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes("web")) return "WEB_DEVELOPMENT";
  if (q.includes("app") && q.includes("mobile")) return "MOBILE_APP";
  if (q.includes("app")) return "APP_DEVELOPMENT";
  if (q.includes("api")) return "API_DEVELOPMENT";
  if (q.includes("python")) return "PYTHON_APPLICATION";
  if (q.includes("performance")) return "PERFORMANCE_OPTIMIZATION";
  if (q.includes("full") && q.includes("stack")) return "FULL_STACK";
  if (q.includes("consult")) return "CONSULTATION";
  return undefined;
}

interface CreatedOrder {
  id: string;
  title: string;
}

export function CreateOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      const matched = matchServiceType(serviceParam);
      if (matched) setSelectedService(matched);
    }
  }, [searchParams]);

  // Countdown after success → redirect
  useEffect(() => {
    if (!createdOrder) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/client/orders/${createdOrder.id}`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [createdOrder, router]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setPendingFiles((prev) => [...prev, ...files].slice(0, 5));
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
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const data = await res.json();
          urls.push(data.url);
        }
      } catch {}
    }
    return urls;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    let fileUrls: string[] = [];

    // Upload files first if any
    if (pendingFiles.length > 0) {
      fileUrls = await uploadFiles(pendingFiles);
    }

    const data = {
      serviceType: formData.get("serviceType"),
      title: formData.get("title"),
      description: formData.get("description"),
      budget: formData.get("budget"),
      timeline: formData.get("timeline"),
      files: fileUrls,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const order = await response.json();
        setCreatedOrder({ id: order.id, title: order.title });
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Success overlay ────────────────────────────────────────────────────────
  if (createdOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl"
      >
        <Card className="glass-card border-green-500/30 overflow-hidden">
          <CardContent className="pt-12 pb-10 px-8 text-center">
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </motion.div>

            {/* Sparkles */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium uppercase tracking-wider">
                Order Submitted
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              🎉 Order Created!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 mb-1"
            >
              <span className="text-white font-semibold">
                {createdOrder.title}
              </span>{" "}
              has been submitted to our team.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 text-sm mb-8"
            >
              You&apos;ll receive a confirmation email. We&apos;ll be in touch
              soon!
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="24"
                    stroke="rgb(59 130 246)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 24 }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  {countdown}
                </span>
              </div>

              <p className="text-slate-400 text-sm">
                Redirecting to your order in {countdown}s…
              </p>

              <Button
                onClick={() => router.push(`/client/orders/${createdOrder.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Order Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass-card border-white/10 max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Service type */}
            <div className="space-y-2">
              <Label htmlFor="serviceType" className="text-slate-300">
                Service Type
              </Label>
              <Select
                name="serviceType"
                required
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger className="glass border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                Project Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., E-commerce Website"
                required
                className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail — features, goals, target audience, any specific requirements…"
                required
                rows={5}
                className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Budget + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-slate-300">
                  Budget (USD)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="5000"
                  className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-slate-300">
                  Timeline
                </Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="e.g., 2 months"
                  className="glass border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* File upload (optional) */}
            <div className="space-y-2">
              <Label className="text-slate-300">
                Attachments{" "}
                <span className="text-slate-500 font-normal text-xs">
                  (optional • max 5 files)
                </span>
              </Label>

              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? "border-blue-500/60 bg-blue-500/10"
                    : "border-white/15 hover:border-white/30 bg-white/3"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Paperclip className="w-7 h-7 mx-auto mb-2 text-slate-500" />
                <p className="text-slate-400 text-sm">
                  Drag & drop files here, or{" "}
                  <span className="text-blue-400 underline underline-offset-2">
                    browse
                  </span>
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Images, PDF, DOC, ZIP · Max 20MB each
                </p>
              </div>

              {/* File list */}
              <AnimatePresence>
                {pendingFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {pendingFiles.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300"
                      >
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="w-3 h-3 shrink-0" />
                        ) : (
                          <FileText className="w-3 h-3 shrink-0" />
                        )}
                        <span className="max-w-[140px] truncate">
                          {file.name}
                        </span>
                        <span className="text-blue-500">
                          {(file.size / 1024).toFixed(0)}KB
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePendingFile(i);
                          }}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:brightness-110 text-white transition-all h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pendingFiles.length > 0
                    ? "Uploading & Creating…"
                    : "Creating Order…"}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
