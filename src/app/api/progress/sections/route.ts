import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sectionProgressDb } from "@/lib/db";
import { z } from "zod";

const sectionProgressSchema = z.object({
  courseId: z.string(),
  sectionId: z.string(),
  completed: z.boolean(),
});

const batchSectionProgressSchema = z.object({
  courseId: z.string(),
  sections: z.array(z.object({
    sectionId: z.string(),
    completed: z.boolean(),
  })),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (courseId) {
      const progress = await sectionProgressDb.findByUserCourse(userId, courseId);
      return NextResponse.json(progress);
    }

    const progress = await sectionProgressDb.findByUser(userId);
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Section progress fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    if (body.sections && Array.isArray(body.sections)) {
      const result = batchSectionProgressSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.issues },
          { status: 400 }
        );
      }

      const items = result.data.sections.map(s => ({
        user_id: userId,
        course_id: result.data.courseId,
        section_id: s.sectionId,
        completed: s.completed,
      }));

      await sectionProgressDb.batchUpsert(items);
      return NextResponse.json({ success: true });
    }

    const result = sectionProgressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    await sectionProgressDb.upsert({
      user_id: userId,
      course_id: result.data.courseId,
      section_id: result.data.sectionId,
      completed: result.data.completed,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Section progress update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
