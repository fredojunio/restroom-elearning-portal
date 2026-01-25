import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");

  try {
    const modules = await prisma.module.findMany({
      where: grade ? { grade: parseInt(grade) } : {},
      include: {
        _count: {
          select: {
            lessons: true,
            activities: true,
            quizzes: true,
          },
        },
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 },
    );
  }
}
