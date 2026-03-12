import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { courseDb, progressDb, seedCourses } from "@/lib/db";
import Link from "next/link";
import { GraduationCap, BookOpen, Trophy, Clock } from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const userId = (user as any).id;

  // Seed courses if they don't exist
  await seedCourses();

  // Fetch courses and user progress
  const courses = await courseDb.findAll.all();
  const progress = await progressDb.findByUser.all(userId);

  // Calculate stats
  const completedCount = progress.filter((p: any) => p.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">UpSkill</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.name || user?.email}</span>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name || "Learner"}!
        </h1>
        <p className="text-slate-400 mb-8">
          Continue your learning journey
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Courses</p>
                <p className="text-2xl font-bold text-white">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">{progress.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <h2 className="text-xl font-semibold text-white mb-4">Your Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: any) => {
            const userProgress = progress.find((p: any) => p.course_id === course.id);
            const progressPercent = userProgress?.progress_percent || 0;
            
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="text-sm text-blue-400 mb-2">{course.category}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">{progressPercent}% complete</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
