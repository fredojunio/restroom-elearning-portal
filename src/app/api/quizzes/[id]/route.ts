import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { module: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Parse questions
    const questions = JSON.parse(quiz.questions);

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      moduleId: quiz.moduleId,
      passingScore: quiz.passingScore,
      questions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 },
    );
  }
}
