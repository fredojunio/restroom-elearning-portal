/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const moduleId = params.id;
  const userId = (session.user as any).id;

  try {
    // Get all lessons, activities, quizzes in module
    const [lessons, activities, quizzes] = await Promise.all([
      prisma.lesson.findMany({ where: { moduleId } }),
      prisma.activity.findMany({ where: { moduleId } }),
      prisma.quiz.findMany({ where: { moduleId } }),
    ]);

    // Get all completions for this user in this module
    const completions = await prisma.completion.findMany({
      where: {
        userId,
        OR: [
          { lesson: { moduleId } },
          { activity: { moduleId } },
          { quiz: { moduleId } },
        ],
      },
    });

    const completedLessonIds = completions
      .filter((c) => c.lessonId)
      .map((c) => c.lessonId);
    const completedActivityIds = completions
      .filter((c) => c.activityId)
      .map((c) => c.activityId);
    const completedQuizIds = completions
      .filter((c) => c.quizId)
      .map((c) => c.quizId);

    const lessonsCompleted = completedLessonIds.length;
    const activitiesCompleted = completedActivityIds.length;
    const quizzesCompleted = completedQuizIds.length;

    const totalItems = lessons.length + activities.length + quizzes.length;
    const completedItems =
      lessonsCompleted + activitiesCompleted + quizzesCompleted;

    const overallPercentage =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return NextResponse.json({
      lessons: {
        completed: lessonsCompleted,
        total: lessons.length,
        percentage:
          lessons.length > 0
            ? Math.round((lessonsCompleted / lessons.length) * 100)
            : 0,
        items: lessons.map((l) => ({
          id: l.id,
          title: l.title,
          isCompleted: completedLessonIds.includes(l.id),
        })),
      },
      activities: {
        completed: activitiesCompleted,
        total: activities.length,
        percentage:
          activities.length > 0
            ? Math.round((activitiesCompleted / activities.length) * 100)
            : 0,
        items: activities.map((a) => ({
          id: a.id,
          title: a.title,
          isCompleted: completedActivityIds.includes(a.id),
        })),
      },
      quizzes: {
        completed: quizzesCompleted,
        total: quizzes.length,
        percentage:
          quizzes.length > 0
            ? Math.round((quizzesCompleted / quizzes.length) * 100)
            : 0,
        items: quizzes.map((q) => ({
          id: q.id,
          title: q.title,
          isCompleted: completedQuizIds.includes(q.id),
        })),
      },
      overall: {
        completed: completedItems,
        total: totalItems,
        percentage: overallPercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
