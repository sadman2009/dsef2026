"use client";

import { CheckCircle } from "lucide-react";

interface SectionProgressProps {
  currentSection: number;
  totalSections: number;
  completedSections: Set<number>;
  onNavigate?: (index: number) => void;
}

export function SectionProgress({
  currentSection,
  totalSections,
  completedSections,
  onNavigate,
}: SectionProgressProps) {
  const progress = totalSections > 0 ? Math.round((completedSections.size / totalSections) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">Section Progress</span>
        <span className="text-sm font-semibold text-primary-600">
          {completedSections.size}/{totalSections} complete
        </span>
      </div>
      
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalSections }, (_, i) => {
          const isCompleted = completedSections.has(i);
          const isCurrent = i === currentSection;
          
          return (
            <button
              key={i}
              onClick={() => onNavigate?.(i)}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${isCompleted
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : isCurrent
                    ? "bg-primary-100 text-primary-700 ring-2 ring-primary-300"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }
              `}
              aria-label={`Section ${i + 1}${isCompleted ? " (completed)" : ""}${isCurrent ? " (current)" : ""}`}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SectionProgressBar({
  completedSections,
  totalSections,
}: {
  completedSections: Set<number>;
  totalSections: number;
}) {
  const progress = totalSections > 0 ? Math.round((completedSections.size / totalSections) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
        {progress}%
      </span>
    </div>
  );
}
