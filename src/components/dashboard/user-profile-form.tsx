"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role: string;
  };
}

export function UserProfileForm({ user }: UserProfileFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Here you would typically make an API call to update the user
      // For now, we'll just show a success message
      await update({ name: formData.name });
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">
          Name
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
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-500 to-purple-500"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
