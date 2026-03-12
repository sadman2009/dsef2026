import Link from "next/link";
import { GraduationCap, Sparkles, Users, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">UpSkill</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="/api/auth/signin"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI-Powered Learning</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Personalized Skill Growth,
            <span className="text-blue-400"> Anytime, Anywhere</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Master essential soft skills with AI-guided courses designed for workers in developing economies. 
            Build confidence, advance your career, and unlock new opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
              Start Learning Free
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose UpSkill?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Tutor</h3>
              <p className="text-slate-400">
                Get personalized help from our AI tutor available 24/7 to answer questions and guide your learning journey.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Soft Skills Focus</h3>
              <p className="text-slate-400">
                Master communication, leadership, time management, and other essential skills for career success.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700/50">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessible Everywhere</h3>
              <p className="text-slate-400">
                Learn on any device with our responsive platform designed for users in developing regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Our Course Categories
          </h2>
          <p className="text-slate-400 text-center mb-12">
            Choose from our carefully curated soft skills courses
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              "Leadership & Management",
              "Communication",
              "Entrepreneurship",
              "Productivity",
              "AI & Future Tech"
            ].map((category, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <p className="text-white font-medium">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">UpSkill</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 UpSkill. Empowering workers through education.
          </p>
        </div>
      </footer>
    </div>
  );
}
