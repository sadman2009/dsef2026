"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Target,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { sanitizeText } from "@/lib/sanitize";
import {
  ContentBlock,
  parseContentType,
  ActionableChecklist,
  parseChecklistItems,
} from "@/components/course";

interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  duration?: string;
}

interface ContentBlock {
  type: "paragraph" | "subheading" | "list" | "ordered-list";
  content: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CourseSection {
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
  quiz?: QuizQuestion[];
}

interface SectionProgressItem {
  section_id: string;
  completed: boolean;
  completed_at: string | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { data: session } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set(),
  );
  const [sectionProgressLoaded, setSectionProgressLoaded] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizScore, setQuizScore] = useState<{
    correct: number;
    total: number;
  }>({ correct: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

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

  useEffect(() => {
    async function fetchSectionProgress() {
      if (!session) return;
      try {
        const response = await fetch(
          `/api/progress/sections?courseId=${courseId}`,
        );
        if (response.ok) {
          const data: SectionProgressItem[] = await response.json();
          const sections = parseContent(course?.content || "");
          const completedIndices = new Set<number>();

          data.forEach((item) => {
            const index = parseInt(item.section_id.replace("section-", ""), 10);
            if (!isNaN(index) && item.completed) {
              completedIndices.add(index);
            }
          });

          setCompletedSections(completedIndices);
          setSectionProgressLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch section progress:", err);
      }
    }

    if (course && session) {
      fetchSectionProgress();
    }
  }, [courseId, course, session]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      const contentEl = document.getElementById("section-content");
      if (contentEl) {
        contentEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentSection((prev) =>
          Math.min(
            prev + 1,
            (course ? parseContent(course.content).length : 1) - 1,
          ),
        );
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [course]);

  const saveSectionProgress = useCallback(
    async (sectionIndex: number, completed: boolean) => {
      if (!session) return;

      setSavingProgress(true);
      try {
        await fetch("/api/progress/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            sectionId: `section-${sectionIndex}`,
            completed,
          }),
        });
      } catch (err) {
        console.error("Failed to save section progress:", err);
      } finally {
        setSavingProgress(false);
      }
    },
    [courseId, session],
  );

  const handleMarkSectionComplete = useCallback(
    (sectionIndex: number) => {
      setCompletedSections((prev) => {
        const newSet = new Set(prev);
        newSet.add(sectionIndex);
        return newSet;
      });
      saveSectionProgress(sectionIndex, true);
    },
    [saveSectionProgress],
  );

  const handleNextSection = useCallback(() => {
    if (!course) return;
    const sections = parseContent(course.content);
    handleMarkSectionComplete(currentSection);
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  }, [currentSection, course, handleMarkSectionComplete]);

  const handlePrevSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  }, [currentSection]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || "Course not found"}</p>
          <Link
            href="/courses"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const sections = parseContent(course.content);
  const progressPercent = Math.round(
    (completedSections.size / sections.length) * 100,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-button group-hover:shadow-button-hover transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">UpSkill</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/courses"
              className="text-slate-600 hover:text-slate-900 font-medium text-sm"
            >
              Courses
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="text-primary-600 font-medium text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-primary-600 mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <header className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                  {sanitizeText(course.category || "General")}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration || "~30 min"}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {sections.length} sections
                  </span>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                {sanitizeText(course.title)}
              </h1>
              <p className="text-slate-600">
                {sanitizeText(course.description)}
              </p>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-sm">
                    {progressPercent}%
                  </span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-700">Progress</p>
                  <p className="text-slate-500">
                    {completedSections.size}/{sections.length} sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 font-medium text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  Section {currentSection + 1}:{" "}
                  {sections[currentSection]?.title}
                </span>
                {mobileNavOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {mobileNavOpen && (
                <div className="mt-2 bg-white rounded-xl border border-slate-200 overflow-hidden animate-slide-down">
                  <ul className="divide-y divide-slate-100">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <button
                          onClick={() => {
                            setCurrentSection(index);
                            setMobileNavOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${
                            currentSection === index
                              ? "bg-primary-50 text-primary-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              completedSections.has(index)
                                ? "bg-primary-500 text-white"
                                : currentSection === index
                                  ? "bg-primary-100 text-primary-600"
                                  : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {completedSections.has(index) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span className="line-clamp-2">{section.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-4 sticky top-20 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-500" />
                Sections
              </h3>
              <ul className="space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all ${
                        currentSection === index
                          ? "bg-primary-50 text-primary-700 font-medium shadow-sm"
                          : completedSections.has(index)
                            ? "text-slate-600 hover:bg-slate-50"
                            : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          completedSections.has(index)
                            ? "bg-primary-500 text-white"
                            : currentSection === index
                              ? "bg-primary-200 text-primary-700"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {completedSections.has(index) ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="line-clamp-2 leading-snug">
                        {section.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {isComplete && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-3 py-2">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Course Completed!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div
              id="section-content"
              className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm"
            >
              <header className="mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      completedSections.has(currentSection)
                        ? "bg-primary-500 text-white"
                        : "bg-primary-100 text-primary-600"
                    }`}
                  >
                    {completedSections.has(currentSection) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      currentSection + 1
                    )}
                  </span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900">
                      {sections[currentSection]?.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Section {currentSection + 1} of {sections.length}
                    </p>
                  </div>
                </div>
              </header>

              <div className="prose prose-slate max-w-none">
                {sections[currentSection]?.contentBlocks.map(
                  (block, blockIndex) => {
                    if (block.type === "subheading") {
                      const contentType = parseContentType(block.content);
                      if (contentType) {
                        const nextBlocks: string[] = [];
                        let i = blockIndex + 1;
                        while (
                          i < sections[currentSection].contentBlocks.length
                        ) {
                          const nextBlock =
                            sections[currentSection].contentBlocks[i];
                          if (nextBlock.type === "subheading") break;
                          nextBlocks.push(nextBlock.content);
                          i++;
                        }
                        return (
                          <ContentBlock
                            key={blockIndex}
                            type={contentType}
                            title={block.content}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formatContent(nextBlocks.join("\n\n")),
                              }}
                            />
                          </ContentBlock>
                        );
                      }
                      return (
                        <h3
                          key={blockIndex}
                          className="text-lg font-semibold text-slate-800 mt-8 mb-4 flex items-center gap-2"
                        >
                          <span className="w-1 h-5 bg-primary-400 rounded-full"></span>
                          {block.content}
                        </h3>
                      );
                    } else if (block.type === "list") {
                      const items = block.content
                        .split("\n")
                        .map((item) => item.replace(/^[-*]\s*/, "").trim())
                        .filter(Boolean);

                      const checklistItems = parseChecklistItems(block.content);
                      if (checklistItems.length > 0) {
                        return (
                          <ActionableChecklist
                            key={blockIndex}
                            items={checklistItems}
                            courseId={courseId}
                            sectionId={`section-${currentSection}`}
                            checklistId={`block-${blockIndex}`}
                          />
                        );
                      }

                      return (
                        <ul key={blockIndex} className="space-y-2.5 my-4">
                          {items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3 text-slate-600"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0"></span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: formatContent(item),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      );
                    } else if (block.type === "ordered-list") {
                      return (
                        <ol key={blockIndex} className="space-y-2.5 my-4">
                          {block.content
                            .split("\n")
                            .map((item) => item.replace(/^\d+\.\s*/, "").trim())
                            .filter(Boolean)
                            .map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="flex items-start gap-3 text-slate-600"
                              >
                                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {itemIndex + 1}
                                </span>
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: formatContent(item),
                                  }}
                                />
                              </li>
                            ))}
                        </ol>
                      );
                    } else {
                      return (
                        <p
                          key={blockIndex}
                          className="text-slate-600 leading-relaxed mb-4"
                          dangerouslySetInnerHTML={{
                            __html: formatContent(block.content),
                          }}
                        />
                      );
                    }
                  },
                )}
              </div>

              {sections[currentSection]?.quiz &&
                sections[currentSection].quiz!.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800">
                            Knowledge Check
                          </h3>
                          <p className="text-sm text-slate-500">
                            Test your understanding of this section
                          </p>
                        </div>
                      </div>

                      {sections[currentSection].quiz!.map(
                        (question, qIndex) => {
                          const questionKey = `${sections[currentSection].id}-${qIndex}`;
                          const userAnswer = quizAnswers[questionKey];

                          return (
                            <div key={question.id} className="mb-6 last:mb-0">
                              <p className="font-medium text-slate-700 mb-3">
                                {qIndex + 1}. {question.question}
                              </p>
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <label
                                    key={oIndex}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                                      userAnswer === oIndex
                                        ? oIndex === question.correctAnswer
                                          ? "bg-green-50 border-green-400"
                                          : "bg-red-50 border-red-400"
                                        : "bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50/50"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={questionKey}
                                      checked={userAnswer === oIndex}
                                      onChange={() => {
                                        // Only update if not already answered
                                        if (
                                          quizAnswers[questionKey] === undefined
                                        ) {
                                          setQuizAnswers((prev) => ({
                                            ...prev,
                                            [questionKey]: oIndex,
                                          }));
                                          setQuizScore((prev) => ({
                                            correct:
                                              oIndex === question.correctAnswer
                                                ? prev.correct + 1
                                                : prev.correct,
                                            total: prev.total + 1,
                                          }));
                                        }
                                      }}
                                      className="text-primary-500 focus:ring-primary-500 w-4 h-4"
                                    />
                                    <span className="text-slate-700">
                                      {option}
                                    </span>
                                    {userAnswer === oIndex && (
                                      <span className="ml-auto">
                                        {oIndex === question.correctAnswer ? (
                                          <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                          <span className="text-red-500 text-sm font-medium">
                                            Incorrect
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </label>
                                ))}
                              </div>
                              {userAnswer !== undefined &&
                                userAnswer !== question.correctAnswer && (
                                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-800">
                                      <strong>Explanation:</strong>{" "}
                                      {question.explanation}
                                    </p>
                                  </div>
                                )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrevSection}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors font-medium text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentSection < sections.length - 1 ? (
                    <button
                      onClick={handleNextSection}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium text-sm shadow-button hover:shadow-button-hover"
                    >
                      Next Section
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete || isComplete}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        isComplete
                          ? "bg-green-100 text-green-700 cursor-default"
                          : "bg-primary-500 text-white hover:bg-primary-600 shadow-button hover:shadow-button-hover"
                      }`}
                    >
                      {markingComplete ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trophy className="w-4 h-4" />
                      )}
                      {isComplete ? "Completed!" : "Complete Course"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function parseContent(content: string): CourseSection[] {
  if (!content || typeof content !== "string") {
    return [];
  }

  // Check if content starts with a title (#)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  let courseTitle = "";
  let remainingContent = content;
  
  if (titleMatch && titleMatch.index === 0) {
    courseTitle = titleMatch[1].trim();
    remainingContent = content.slice(titleMatch[0].length).trim();
  }

  const sections = remainingContent.split(/^## /m).filter(Boolean);

  return sections.map((section: string, index: number) => {
    const lines = section.split("\n");
    let title = lines[0].trim();
    let body = lines.slice(1).join("\n");
    
    // Merge "Introduction" section with course title if first section
    if (index === 0 && title.toLowerCase() === "introduction" && courseTitle) {
      title = courseTitle;
    }

    const contentBlocks: ContentBlock[] = [];
    let currentBlock: string[] = [];
    let currentType: "paragraph" | "subheading" | "list" | "ordered-list" =
      "paragraph";

    body.split("\n").forEach((line: string) => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith("### ")) {
        if (currentBlock.length > 0) {
          contentBlocks.push({
            type: currentType,
            content: currentBlock.join("\n"),
          });
        }
        contentBlocks.push({
          type: "subheading",
          content: line.replace("### ", ""),
        });
        currentType = "paragraph";
        currentBlock = [];
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (currentType !== "list") {
          if (currentBlock.length > 0) {
            contentBlocks.push({
              type: currentType,
              content: currentBlock.join("\n"),
            });
          }
          currentType = "list";
          currentBlock = [line];
        } else {
          currentBlock.push(line);
        }
      } else if (/^\d+\.\s/.test(line)) {
        if (currentType !== "ordered-list") {
          if (currentBlock.length > 0) {
            contentBlocks.push({
              type: currentType,
              content: currentBlock.join("\n"),
            });
          }
          currentType = "ordered-list";
          currentBlock = [line];
        } else {
          currentBlock.push(line);
        }
      } else {
        if (currentType !== "paragraph") {
          if (currentBlock.length > 0) {
            contentBlocks.push({
              type: currentType,
              content: currentBlock.join("\n"),
            });
          }
          currentType = "paragraph";
          currentBlock = [line];
        } else {
          currentBlock.push(line);
        }
      }
    });

    if (currentBlock.length > 0) {
      contentBlocks.push({
        type: currentType,
        content: currentBlock.join("\n"),
      });
    }

    return {
      id: index === 0 ? "intro" : `section-${index}`,
      title,
      contentBlocks,
    };
  });
}

function formatContent(content: string): string {
  // Handle tables first (before other formatting)
  let formatted = content;
  
  // Match markdown tables: header row, separator, and data rows
  const tableRegex = /\|([^\n]+)\|\n\|[-:\|\s]+\|\n((?:\|[^\n]+\|\n?)+)/g;
  
  formatted = formatted.replace(tableRegex, (match, headerRow, dataRows) => {
    // Parse header
    const headers = headerRow
      .split('|')
      .map((h: string) => h.trim())
      .filter((h: string) => h.length > 0);
    
    // Parse data rows
    const rows = dataRows
      .trim()
      .split('\n')
      .filter((row: string) => row.trim())
      .map((row: string) => {
        const cells = row
          .split('|')
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
        return cells;
      });
    
    // Build HTML table
    let html = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-300">';
    
    // Header
    html += '<thead><tr class="bg-slate-100">';
    headers.forEach((header: string) => {
      html += `<th class="border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-slate-700">${escapeHtml(header)}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    rows.forEach((row: string[]) => {
      html += '<tr class="border-b border-slate-200">';
      row.forEach((cell: string) => {
        html += `<td class="border border-slate-300 px-3 py-2 text-sm text-slate-600">${escapeHtml(cell)}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    return html;
  });
  
  // Handle other markdown
  return formatted
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      "<code class='bg-slate-100 px-1.5 py-0.5 rounded text-sm'>$1</code>",
    )
    .replace(/\n/g, "<br/>");
}

function escapeHtml(text: string): string {
  const div = { __html: '' };
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
