/**
 * File Upload Validation Utility
 * Validates file types, sizes, and security
 */

import { FILE_UPLOAD } from "./constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  file?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Get MIME type from extension
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
  };
  return mimeTypes[extension] || "application/octet-stream";
}

/**
 * Validate file for upload
 */
export function validateFile(
  file: {
    name: string;
    size: number;
    type?: string;
  },
  allowedTypes?: string[],
): FileValidationResult {
  // Check filename
  if (!file.name || typeof file.name !== "string") {
    return { valid: false, error: "Invalid filename" };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${FILE_UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "File cannot be empty" };
  }

  // Get extension
  const extension = getFileExtension(file.name);
  if (!extension) {
    return { valid: false, error: "File must have an extension" };
  }

  // Check extension against whitelist
  if (!FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(extension as any)) {
    return {
      valid: false,
      error: `File type .${extension} is not allowed. Allowed types: ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check MIME type if provided
  if (file.type) {
    const defaultMimeType = getMimeType(extension);
    if (
      allowedTypes &&
      !allowedTypes.includes(file.type) &&
      !allowedTypes.includes(defaultMimeType)
    ) {
      return {
        valid: false,
        error: `File MIME type ${file.type} is not allowed`,
      };
    }
  }

  // Validate filename (prevent directory traversal and scripts)
  if (
    file.name.includes("..") ||
    file.name.includes("/") ||
    file.name.includes("\\")
  ) {
    return { valid: false, error: "Invalid filename" };
  }

  // Prevent executable extensions
  const executableExts = [
    "exe",
    "bat",
    "cmd",
    "sh",
    "php",
    "jsp",
    "js",
    "html",
  ];
  if (executableExts.includes(extension)) {
    return { valid: false, error: "Executable files are not allowed" };
  }

  return {
    valid: true,
    file: {
      name: file.name,
      size: file.size,
      type: file.type || getMimeType(extension),
      extension: extension,
    },
  };
}

/**
 * Validate image file specifically
 */
export function validateImageFile(file: {
  name: string;
  size: number;
  type?: string;
}): FileValidationResult {
  const result = validateFile(file, FILE_UPLOAD.ALLOWED_IMAGE_TYPES as any);

  if (!result.valid) {
    return result;
  }

  // Additional image-specific validation
  const extension = getFileExtension(file.name);
  const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

  if (!imageExtensions.includes(extension)) {
    return { valid: false, error: "Only image files are allowed" };
  }

  return result;
}

/**
 * Validate document file specifically
 */
export function validateDocumentFile(file: {
  name: string;
  size: number;
  type?: string;
}): FileValidationResult {
  const result = validateFile(file, FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES as any);

  if (!result.valid) {
    return result;
  }

  // Additional document-specific validation
  const extension = getFileExtension(file.name);
  const docExtensions = ["pdf", "doc", "docx", "txt"];

  if (!docExtensions.includes(extension)) {
    return { valid: false, error: "Only document files are allowed" };
  }

  return result;
}

/**
 * Generate safe filename from user input
 * Removes special characters and unsafe patterns
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path separators
  let safeName = fileName.replace(/^.*[\\/]/, "");

  // Remove special characters, keep only alphanumeric, dash, underscore, dot
  safeName = safeName.replace(/[^\w\s.-]/g, "");

  // Remove multiple dots (prevent null byte injection)
  safeName = safeName.replace(/\.{2,}/g, ".");

  // Limit length
  const nameParts = safeName.split(".");
  const extension = nameParts.length > 1 ? nameParts.pop() : "";
  let name = nameParts.join(".");

  // Truncate to 100 characters
  if (name.length > 100) {
    name = name.substring(0, 100);
  }

  // Return with extension
  if (extension) {
    return `${name}.${extension}`;
  }
  return name;
}

/**
 * Get unique filename to prevent overwriting
 */
export function generateUniqueFileName(fileName: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  const baseName = parts.join(".");

  return `${baseName}-${timestamp}-${random}.${extension}`;
}

/**
 * Validate uploaded FormData file
 */
export async function validateFormDataFile(
  formData: FormData,
  fieldName: string = "file",
  fileType: "image" | "document" | "any" = "image",
): Promise<FileValidationResult> {
  const file = formData.get(fieldName);

  if (!file || !(file instanceof File)) {
    return { valid: false, error: "No file provided" };
  }

  const fileObj = {
    name: file.name,
    size: file.size,
    type: file.type,
  };

  if (fileType === "image") {
    return validateImageFile(fileObj);
  } else if (fileType === "document") {
    return validateDocumentFile(fileObj);
  }

  return validateFile(fileObj);
}
