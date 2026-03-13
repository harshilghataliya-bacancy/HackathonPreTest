import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: {
      attempts: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const usersWithStats = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    totalAttempts: user.attempts.length,
    bestScore: user.attempts.length
      ? Math.max(...user.attempts.map((a) => a.score))
      : 0,
    totalQuestions: user.attempts[0]?.totalQuestions || 0,
    passed: user.attempts.some((a) => a.passed),
    lastAttemptAt: user.attempts[0]?.createdAt || null,
    attempts: user.attempts.map((a) => ({
      id: a.id,
      score: a.score,
      totalQuestions: a.totalQuestions,
      passed: a.passed,
      createdAt: a.createdAt,
    })),
  }));

  return NextResponse.json(usersWithStats);
}
