import { NextResponse } from "next/server";
import { API_DOCUMENTATION } from "@/lib/api-documentation";

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);

  // Swagger JSON endpoint
  if (pathname.endsWith("/api-docs.json")) {
    return NextResponse.json(API_DOCUMENTATION, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Swagger UI HTML endpoint
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Documentation - Uptix Digital</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700">
        <style>
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <redoc spec-url='/api/docs/api-docs.json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
      </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
