import { NextRequest, NextResponse } from "next/server";
// Triggering re-validation after prisma generate cleanup
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ lessonId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await context.params;

    try {
        // Fetch lesson with its slides, strictly typed
        const lesson = await prisma.lesson.findUnique({
            where: {
                id: lessonId
            },
            include: {
                // @ts-ignore - 'slides' exists in regenerated Prisma types but TS server may need a restart to pick it up
                slides: {
                    orderBy: {
                        order: "asc"
                    }
                },
                module: true
            }
        });

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return NextResponse.json(
            { error: "Failed to fetch lesson data" },
            { status: 500 }
        );
    }
}
