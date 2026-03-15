import Link from "next/link";
import { Navigation, Footer } from "@/components/layout";
import { Button, Mascot } from "@/components/ui";
import { courseDb, seedCourses } from "@/lib/db";
import {
  ArrowRight,
  MessageSquare,
  Globe,
  Sparkles,
  Users,
  Target,
  Zap,
  Rocket,
  Briefcase,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "UpSkill - Build the Skills That Build Careers",
  description: "Communication. Leadership. Time management. The skills that turn good workers into great ones. Free AI-guided courses for career growth.",
};

export default async function Home() {
  await seedCourses();
  const courses = await courseDb.findAll();

  const courseCategories = [
    { name: "Communication", icon: MessageCircle, category: "Communication" },
    { name: "Leadership", icon: Target, category: "Leadership" },
    { name: "Productivity", icon: Zap, category: "Productivity" },
    { name: "Entrepreneurship", icon: Rocket, category: "Entrepreneurship" },
    { name: "Workplace Skills", icon: Briefcase, category: "Workplace" },
  ];

  const skillsYouLearn = [
    "How to speak so people actually listen",
    "Managing time without burning out",
    "Leading when you're not the boss",
    "Navigating workplace conflicts with confidence",
  ];

  const socialProof = [
    { icon: Globe, label: "50+ Countries" },
    { icon: Users, label: "Growing Community" },
    { icon: Sparkles, label: "AI-Powered" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-16 md:py-24 lg:py-28">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        
        {/* Single bold accent shape */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                AI Tutor Included
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 mb-6 leading-[1.1]">
                Build the Skills That{" "}
                <span className="text-primary-500">Build Careers</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Communication. Leadership. Time management. The skills that turn good workers into great ones — all with a personal AI tutor.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-display font-bold">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto font-display">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Progress Preview Card */}
            <div className="relative hidden lg:block">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 max-w-sm mx-auto">
                {/* Mascot header */}
                <div className="flex items-center gap-4 mb-6">
                  <Mascot size="xl" mood="waving" showBackground={true} />
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg">Your Learning Path</h3>
                    <p className="text-slate-500 text-sm">Start here, grow everywhere</p>
                  </div>
                </div>

                {/* Progress example */}
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700">Communication</span>
                      <span className="text-primary-600 font-bold text-sm">75%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full w-3/4" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-4 border border-primary-200">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Day Streak</p>
                      <p className="text-xs text-slate-500">Keep it going!</p>
                    </div>
                    <div className="ml-auto text-2xl">🔥</div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 text-center">
                  <div>
                    <p className="text-2xl font-display font-bold text-primary-600">5</p>
                    <p className="text-xs text-slate-500">Skills</p>
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-primary-600">24/7</p>
                    <p className="text-xs text-slate-500">AI Tutor</p>
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-primary-600">Free</p>
                    <p className="text-xs text-slate-500">Forever</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {socialProof.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-600">
                <item.icon className="w-5 h-5 text-primary-500" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Features Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-4">
              Learning That Actually Sticks
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No lectures. No boredom. Just practical skills with instant AI feedback.
            </p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {/* Large featured card - AI Tutor */}
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 opacity-10">
                <Mascot size="xl" mood="celebrating" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  Your AI Tutor Never Sleeps
                </h3>
                <p className="text-primary-100 text-lg mb-6 max-w-md">
                  Stuck on a concept? Need practice? Our AI tutor is there 24/7 to guide you through every lesson.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                    Instant feedback
                  </span>
                  <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                    Personalized pace
                  </span>
                  <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                    Practice conversations
                  </span>
                </div>
              </div>
            </div>

            {/* Soft Skills Focus */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 md:col-start-3 md:row-start-1">
                          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                            Skills Employers Need
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Communication, leadership, time management — the real differentiators in any career.
                          </p>
                        </div>

            {/* Accessible */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-slate-300 md:col-start-3 md:row-start-2">
                          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
                            <Globe className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-display font-bold text-slate-300 mb-2">
                            Built for Everyone
                          </h3>
                          <p className="text-slate-300 text-sm">
                            Works on any device. Designed for learners everywhere. No expensive software needed.
                          </p>
                        </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-4">
              What You'll Actually Learn
            </h2>
            <p className="text-slate-600">
              No fluff. Just practical skills you can use tomorrow.
            </p>
          </div>

          <div className="space-y-4">
            {skillsYouLearn.map((skill, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-display font-bold shrink-0 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <span className="text-slate-700 font-medium text-lg">{skill}</span>
                <CheckCircle2 className="w-5 h-5 text-primary-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/courses">
              <Button variant="primary" size="lg" className="font-display font-bold">
                See All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Course Categories - Icons instead of emoji */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Five core skill areas. Multiple courses in each. Start wherever you want.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {courseCategories.map((cat, index) => (
              <Link
                key={index}
                href="/courses"
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-primary-400 hover:shadow-lg transition-all duration-300 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-500">
                    {courses.filter(c => c.category === cat.category).length} courses
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Differentiated */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Mascot size="xl" mood="excited" className="mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">
            Your Career Deserves This Investment
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Workers from 50+ countries are already building skills that matter. Join them — it's free.
          </p>
          <Link href="/register">
            <Button
              variant="primary"
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 font-display font-bold text-lg px-8 py-4"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            No credit card required. Start learning in 30 seconds.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
