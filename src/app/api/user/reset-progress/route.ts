/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if requester is TEACHER
    if ((session.user as any).role !== "TEACHER") {
        return NextResponse.json({ error: "Forbidden - Teacher access required" }, { status: 403 });
    }

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Student User ID is required" }, { status: 400 });
        }

        console.log(`[API/ResetProgress] Teacher ${(session.user as any).id} resetting progress for student: ${userId}`);

        // Use a transaction to ensure all progress is cleared together
        await prisma.$transaction([
            // Delete all completions (lessons, activities, quizzes)
            prisma.completion.deleteMany({
                where: { userId },
            }),
            // Delete all module enrollments/progress
            prisma.studentModule.deleteMany({
                where: { userId },
            }),
            // Delete all certificates issued to the user
            prisma.certificate.deleteMany({
                where: { userId },
            }),
        ]);

        return NextResponse.json({
            success: true,
            message: "Student progress has been reset successfully."
        });
    } catch (error: any) {
        console.error("[API/ResetProgress] Error resetting progress:", error);
        return NextResponse.json(
            { error: "Failed to reset progress", details: error.message },
            { status: 500 }
        );
    }
}
