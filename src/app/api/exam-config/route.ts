import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - anyone logged in can check exam status
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.examConfig.findUnique({
    where: { id: "singleton" },
  });

  return NextResponse.json({ examOpen: config?.examOpen ?? false });
}

// POST - admin only can toggle
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { examOpen } = await req.json();

  const config = await prisma.examConfig.upsert({
    where: { id: "singleton" },
    update: { examOpen },
    create: { id: "singleton", examOpen },
  });

  return NextResponse.json({ examOpen: config.examOpen });
}
