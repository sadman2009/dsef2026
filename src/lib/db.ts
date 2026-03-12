/**
 * Database Layer with Type Safety
 * Supabase client and database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { User, UserPublic, UserInput, Course, Progress, ChatHistory, DashboardStats } from './types/database';
import { DatabaseError } from './errorHandler';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Some features may not work.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations with type safety
export const db = {
  users: {
    create: async (data: UserInput): Promise<void> => {
      const { error } = await supabase.from('users').insert(data);
      if (error) throw new DatabaseError('Failed to create user', error);
    },

    findByEmail: async (email: string): Promise<User | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError('Failed to find user by email', error);
      }
      return data;
    },

    findById: async (id: string): Promise<User | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError('Failed to find user by ID', error);
      }
      return data;
    },

  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError('Failed to get all users', error);
    // Cast to User[] - password_hash is optional in some contexts
    return (data || []).map(u => u as unknown as User);
  },
  },

  courses: {
    findAll: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index');
      
      if (error) throw new DatabaseError('Failed to fetch courses', error);
      return data || [];
    },

    findById: async (id: string): Promise<Course | null> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError('Failed to fetch course', error);
      }
      return data;
    },

    create: async (data: Omit<Course, 'created_at'>): Promise<void> => {
      const { error } = await supabase.from('courses').insert(data);
      if (error) throw new DatabaseError('Failed to create course', error);
    },
  },

  progress: {
    findByUser: async (userId: string): Promise<(Progress & { courses: { title: string; description: string | null } })[]> => {
      const { data, error } = await supabase
        .from('progress')
        .select('*, courses(title, description)')
        .eq('user_id', userId);
      
      if (error) throw new DatabaseError('Failed to fetch user progress', error);
      return data || [];
    },

    upsert: async (
      userId: string,
      courseId: string,
      completed: boolean,
      progressPercent: number
    ): Promise<void> => {
      const { error } = await supabase.from('progress').upsert({
        user_id: userId,
        course_id: courseId,
        completed,
        progress_percent: progressPercent,
        last_accessed: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,course_id' });
      
      if (error) throw new DatabaseError('Failed to update progress', error);
    },

    getStats: async (): Promise<DashboardStats> => {
      const [{ count: totalUsers }, { count: totalCourses }, { count: completedCount }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('progress').select('*', { count: 'exact', head: true }).eq('completed', true),
      ]);

      return {
        total_users: totalUsers || 0,
        total_courses: totalCourses || 0,
        completed_count: completedCount || 0,
        avg_progress: 0,
      };
    },
  },

  chat: {
    create: async (
      id: string,
      userId: string,
      courseId: string | null,
      message: string,
      response: string
    ): Promise<void> => {
      const { error } = await supabase.from('chat_history').insert({
        id,
        user_id: userId,
        course_id: courseId,
        message,
        response,
      });
      
      if (error) throw new DatabaseError('Failed to save chat history', error);
    },

    findByUser: async (userId: string): Promise<ChatHistory[]> => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) throw new DatabaseError('Failed to fetch chat history', error);
      return data || [];
    },
  },
};

// Legacy exports for backward compatibility
export const userDb = {
  create: db.users.create,
  findByEmail: { get: db.users.findByEmail },
  findById: { get: db.users.findById },
  getAll: { all: db.users.getAll },
};

export const courseDb = {
  findAll: db.courses.findAll,
  findById: db.courses.findById,
  create: db.courses.create,
};

export const progressDb = {
  findByUser: db.progress.findByUser,
  upsert: db.progress.upsert,
  getStats: db.progress.getStats,
};

export const chatDb = {
  create: db.chat.create,
  findByUser: db.chat.findByUser,
};

// Seed courses function (for initial setup)
export async function seedCourses(): Promise<void> {
  const courses = [
    {
      id: "communication-basics",
      title: "Communication Basics",
      description: "Master the fundamentals of effective workplace communication",
      content: `# Communication Basics

## Introduction
Effective communication is the cornerstone of professional success.

## Learning Objectives
- Understand verbal and non-verbal communication
- Learn active listening techniques
- Practice clear messaging

## Module 1: The Basics
Communication is about being understood. Key skills include:
- Clear, simple language
- Active listening
- Body language awareness

## Module 2: Active Listening
- Give full attention
- Show you're listening
- Provide feedback
- Respond appropriately

## Module 3: Professional Email Writing
- Keep emails short
- Clear subject lines
- Proofread before sending`,
      category: "Communication",
      order_index: 1,
    },
    {
      id: "interview-skills",
      title: "Interview Skills",
      description: "Ace your next job interview with confidence",
      content: `# Interview Skills

## Introduction
Job interviews can be nerve-wracking. With preparation, you can shine.

## Learning Objectives
- Prepare effectively
- Answer common questions
- Make a positive impression

## Before the Interview
- Research the company
- Prepare your materials
- Practice common questions

## Common Questions
### Tell me about yourself
- Start with current situation
- Highlight relevant experience
- End with why you're interested

## Body Language
- Make eye contact
- Smile genuinely
- Sit up straight`,
      category: "Communication",
      order_index: 2,
    },
    {
      id: "workplace-etiquette",
      title: "Workplace Etiquette",
      description: "Navigate professional settings with poise",
      content: `# Workplace Etiquette

## Introduction
Professional etiquette helps build relationships and advance careers.

## Learning Objectives
- Understand professional conduct
- Build positive relationships
- Navigate difficult situations

## Professional Conduct
- Be punctual
- Meet deadlines
- Respect boundaries

## Digital Etiquette
- Respond within 24 hours
- Use professional language
- Be careful with tone

## Building Relationships
- Introduce yourself to colleagues
- Offer help when possible
- Give and receive feedback gracefully`,
      category: "Leadership",
      order_index: 3,
    },
    {
      id: "time-management",
      title: "Time Management",
      description: "Maximize your productivity",
      content: `# Time Management

## Introduction
Time is your most valuable resource. Manage it wisely.

## Learning Objectives
- Prioritize tasks
- Eliminate time wasters
- Build productive habits

## Prioritization
Use the Eisenhower Matrix:
- Urgent & Important: Do first
- Not Urgent & Important: Schedule
- Urgent & Not Important: Delegate
- Not Urgent & Not Important: Eliminate

## Time Wasters
- Social media
- Unnecessary meetings
- Procrastination

## Building Habits
- The Two-Minute Rule
- Time Blocking
- Daily Planning`,
      category: "Productivity",
      order_index: 4,
    },
    {
      id: "leadership-basics",
      title: "Leadership Basics",
      description: "Develop essential leadership skills",
      content: `# Leadership Basics

## Introduction
Leadership isn't just for managers - everyone can lead.

## Learning Objectives
- Understand leadership styles
- Communicate vision
- Motivate others

## What Makes a Leader
Key traits:
- Integrity
- Communication
- Empathy
- Decision-making

## Communication as a Leader
- Be clear and specific
- Explain the "why"
- Check for understanding

## Building Trust
- Be consistent
- Do what you say
- Celebrate achievements`,
      category: "Leadership",
      order_index: 5,
    },
  ];

  try {
    // Check if courses exist
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('courses').insert(courses);
      if (error) {
        console.error('Error seeding courses:', error);
      } else {
        console.log('Courses seeded successfully');
      }
    }
  } catch (error) {
    console.error('Failed to seed courses:', error);
  }
}

// Export getDb for backward compatibility
export async function getDb() {
  return supabase;
}
