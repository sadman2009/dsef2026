/**
 * Database Type Definitions
 * Strict TypeScript types for Supabase database operations
 */

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  name: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

// User input for creation (requires password_hash)
export interface UserInput extends Omit<User, 'created_at'> {}

// User data without sensitive fields (for public-facing operations)
export interface UserPublic {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  order_index: number;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  completed: boolean;
  progress_percent: number;
  last_accessed: string;
  completed_at: string | null;
}

export interface SectionProgress {
  id: string;
  user_id: string;
  course_id: string;
  section_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface SectionProgressInput {
  user_id: string;
  course_id: string;
  section_id: string;
  completed: boolean;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  course_id: string | null;
  message: string;
  response: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  details?: unknown;
}

export interface UserProgress {
  course_id: string;
  completed: boolean;
  progress_percent: number;
  last_accessed: string;
  completed_at: string | null;
}

export interface DashboardStats {
  total_users: number;
  total_courses: number;
  completed_count: number;
  avg_progress: number;
}

export interface CourseSectionProgress {
  course_id: string;
  sections: {
    section_id: string;
    completed: boolean;
    completed_at: string | null;
  }[];
  total_sections: number;
  completed_sections: number;
  progress_percent: number;
}
