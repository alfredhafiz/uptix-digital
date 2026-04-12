import { NextResponse } from "next/server";
import { searchAll } from "@/lib/algolia";
import { z } from "zod";

const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100),
  limit: z.number().min(1).max(50).optional().default(10),
  type: z.enum(["blog", "project", "service", "all"]).optional().default("all"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all";

    // Validate input
    const validationResult = searchSchema.safeParse({ query, limit, type });
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { query: searchQuery, limit: searchLimit } = validationResult.data;

    // Perform search
    const results = await searchAll(searchQuery, searchLimit);

    // Filter by type if specified
    const filteredResults =
      type !== "all" ? results.filter((r) => r.type === type) : results;

    return NextResponse.json(
      {
        success: true,
        query: searchQuery,
        count: filteredResults.length,
        results: filteredResults,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Search failed. Please try again." },
      { status: 500 },
    );
  }
}
