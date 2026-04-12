"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Database,
  Zap,
  Terminal,
  Globe,
  Layers,
  Cloud,
  Shield,
  Cpu,
  BarChart,
  PenTool,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  price: string;
  slug: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Smartphone,
  Database,
  Zap,
  Terminal,
  Globe,
  Layers,
  Cloud,
  Shield,
  Cpu,
  BarChart,
  PenTool,
};

const colorClasses: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
};

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load services",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        <p>Error loading services. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {services.map((service: Service, index: number) => {
        const IconComponent = iconMap[service.icon] || Code2;
        const colors = colorClasses[service.color] || colorClasses.blue;

        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card border-white/10 h-full flex flex-col">
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}
                >
                  <IconComponent className={`w-8 h-8 ${colors.text}`} />
                </div>
                <CardTitle className="text-2xl text-white">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 mb-6">{service.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center space-x-2 text-slate-300 text-sm"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace("/10", "")}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`pt-6 border-t ${colors.border} flex items-center justify-between`}
                >
                  <span className={`font-mono text-sm ${colors.text}`}>
                    {service.price}
                  </span>
                  <Link
                    href={`/client/orders/new?service=${encodeURIComponent(service.title)}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${colors.border} hover:bg-white/5`}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
