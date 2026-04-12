"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, X, Trash2 } from "lucide-react";
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

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  price: string;
  slug: string;
  order: number;
  published: boolean;
  featured: boolean;
}

interface ServiceFormProps {
  service?: Service;
}

const availableIcons = [
  { value: "Code2", label: "Code" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "Database", label: "Database" },
  { value: "Zap", label: "Zap" },
  { value: "Terminal", label: "Terminal" },
  { value: "Globe", label: "Globe" },
  { value: "Layers", label: "Layers" },
  { value: "Cloud", label: "Cloud" },
  { value: "Shield", label: "Shield" },
  { value: "Cpu", label: "CPU" },
  { value: "BarChart", label: "Bar Chart" },
  { value: "PenTool", label: "Pen Tool" },
];

const availableColors = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "cyan", label: "Cyan" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
];

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    features: service?.features || [],
    icon: service?.icon || "Code2",
    color: service?.color || "blue",
    price: service?.price || "",
    slug: service?.slug || "",
    order: service?.order || 0,
    published: service?.published ?? true,
    featured: service?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";

      const response = await fetch(url, {
        method: service ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/services");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;

    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/services");
        router.refresh();
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                Service Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value),
                  }));
                }}
                className="glass border-white/10 bg-white/5 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-slate-300">
                Slug (URL)
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="glass border-white/10 bg-white/5 text-white"
                placeholder="web-development"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="glass border-white/10 bg-white/5 text-white min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="glass border-white/10 bg-white/5 text-white"
                placeholder="Add a feature..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="glass-card border-white/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-slate-300">
                Icon
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, icon: value }))
                }
              >
                <SelectTrigger className="glass border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-slate-300">
                Color Theme
              </Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, color: value }))
                }
              >
                <SelectTrigger className="glass border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  {availableColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-300">
                Price
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="glass border-white/10 bg-white/5 text-white"
                placeholder="Starting at $5,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order" className="text-slate-300">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                className="glass border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <Label
                  htmlFor="published"
                  className="text-slate-300 cursor-pointer"
                >
                  Published
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <Label
                  htmlFor="featured"
                  className="text-slate-300 cursor-pointer"
                >
                  Featured
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Service
            </>
          )}
        </Button>

        {service && (
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={isLoading}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </motion.form>
  );
}
