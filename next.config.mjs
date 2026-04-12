/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  images: {
    // Avoid dev-time optimizer timeouts for remote image sources (e.g. Unsplash)
    unoptimized: process.env.NODE_ENV === "development",
    // Configure allowed image domains
    remotePatterns: [
      // Cloudinary (recommended for production)
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      // Unsplash (for development and testing)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },

      // AWS S3
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3-**.amazonaws.com",
      },
      // Supabase Storage
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // DiceBear Avatars
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      // Development
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_APP_URL?.replace(/^(https?:\/\/)/, "") ||
          "localhost",
      },
    ],
    // Image optimization settings
    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  allowedDevOrigins: [
    "localhost",
    "192.168.0.2",
    "192.168.0.3",
    "http://192.168.0.2:3000",
  ],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ALLOWED_ORIGINS || "localhost",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
      // Security headers
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
