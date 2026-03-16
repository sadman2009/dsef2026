"use client";

import { Target, Search, BookOpen, Wrench, CheckCircle, Pencil, Lightbulb, AlertTriangle, LayoutDashboard } from "lucide-react";

export type ContentBlockType =
  | "engage"
  | "explore"
  | "explain"
  | "elaborate"
  | "evaluate"
  | "action"
  | "tip"
  | "warning"
  | "framework";

interface ContentBlockProps {
  type: ContentBlockType;
  title?: string;
  children: React.ReactNode;
}

const blockConfig: Record<ContentBlockType, { icon: React.ReactNode; label: string; bgClass: string; borderClass: string; iconBg: string }> = {
  engage: {
    icon: <Target className="w-4 h-4" />,
    label: "Engage",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
  explore: {
    icon: <Search className="w-4 h-4" />,
    label: "Explore",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },
  explain: {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Explain",
    bgClass: "bg-slate-50",
    borderClass: "border-slate-200",
    iconBg: "bg-slate-100 text-slate-600",
  },
  elaborate: {
    icon: <Wrench className="w-4 h-4" />,
    label: "Elaborate",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
  },
  evaluate: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Evaluate",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    iconBg: "bg-green-100 text-green-600",
  },
  action: {
    icon: <Pencil className="w-4 h-4" />,
    label: "Your Action",
    bgClass: "bg-primary-50",
    borderClass: "border-primary-200",
    iconBg: "bg-primary-100 text-primary-600",
  },
  tip: {
    icon: <Lightbulb className="w-4 h-4" />,
    label: "Pro Tip",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-300",
    iconBg: "bg-yellow-100 text-yellow-600",
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    label: "Watch Out",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    iconBg: "bg-red-100 text-red-600",
  },
  framework: {
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Framework",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
};

export function ContentBlock({ type, title, children }: ContentBlockProps) {
  const config = blockConfig[type];

  return (
    <div className={`rounded-xl border-2 ${config.bgClass} ${config.borderClass} p-5 my-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
          {config.icon}
        </div>
        <h4 className="font-semibold text-slate-800">
          {title || config.label}
        </h4>
      </div>
      <div className="text-slate-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ol]:my-3 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-sm [&_td]:p-2 [&_td]:text-sm [&_tr]:border-b [&_tr]:border-slate-200">
        {children}
      </div>
    </div>
  );
}

export function parseContentType(heading: string): ContentBlockType | null {
  const normalized = heading.toLowerCase().trim();
  
  if (normalized === "engage") return "engage";
  if (normalized === "explore") return "explore";
  if (normalized === "explain") return "explain";
  if (normalized === "elaborate") return "elaborate";
  if (normalized === "evaluate") return "evaluate";
  if (normalized === "your action" || normalized === "action") return "action";
  if (normalized === "pro tip" || normalized === "tip") return "tip";
  if (normalized === "warning" || normalized === "watch out") return "warning";
  if (normalized === "framework" || normalized === "model") return "framework";
  
  return null;
}
