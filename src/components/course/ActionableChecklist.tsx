"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface ActionableChecklistProps {
  items: string[];
  courseId: string;
  sectionId: string;
  checklistId: string;
  initialChecked?: string[];
  onCheck?: (itemId: string, checked: boolean) => void;
}

export function ActionableChecklist({
  items,
  courseId,
  sectionId,
  checklistId,
  initialChecked = [],
  onCheck,
}: ActionableChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(initialChecked));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const key = `checklist-${courseId}-${sectionId}-${checklistId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setCheckedItems(new Set(JSON.parse(stored)));
        }
      } catch (e) {
        console.error("Failed to load checklist state", e);
      }
    };
    loadState();
  }, [courseId, sectionId, checklistId]);

  const toggleItem = async (item: string) => {
    setSaving(true);
    const newChecked = new Set(checkedItems);
    
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    
    setCheckedItems(newChecked);
    
    try {
      const key = `checklist-${courseId}-${sectionId}-${checklistId}`;
      localStorage.setItem(key, JSON.stringify(Array.from(newChecked)));
      
      if (onCheck) {
        onCheck(item, newChecked.has(item));
      }
    } catch (e) {
      console.error("Failed to save checklist state", e);
    }
    
    setSaving(false);
  };

  const progress = items.length > 0 ? Math.round((checkedItems.size / items.length) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border-2 border-primary-200 p-5 my-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-slate-800">Action Items</h4>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-primary-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{progress}%</span>
          {saving && <Loader2 className="w-3 h-3 animate-spin text-primary-500" />}
        </div>
      </div>
      
      <ul className="space-y-2">
        {items.map((item, index) => {
          const isChecked = checkedItems.has(item);
          return (
            <li key={index}>
              <button
                onClick={() => toggleItem(item)}
                className="w-full flex items-start gap-3 text-left p-2 rounded-lg hover:bg-white/50 transition-colors group"
              >
                {isChecked ? (
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-primary-400 flex-shrink-0 mt-0.5 transition-colors" />
                )}
                <span className={`text-sm ${isChecked ? "text-slate-500 line-through" : "text-slate-700"}`}>
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function parseChecklistItems(content: string): string[] {
  const lines = content.split("\n");
  const items: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[ ]") || trimmed.startsWith("[x]")) {
      const item = trimmed.replace(/^\[[ x]\]\s*/, "").trim();
      if (item) {
        items.push(item);
      }
    }
  }
  
  return items;
}
