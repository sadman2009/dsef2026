/**
 * Database Layer with Type Safety
 * Supabase client and database operations
 */

import { createClient } from '@supabase/supabase-js';
import type { User, UserPublic, UserInput, Course, Progress, ChatHistory, DashboardStats, SectionProgress, SectionProgressInput, CourseSectionProgress } from './types/database';
import { DatabaseError } from './errorHandler';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('==========================================');
  console.error('CRITICAL: Supabase credentials not configured!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('in your .env.local file');
  console.error('==========================================');
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

  sectionProgress: {
    findByUserCourse: async (userId: string, courseId: string): Promise<SectionProgress[]> => {
      const { data, error } = await supabase
        .from('section_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw new DatabaseError('Failed to fetch section progress', error);
      return data || [];
    },

    findByUser: async (userId: string): Promise<SectionProgress[]> => {
      const { data, error } = await supabase
        .from('section_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw new DatabaseError('Failed to fetch section progress', error);
      return data || [];
    },

    upsert: async (data: SectionProgressInput): Promise<void> => {
      const { error } = await supabase.from('section_progress').upsert({
        user_id: data.user_id,
        course_id: data.course_id,
        section_id: data.section_id,
        completed: data.completed,
        completed_at: data.completed ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,course_id,section_id' });

      if (error) throw new DatabaseError('Failed to update section progress', error);
    },

    batchUpsert: async (items: SectionProgressInput[]): Promise<void> => {
      const records = items.map(item => ({
        user_id: item.user_id,
        course_id: item.course_id,
        section_id: item.section_id,
        completed: item.completed,
        completed_at: item.completed ? new Date().toISOString() : null,
      }));

      const { error } = await supabase.from('section_progress').upsert(records, { onConflict: 'user_id,course_id,section_id' });

      if (error) throw new DatabaseError('Failed to batch update section progress', error);
    },

    getCourseProgress: async (userId: string, courseId: string, totalSections: number): Promise<CourseSectionProgress> => {
      const sections = await db.sectionProgress.findByUserCourse(userId, courseId);
      const completedSections = sections.filter(s => s.completed);

      return {
        course_id: courseId,
        sections: sections.map(s => ({
          section_id: s.section_id,
          completed: s.completed,
          completed_at: s.completed_at,
        })),
        total_sections: totalSections,
        completed_sections: completedSections.length,
        progress_percent: totalSections > 0 ? Math.round((completedSections.length / totalSections) * 100) : 0,
      };
    },
  },
};

// Legacy exports for backward compatibility
export const userDb = {
  create: db.users.create,
  findByEmail: { get: db.users.findByEmail },
  findById: { get: db.users.findById },
  getAll: db.users.getAll,
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

export const sectionProgressDb = {
  findByUserCourse: db.sectionProgress.findByUserCourse,
  findByUser: db.sectionProgress.findByUser,
  upsert: db.sectionProgress.upsert,
  batchUpsert: db.sectionProgress.batchUpsert,
  getCourseProgress: db.sectionProgress.getCourseProgress,
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

Effective communication is the cornerstone of professional success. In today's fast-paced workplace, the ability to convey ideas clearly, listen actively, and adapt your message to different audiences is more valuable than ever.

Poor communication leads to misunderstandings, wasted time, and damaged relationships. On the other hand, effective communication builds trust, increases productivity, and creates a positive work environment.

## Learning Objectives

By the end of this course, you will be able to:
- Apply active listening techniques in professional conversations
- Structure verbal messages for clarity and impact
- Adapt your communication style to different audiences
- Write clear, professional emails
- Recognize and respond appropriately to non-verbal cues
- Give and receive feedback constructively

## Module 1: The Foundations of Communication

### Engage
Think about the last misunderstanding you had at work. Maybe someone missed a deadline, or you received unclear instructions, or a project went off track. What went wrong? In most cases, the root cause was a communication breakdown—not the message itself, but how it was sent and received.

### Explore
Consider this scenario: A manager sends a Slack message: "We need to talk about your project."

**Possible interpretations:**
- "I'm in trouble"—panic, defensive mode
- "There's a problem with my work"—anxiety, justification prep
- "They want an update"—neutral, preparing status report
- "Good news—maybe a promotion!"—excitement

The same four words, four completely different reactions. The gap between intent and interpretation is where most workplace communication fails.

### Explain
Communication is fundamentally about being understood. It's a two-way process that involves both sending and receiving messages. Many people focus only on what they want to say, but effective communication requires equal attention to how your message is received.

**The Communication Model:**

Every communication interaction involves five elements:
- **Sender** – The person initiating the message
- **Message** – The information being conveyed
- **Channel** – The medium used (spoken, written, non-verbal)
- **Receiver** – The person interpreting the message
- **Feedback** – The response that confirms understanding

When any of these elements breaks down, miscommunication occurs. Your goal is to ensure the message you send matches the message received.

### Elaborate
**Common Communication Barriers:**

| Barrier | Description | Example |
|---------|-------------|---------|
| Assumptions | Thinking you know what someone means without clarifying | "I assumed they knew the deadline was Friday" |
| Distractions | Phones, notifications, or competing priorities | Checking email during a conversation |
| Jargon | Using technical terms your audience doesn't understand | "We need to optimize the API endpoints" (to non-technical stakeholder) |
| Emotional state | Anger, stress, or excitement clouding judgment | Sending an angry email you'll regret |
| Cultural differences | Varying norms and expectations | Different comfort levels with directness |

### Evaluate
**Quick Check:** In the communication model, what is the purpose of feedback?

A) To show you're paying attention
B) To confirm that the message received matches the message sent
C) To provide your opinion on the topic
D) To end the conversation

*(Answer: B – Feedback closes the loop, confirming understanding)*

### Your Action
[ ] Think of a recent miscommunication you experienced
[ ] Identify which element of the communication model broke down
[ ] Write down one thing you could have done differently
[ ] Share this reflection with a trusted colleague

---

## Module 2: Active Listening

### Engage
Here's a challenge: In your next conversation today, try to remember everything the other person says without interrupting, planning your response, or checking your phone. Most people can't do this for more than 60 seconds.

We spend 60% of our communication time listening, but we retain only 25% of what we hear. Why? Because most people listen with the intent to respond rather than to understand.

### Explore
Watch two colleagues in conversation. Notice these common behaviors:
- Person A talks; Person B nods while forming their response
- Person A mentions something interesting; Person B interrupts to share their similar experience
- Person A makes a point; Person B immediately counters with "Yeah, but..."

Now imagine if Person B instead said: "Tell me more about that" or "What I'm hearing is..." or simply stayed silent and listened. How would the conversation change?

### Explain
Active listening changes the dynamic by fully engaging with the speaker. It's not passive—it requires intentional effort to understand before being understood.

**The HEAR Method:**

- **H**alt – Stop what you're doing and give full attention
- **E**ngage – Make eye contact and use encouraging body language
- **A**nticipate – Stay focused on what the speaker is saying, not your response
- **R**eplay – Summarize and paraphrase to confirm understanding

### Your Action
[ ] In your next three conversations, practice the HEAR method
[ ] After each person finishes speaking, summarize what they said
[ ] Notice how this changes the quality of the conversation

---

## Module 3: Clear and Concise Speaking

### Engage
You're in a meeting. Your manager asks for an update. You have 30 seconds of attention before minds start wandering. What do you say?

### Explain
Speaking clearly isn't about using fancy words—it's about making your message easy to understand.

**The BLUF Technique:**

BLUF stands for "Bottom Line Up Front." Start with your main point, then provide supporting details.

### Your Action
[ ] Before your next meeting, write down your key point in one sentence
[ ] Practice delivering it first, before any context or background

---

## Module 4: Professional Email Writing

### Engage
You've just written an important email. Before hitting send, ask yourself: Will they know exactly what I need? Will they know when I need it?

### Explain
**The PREP Framework for Emails:**

| Element | Purpose | Example |
|---------|---------|---------|
| P – Purpose | Why you're writing | "I need your approval on the vendor contract." |
| R – Request | Specific action needed | "Please review Sections 3 and 4 by Thursday." |
| E – Evidence | Supporting details | "The vendor scored highest on our evaluation." |
| P – Parameters | Deadline and format | "I need your signature by Thursday 5 PM." |

### Your Action
[ ] Rewrite your last 3 emails using the PREP framework
[ ] Use this checklist before sending:
[ ] Subject line is specific
[ ] Purpose stated in first line
[ ] Action clearly requested
[ ] Deadline included

---

## Module 5: Non-Verbal Communication

### Engage
Someone says "I'm fine" while their arms are crossed, jaw tight, looking away. Which message do you believe—the words or the body language?

### Explain
Research suggests that 55-93% of communication is non-verbal. Your body language, facial expressions, and tone of voice all send powerful messages.

### Your Action
[ ] In your next three conversations, notice your own body language
[ ] Notice the other person's non-verbals—what are they saying beyond words?

---

## Module 6: Giving and Receiving Feedback

### Engage
Think about the last time someone gave you feedback. Did you feel defensive, anxious, unclear, or motivated?

### Explain
**The SBI Model:**

- **S**ituation – Describe the specific context
- **B**ehavior – Explain what you observed (not interpretations)
- **I**mpact – Share the effect of the behavior

### Your Action
[ ] Identify someone who gave you feedback recently—thank them for it
[ ] Write out feedback using the SBI model before having a conversation

---

## Summary

Communication shapes your professional reputation. Every interaction is an opportunity to demonstrate competence, build relationships, and create value.`,
      category: "Communication",
      order_index: 1,
      duration_minutes: 45,
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
    for (const course of courses) {
      const { error } = await supabase.from('courses').upsert({
        id: course.id,
        title: course.title,
        description: course.description,
        content: course.content,
        category: course.category,
        order_index: course.order_index,
        duration_minutes: course.duration_minutes,
      }, { onConflict: 'id' });
      if (error) {
        console.error(`Error upserting course ${course.id}:`, error);
      }
    }
    console.log('Courses synced successfully');
  } catch (error) {
    console.error('Failed to sync courses:', error);
  }
}

// Export getDb for backward compatibility
export async function getDb() {
  return supabase;
}
