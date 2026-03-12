import { NextResponse } from "next/server";
import { courseDb, progressDb, seedCourses } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Seed courses if they don't exist
    await seedCourses();

    const courses = await courseDb.findAll.all();
    const session = await getServerSession(authOptions);

    let progress: any[] = [];
    if (session?.user) {
      const userId = (session.user as any).id;
      progress = await progressDb.findByUser.all(userId);
    }

    const coursesWithProgress = courses.map((course: any) => {
      const userProgress = progress.find((p: any) => p.course_id === course.id);
      return {
        ...course,
        progress: userProgress ? userProgress.progress_percent : 0,
        completed: userProgress ? !!userProgress.completed : false,
      };
    });

    return NextResponse.json(coursesWithProgress);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
