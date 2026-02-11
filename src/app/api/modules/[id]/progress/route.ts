/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const { id: moduleId } = await context.params;
  const userId = (session.user as any).id;

  try {
    console.log(`[API/Progress] Fetching progress for module: ${moduleId}, user: ${userId}`);
    const start = Date.now();

    // Get all lessons, activities, quizzes in module and completions in parallel
    const [lessons, activities, quizzes] = await Promise.all([
      prisma.lesson.findMany({
        where: { moduleId },
        orderBy: { order: "asc" },
      }),
      prisma.activity.findMany({ where: { moduleId } }),
      prisma.quiz.findMany({ where: { moduleId } }),
    ]);

    if (!userId) {
      console.error("[API/Progress] No user ID found in session");
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const lessonIds = lessons.map(l => l.id);
    const activityIds = activities.map(a => a.id);
    const quizIds = quizzes.map(q => q.id);

    let completions: any[] = [];

    // Only fetch completions if there are items to check
    if (lessonIds.length > 0 || activityIds.length > 0 || quizIds.length > 0) {
      completions = await prisma.completion.findMany({
        where: {
          userId,
          completedAt: { not: null },
          OR: [
            ...(lessonIds.length > 0 ? [{ lessonId: { in: lessonIds } }] : []),
            ...(activityIds.length > 0 ? [{ activityId: { in: activityIds } }] : []),
            ...(quizIds.length > 0 ? [{ quizId: { in: quizIds } }] : []),
          ],
        } as any,
      });
    }

    console.log(`[API/Progress] Db queries took ${Date.now() - start}ms`);

    // Map completions to items
    const completedLessonIds = completions
      .filter((c: any) => c.lessonId)
      .map((c: any) => c.lessonId!);
    const completedActivityIds = completions
      .filter((c: any) => c.activityId)
      .map((c: any) => c.activityId!);
    const completedQuizIds = completions
      .filter((c: any) => c.quizId)
      .map((c: any) => c.quizId!);

    // Create lesson items with completion status
    const lessonItems = lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      isCompleted: completedLessonIds.includes(lesson.id),
    }));

    // Create activity items with completion status
    const activityItems = activities.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      type: activity.type,
      isCompleted: completedActivityIds.includes(activity.id),
    }));

    // Create quiz items with completion status
    const quizItems = quizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      isCompleted: completedQuizIds.includes(quiz.id),
    }));

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
        items: lessonItems,
      },
      activities: {
        completed: activitiesCompleted,
        total: activities.length,
        percentage:
          activities.length > 0
            ? Math.round((activitiesCompleted / activities.length) * 100)
            : 0,
        items: activityItems,
      },
      quizzes: {
        completed: quizzesCompleted,
        total: quizzes.length,
        percentage:
          quizzes.length > 0
            ? Math.round((quizzesCompleted / quizzes.length) * 100)
            : 0,
        items: quizItems,
      },
      overall: {
        completed: completedItems,
        total: totalItems,
        percentage: overallPercentage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching progress for module:", moduleId, error);
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error.message },
      { status: 500 },
    );
  }
}
