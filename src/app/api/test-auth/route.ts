import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encode } from "next-auth/jwt";

// TEST ONLY — creates a session cookie for a test user
// Only available in development
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const secret = process.env.AUTH_SECRET!;

  const token = await encode({
    token: {
      email: user.email,
      name: user.name,
      id: user.id,
      role: user.role,
      sub: user.id,
    },
    secret,
    salt: "authjs.session-token",
  });

  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  response.cookies.set("authjs.session-token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
