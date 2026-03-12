import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { userDb, courseDb, progressDb, seedCourses } from "@/lib/db";
import Link from "next/link";
import { GraduationCap, Users, BookOpen, BarChart3 } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const adminEmail = process.env.ADMIN_EMAIL;

  // Only allow admin access
  if (userRole !== "admin" && session.user?.email !== adminEmail) {
    redirect("/dashboard");
  }

  // Seed courses if they don't exist
  await seedCourses();

  const users = await userDb.getAll.all();
  const courses = await courseDb.findAll.all();
  const stats = await progressDb.getStats.get();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">UpSkill Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
            <span className="text-slate-400">{session.user?.email}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats?.total_users || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Courses</p>
                <p className="text-2xl font-bold text-white">{stats?.total_courses || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Completions</p>
                <p className="text-2xl font-bold text-white">{stats?.completed_count || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-white">{Math.round(stats?.avg_progress || 0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white">{user.name || "—"}</td>
                    <td className="py-3 px-4 text-slate-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-slate-700 text-slate-300"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No users registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Course Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: any) => (
              <div key={course.id} className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white">{course.title}</h3>
                <p className="text-slate-400 text-sm">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}