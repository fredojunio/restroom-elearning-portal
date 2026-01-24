/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Check if lesson/activity/quiz is completed
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = (session.user as any).id;
  const lessonId = searchParams.get("lessonId");
  const activityId = searchParams.get("activityId");
  const quizId = searchParams.get("quizId");

  try {
    const completion = await prisma.completion.findFirst({
      where: {
        userId,
        ...(lessonId && { lessonId }),
        ...(activityId && { activityId }),
        ...(quizId && { quizId }),
      },
    });

    return NextResponse.json({
      isCompleted: !!completion,
      score: completion?.score || null,
      passed: completion?.passed || null,
      attemptCount: completion?.attemptCount || 0,
      completedAt: completion?.completedAt || null,
    });
  } catch (error) {
    console.error("Error checking completion:", error);
    return NextResponse.json(
      { error: "Failed to check completion" },
      { status: 500 },
    );
  }
}

// POST - Mark lesson/activity/quiz as completed
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, activityId, quizId, score, passed, answer } =
    await req.json();
  const userId = (session.user as any).id;

  if (!lessonId && !activityId && !quizId) {
    return NextResponse.json(
      { error: "Must provide lessonId, activityId, or quizId" },
      { status: 400 },
    );
  }

  try {
    // For lessons: just mark complete
    if (lessonId) {
      const completion = await prisma.completion.upsert({
        where: {
          user_lesson: {
            userId,
            lessonId,
          },
        },
        update: {},
        create: { userId, lessonId },
      });

      return NextResponse.json({
        message: "Lesson marked as complete",
        completion,
      });
    }

    // For activities: mark complete with score
    if (activityId) {
      const completion = await prisma.completion.upsert({
        where: {
          user_activity: {
            userId,
            activityId,
          },
        },
        update: { score, answer },
        create: { userId, activityId, score, answer },
      });

      return NextResponse.json({
        message: "Activity marked as complete",
        completion,
      });
    }

    // For quizzes: mark complete with score and passed status
    if (quizId) {
      const existing = await prisma.completion.findUnique({
        where: {
          user_quiz: {
            userId,
            quizId,
          },
        },
      });

      const completion = await prisma.completion.upsert({
        where: {
          user_quiz: {
            userId,
            quizId,
          },
        },
        update: {
          score,
          passed,
          answer,
          attemptCount: existing ? existing.attemptCount + 1 : 1,
        },
        create: { userId, quizId, score, passed, answer, attemptCount: 1 },
      });

      return NextResponse.json({
        message: "Quiz marked as complete",
        completion,
        newAttempt: existing ? existing.attemptCount + 1 : 1,
      });
    }
  } catch (error) {
    console.error("Error marking completion:", error);
    return NextResponse.json(
      { error: "Failed to mark completion" },
      { status: 500 },
    );
  }
}
