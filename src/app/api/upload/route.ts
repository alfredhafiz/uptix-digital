import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { createHash } from "crypto";

// Allowed file types – images + documents for order attachments
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/zip": ".zip",
  "text/plain": ".txt",
};

// Admin-only folders vs. authenticated-user folders
const ADMIN_ONLY_FOLDERS = new Set([
  "general",
  "logos",
  "blog",
  "projects",
  "favicons",
]);
const USER_FOLDERS = new Set(["orders", "profiles"]);

// Max file size: 5 MB for images, 20 MB for documents
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOC_SIZE = 20 * 1024 * 1024;

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const targetFolder = `uptix/${folder}`;
  const signatureBase = `folder=${targetFolder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", targetFolder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const data = await response.json();
  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url as string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderInput = (formData.get("folder") as string) || "general";
    const folder = folderInput.toLowerCase().trim();

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    // Check folder permission
    if (ADMIN_ONLY_FOLDERS.has(folder) && !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized folder" },
        { status: 403 },
      );
    }
    if (!ADMIN_ONLY_FOLDERS.has(folder) && !USER_FOLDERS.has(folder)) {
      return NextResponse.json(
        { message: "Invalid upload folder" },
        { status: 400 },
      );
    }

    // Validate file type
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { message: `Invalid file type: ${file.type}` },
        { status: 400 },
      );
    }

    // Validate file size
    const isDocument = !file.type.startsWith("image/");
    const maxSize = isDocument ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 },
      );
    }

    let publicUrl: string;
    let filename: string;

    // In production/serverless prefer Cloudinary for persistent uploads.
    if (
      process.env.NODE_ENV === "production" &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      publicUrl = await uploadToCloudinary(file, folder);
      filename = publicUrl.split("/").pop() || `cloudinary-${Date.now()}`;
    } else {
      // Local/dev fallback: save under /public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const baseName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9.-]/g, "-");
      filename = `${timestamp}-${baseName}${extension}`;
      const filePath = path.join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${folder}/${filename}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        message: "Failed to upload file",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
