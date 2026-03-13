import { auth } from "@/lib/auth";
import { getQuestionsForClient } from "@/lib/questions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Remove .slice(0, 5) after testing — return all questions for production
  const questions = getQuestionsForClient().slice(0, 5);
  return NextResponse.json(questions);
}
