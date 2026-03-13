import { auth } from "@/lib/auth";
import { getQuestionsForClient } from "@/lib/questions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const questions = getQuestionsForClient();
  return NextResponse.json(questions);
}
