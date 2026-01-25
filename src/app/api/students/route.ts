/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json(
      { error: "Unauthorized - Teacher access required" },
      { status: 403 },
    );
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, name: true, email: true },
    });

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      users.map(async (user: any) => {
        const completions = await prisma.completion.findMany({
          where: { userId: user.id },
        });

        const modules = await prisma.module.findMany();
        const moduleProgress = await Promise.all(
          modules.map(async (module: any) => {
            const moduleCompletions = await prisma.completion.findMany({
              where: {
                userId: user.id,
                OR: [
                  { lesson: { moduleId: module.id } },
                  { activity: { moduleId: module.id } },
                  { quiz: { moduleId: module.id } },
                ],
              },
            });

            const totalItems =
              (await prisma.lesson.count({ where: { moduleId: module.id } })) +
              (await prisma.activity.count({
                where: { moduleId: module.id },
              })) +
              (await prisma.quiz.count({ where: { moduleId: module.id } }));

            return {
              moduleId: module.id,
              progress:
                totalItems > 0
                  ? Math.round((moduleCompletions.length / totalItems) * 100)
                  : 0,
            };
          }),
        );

        const completedModules = moduleProgress.filter(
          (m: any) => m.progress === 100,
        ).length;
        const avgProgress =
          moduleProgress.length > 0
            ? Math.round(
              moduleProgress.reduce((sum: number, m: any) => sum + m.progress, 0) /
              moduleProgress.length,
            )
            : 0;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          modulesCompleted: completedModules,
          averageProgress: avgProgress,
        };
      }),
    );

    return NextResponse.json(studentsWithProgress);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
