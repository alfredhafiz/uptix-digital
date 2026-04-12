// Note: Socket.io doesn't work well with Next.js App Router on serverless platforms like Vercel
// For production, use a separate WebSocket server or use Pusher/Ably
// This is a placeholder that returns a message

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({
      message:
        "Socket.io endpoint - Use a separate WebSocket server for production",
      status: "ok",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
