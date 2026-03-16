import { NextResponse } from "next/server";
import { courseDb, progressDb, seedCourses } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mark this route as dynamic since it uses headers
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Seed courses if they don't exist
    await seedCourses();

    const courses = await courseDb.findAll();
    const session = await getServerSession(authOptions);

    let progress: { course_id: string; progress_percent: number; completed: boolean }[] = [];
    if (session?.user && 'id' in session.user) {
      const userId = session.user.id as string;
      progress = await progressDb.findByUser(userId);
    }

    const coursesWithProgress = courses.map((course) => {
      const userProgress = progress.find((p) => p.course_id === course.id);
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
