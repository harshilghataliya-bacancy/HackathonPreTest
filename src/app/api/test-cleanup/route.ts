import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TEST ONLY — cleans exam attempts for a test user
export async function DELETE(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.examAttempt.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ ok: true });
}
