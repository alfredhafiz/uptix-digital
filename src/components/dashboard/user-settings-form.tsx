"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface UserSettingsFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "profiles");

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!uploadRes.ok) {
      const uploadError = await uploadRes.json().catch(() => ({}));
      throw new Error(uploadError?.message || "Failed to upload profile photo");
    }

    const uploadData = await uploadRes.json();
    if (!uploadData?.url) {
      throw new Error("Upload did not return an image URL");
    }

    return uploadData.url as string;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      let imageToSave: string | null = previewImage;

      // If preview image is data URL, upload it first then save returned URL.
      if (imageToSave && imageToSave.startsWith("data:")) {
        const dataResponse = await fetch(imageToSave);
        const blob = await dataResponse.blob();
        const extension = blob.type.split("/")[1] || "png";
        const file = new File([blob], `profile-${Date.now()}.${extension}`, {
          type: blob.type || "image/png",
        });
        imageToSave = await uploadImageFile(file);
        setPreviewImage(imageToSave);
      }

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          image: imageToSave,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await update({ name: data.name, image: data.image || null });
        setMessage({ type: "success", text: "Profile updated successfully" });
        router.refresh();
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred while updating profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = formData.name || user.email;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = () => {
    if (previewImage) return previewImage;
    if (user.image) return user.image;
    // Return null to use AvatarFallback with initials instead of external API
    return null;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white/10">
            <AvatarImage src={getAvatarUrl()} alt={formData.name || ""} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
          >
            <Upload className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1">Profile Photo</h4>
          <p className="text-slate-400 text-sm mb-3">
            Upload a new photo or use default avatar
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="glass-card"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            {previewImage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreviewImage(null)}
                className="glass-card text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">
            Full Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            className="glass border-white/10 bg-white/5 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="glass border-white/10 bg-white/5 text-slate-400"
          />
          <p className="text-xs text-slate-500">Email cannot be changed</p>
        </div>
      </div>

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
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </>
        )}
      </Button>
    </motion.form>
  );
}
