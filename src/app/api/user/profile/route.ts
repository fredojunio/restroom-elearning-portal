import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("[PROFILE_UPDATE] Unauthorized access attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { image } = body;

        if (!image) {
            console.error("[PROFILE_UPDATE] Image missing in request body");
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        const userId = (session.user as any).id;

        if (!userId) {
            console.error("[PROFILE_UPDATE] User ID missing in session");
            return NextResponse.json({ error: "User ID not found in session" }, { status: 400 });
        }

        console.log(`[PROFILE_UPDATE] Updating image for user ${userId} (${image.length} chars)`);

        // Update user in database
        try {
            const updatedUser = (await prisma.user.update({
                where: { id: userId },
                data: { image } as any,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            })) as any;

            return NextResponse.json({
                message: "Profile updated successfully",
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                },
            });
        } catch (dbError: any) {
            console.error("[PROFILE_UPDATE] Database error:", dbError.message);
            return NextResponse.json({
                error: "Failed to update database",
                details: dbError.message
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error("[PROFILE_UPDATE] Unexpected error:", error.message);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
