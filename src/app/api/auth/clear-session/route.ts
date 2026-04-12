import { NextResponse } from "next/server";

function clearAuthCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function POST() {
  const response = NextResponse.json({ success: true });

  const baseNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ];

  for (const name of baseNames) {
    clearAuthCookie(response, name);
  }

  for (let i = 0; i < 30; i += 1) {
    clearAuthCookie(response, `next-auth.session-token.${i}`);
    clearAuthCookie(response, `__Secure-next-auth.session-token.${i}`);
  }

  return response;
}
