import { authOptions } from "./auth";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export async function getSession(req?: NextRequest) {
  if (req) {
    // For API routes
    return await getServerSession(authOptions);
  }
  // For server components - this won't work reliably
  return null;
}
