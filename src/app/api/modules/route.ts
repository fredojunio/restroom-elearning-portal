/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-assign-module-variable */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");

  const modules = await prisma.module.findMany({
    where: grade ? { grade: parseInt(grade) } : {},
    include: {
      lessons: true,
      activities: true,
      quizzes: true,
    },
  });

  return NextResponse.json(modules);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { title, description, grade, subject, content } = await req.json();

  const module = await prisma.module.create({
    data: { title, description, grade, subject, content },
  });

  return NextResponse.json(module);
}
