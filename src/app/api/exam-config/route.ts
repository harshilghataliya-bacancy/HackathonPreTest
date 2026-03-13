import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET - exam is always open
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ examOpen: true });
}
