import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

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

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9.-]/g, "-");
    const filename = `${timestamp}-${baseName}${extension}`;
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
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
