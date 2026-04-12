"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, X, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  techStack: string[];
  previewUrl: string | null;
  repoUrl: string | null;
  images: string[];
  featured: boolean;
  published: boolean;
}

interface ProjectFormProps {
  project?: Project;
}

interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

function FileUpload({
  id,
  label,
  accept,
  value,
  onChange,
  folder,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      onChange(data.url);
      setUploadSuccess(true);

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-300">
        {label}
      </Label>

      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter URL or upload file"
          className="glass border-white/10 bg-white/5 text-white flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="glass-card border-white/10 hover:bg-white/10"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="glass-card border-white/10 hover:bg-red-500/10 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}

      {uploadSuccess && (
        <p className="text-sm text-green-400 flex items-center">
          <Check className="w-3 h-3 mr-1" />
          File uploaded successfully!
        </p>
      )}
    </div>
  );
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    price: project?.price?.toString() || "",
    category: project?.category || "",
    techStack: project?.techStack?.join(", ") || "",
    previewUrl: project?.previewUrl || "",
    repoUrl: project?.repoUrl || "",
    images: project?.images?.join("\n") || "",
    featured: project?.featured || false,
    published: project?.published ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = project
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";

      const response = await fetch(url, {
        method: project ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          techStack: formData.techStack
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
          images: formData.images
            .split("\n")
            .map((url) => url.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = (url: string) => {
    const currentImages = formData.images ? formData.images + "\n" : "";
    setFormData({ ...formData, images: currentImages + url });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-300">
                Project Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter project title"
                required
                className="glass border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the project..."
                rows={4}
                required
                className="glass border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-300">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="99.99"
                  required
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Web Development"
                  required
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack" className="text-slate-300">
                Tech Stack (comma-separated)
              </Label>
              <Input
                id="techStack"
                value={formData.techStack}
                onChange={(e) =>
                  setFormData({ ...formData, techStack: e.target.value })
                }
                placeholder="React, Node.js, PostgreSQL"
                className="glass border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previewUrl" className="text-slate-300">
                  Preview URL
                </Label>
                <Input
                  id="previewUrl"
                  value={formData.previewUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, previewUrl: e.target.value })
                  }
                  placeholder="https://demo.example.com"
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoUrl" className="text-slate-300">
                  Repository URL
                </Label>
                <Input
                  id="repoUrl"
                  value={formData.repoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, repoUrl: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="glass border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <FileUpload
              id="imageUpload"
              label="Upload Image (adds to list below)"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              value=""
              onChange={handleAddImage}
              folder="projects"
            />

            <div className="space-y-2">
              <Label htmlFor="images" className="text-slate-300">
                Image URLs (one per line)
              </Label>
              <Textarea
                id="images"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={4}
                className="glass border-white/10 bg-white/5 text-white"
              />
            </div>

            {formData.images && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formData.images
                  .split("\n")
                  .filter(Boolean)
                  .map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden bg-slate-800"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500"
              />
              <Label
                htmlFor="featured"
                className="text-slate-300 cursor-pointer"
              >
                Featured Project
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, published: e.target.checked })
                }
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500"
              />
              <Label
                htmlFor="published"
                className="text-slate-300 cursor-pointer"
              >
                Published
              </Label>
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
                <Save className="mr-2 h-4 w-4" />{" "}
                {project ? "Update Project" : "Create Project"}
              </>
            )}
          </Button>

          {project && (
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

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            className="glass-card"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
