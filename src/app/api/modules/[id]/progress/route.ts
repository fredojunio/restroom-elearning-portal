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
        include: { slides: { select: { id: true } } }
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
          // Removed completedAt filter to include in-progress items
          OR: [
            ...(lessonIds.length > 0 ? [{ lessonId: { in: lessonIds } }] : []),
            ...(activityIds.length > 0 ? [{ activityId: { in: activityIds } }] : []),
            ...(quizIds.length > 0 ? [{ quizId: { in: quizIds } }] : []),
          ],
        } as any,
      });
    }

    console.log(`[API/Progress] Db queries took ${Date.now() - start}ms`);

    // Map completions to items and find the first incomplete one for resume
    let resumeItem: any = null;

    // Create lesson items with completion status
    const lessonItems = lessons.map((lesson: any) => {
      const completion = completions.find((c: any) => c.lessonId === lesson.id);
      const isCompleted = !!completion && !!completion.completedAt;

      const item = {
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        isCompleted,
        currentSlide: completion?.currentSlide || 0,
        totalSlides: lesson.slides?.length || 0,
      };

      if (!resumeItem && !isCompleted) {
        resumeItem = {
          ...item,
          type: 'lesson'
        };
      }

      return item;
    });

    // Create activity items with completion status
    const activityItems = activities.map((activity: any) => {
      const completion = completions.find((c: any) => c.activityId === activity.id);
      const isCompleted = !!completion && !!completion.completedAt;

      const item = {
        id: activity.id,
        title: activity.title,
        type: activity.type,
        isCompleted,
      };

      if (!resumeItem && !isCompleted) {
        resumeItem = {
          ...item,
          type: 'activity'
        };
      }

      return item;
    });

    // Create quiz items with completion status
    const quizItems = quizzes.map((quiz: any) => {
      const completion = completions.find((c: any) => c.quizId === quiz.id);
      const isCompleted = !!completion && !!completion.completedAt;

      const item = {
        id: quiz.id,
        title: quiz.title,
        type: quiz.type,
        isCompleted,
      };

      if (!resumeItem && !isCompleted) {
        resumeItem = {
          ...item,
          type: 'quiz'
        };
      }

      return item;
    });

    const lessonsCompleted = lessonItems.filter(l => l.isCompleted).length;
    const activitiesCompleted = activityItems.filter(a => a.isCompleted).length;
    const quizzesCompleted = quizItems.filter(q => q.isCompleted).length;

    // Slide-based calculation
    const totalLessonSlides = lessonItems.reduce((sum, l) => sum + l.totalSlides, 0);
    const completedLessonSlides = lessonItems.reduce((sum, l) =>
      sum + (l.isCompleted ? l.totalSlides : l.currentSlide), 0
    );

    const totalOverallPoints = totalLessonSlides + activities.length + quizzes.length;
    const completedOverallPoints = completedLessonSlides + activitiesCompleted + quizzesCompleted;

    const overallPercentage =
      totalOverallPoints > 0 ? Math.round((completedOverallPoints / totalOverallPoints) * 100) : 0;

    return NextResponse.json({
      lessons: {
        completed: completedLessonSlides, // Changed to show slides
        total: totalLessonSlides,       // Changed to show slides
        percentage:
          totalLessonSlides > 0
            ? Math.round((completedLessonSlides / totalLessonSlides) * 100)
            : 0,
        items: lessonItems,
        taskCount: { // Keeping task count just in case
          completed: lessonsCompleted,
          total: lessons.length
        }
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
        completed: completedOverallPoints,
        total: totalOverallPoints,
        percentage: overallPercentage,
      },
      resumeItem,
    });
  } catch (error: any) {
    console.error("Error fetching progress for module:", moduleId, error);
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error.message },
      { status: 500 },
    );
  }
}
