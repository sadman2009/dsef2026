import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { courseDb, seedCourses } from "@/lib/db";

export default async function CoursesPage() {
  // Seed courses if they don't exist
  await seedCourses();
  
  const courses = await courseDb.findAll.all();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">UpSkill</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/courses" className="text-blue-400 font-medium">Courses</Link>
            <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Our Courses</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Master essential soft skills with our AI-powered learning platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                {course.category || "General"}
              </span>
              <h3 className="text-xl font-semibold text-white mt-3 mb-2">{course.title}</h3>
              <p className="text-slate-400 mb-4">{course.description}</p>
              <div className="flex items-center text-blue-400 font-medium">
                Start Learning <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
