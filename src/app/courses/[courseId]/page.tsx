"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GraduationCap, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { sanitizeText } from "@/lib/sanitize";

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const courses = await response.json();
        const found = courses.find((c: Course) => c.id === courseId);
        if (found) {
          setCourse(found);
          setIsComplete(found.completed || false);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  const handleMarkComplete = async () => {
    if (!session) {
      alert("Please sign in to track your progress");
      return;
    }

    setMarkingComplete(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          completed: true,
          progressPercent: 100,
        }),
      });

      if (response.ok) {
        setIsComplete(true);
      } else {
        throw new Error("Failed to update progress");
      }
    } catch (err) {
      alert("Failed to mark as complete. Please try again.");
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">{error || "Course not found"}</p>
          <Link href="/courses" className="text-blue-400 hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Parse content into sections
  const contentSections = course.content.split(/^## /m).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">UpSkill</span>
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/courses" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Link>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
            {sanitizeText(course.category || "General")}
          </span>
          <h1 className="text-3xl font-bold text-white mt-4 mb-4">{sanitizeText(course.title)}</h1>
          <p className="text-slate-400 text-lg mb-8">{sanitizeText(course.description)}</p>

          <div className="prose prose-invert max-w-none">
            {contentSections.map((section: string, index: number) => {
              const lines = section.split("\n");
              const title = lines[0].trim();
              const rest = lines.slice(1).join("\n");

              if (index === 0) {
                return (
                  <div key={index}>
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">{title}</h2>
                    <div className="text-slate-300 space-y-4">
                      {rest.split("\n").map((line, i) => {
                        if (line.startsWith("### ")) {
                          return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">{line.replace("### ", "")}</h3>;
                        }
                        if (line.startsWith("## ")) {
                          return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace("## ", "")}</h2>;
                        }
                        if (line.startsWith("- ")) {
                          return <li key={i} className="text-slate-300 ml-4">{line.replace("- ", "")}</li>;
                        }
                        if (line.match(/^\d+\./)) {
                          return <li key={i} className="text-slate-300 ml-4">{line.replace(/^\d+\.\s*/, "")}</li>;
                        }
                        if (line.trim()) {
                          return <p key={i} className="text-slate-300">{line}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div key={index}>
                  <h2 className="text-2xl font-bold text-white mt-8 mb-4">{title}</h2>
                  <div className="text-slate-300 space-y-4">
                    {rest.split("\n").map((line: string, i: number) => {
                      if (line.startsWith("### ")) {
                        return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">{line.replace("### ", "")}</h3>;
                      }
                      if (line.startsWith("- ")) {
                        return <li key={i} className="text-slate-300 ml-4">{line.replace("- ", "")}</li>;
                      }
                      if (line.match(/^\d+\./)) {
                        return <li key={i} className="text-slate-300 ml-4">{line.replace(/^\d+\.\s*/, "")}</li>;
                      }
                      if (line.trim()) {
                        return <p key={i} className="text-slate-300">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete || isComplete}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isComplete
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              }`}
            >
              {markingComplete ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {isComplete ? "Completed" : "Mark as Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
