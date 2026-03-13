import { auth } from "@/lib/auth";
import { getQuestions } from "@/lib/questions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers } = await req.json();
  // answers is { [questionId]: "optionA" | "optionB" | "optionC" | "optionD" }

  // TODO: Remove .slice(0, 5) after testing — grade all questions for production
  const questions = getQuestions().slice(0, 5);
  let correctCount = 0;
  const incorrectQuestions: { id: number; question: string }[] = [];

  for (const q of questions) {
    const userAnswer = answers[q.id];
    if (userAnswer === q.answer) {
      correctCount++;
    } else {
      incorrectQuestions.push({ id: q.id, question: q.question });
    }
  }

  const totalQuestions = questions.length;
  const passed = correctCount === totalQuestions;

  // Save attempt to database
  await prisma.examAttempt.create({
    data: {
      userId: session.user.id,
      score: correctCount,
      totalQuestions,
      answers,
      passed,
    },
  });

  return NextResponse.json({
    score: correctCount,
    totalQuestions,
    passed,
    incorrectQuestions,
  });
}
