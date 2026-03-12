-- Seed courses data
INSERT INTO courses (id, title, description, content, category, order_index) VALUES
    ('communication-basics', 'Communication Basics', 'Master the fundamentals of effective workplace communication', '# Communication Basics

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
- Show you''re listening
- Provide feedback
- Respond appropriately

## Module 3: Professional Email Writing
- Keep emails short
- Clear subject lines
- Proofread before sending', 'Communication', 1),
    ('interview-skills', 'Interview Skills', 'Ace your next job interview with confidence', '# Interview Skills

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
- End with why you''re interested

## Body Language
- Make eye contact
- Smile genuinely
- Sit up straight', 'Communication', 2),
    ('workplace-etiquette', 'Workplace Etiquette', 'Navigate professional settings with poise', '# Workplace Etiquette

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
- Give and receive feedback gracefully', 'Leadership', 3),
    ('time-management', 'Time Management', 'Maximize your productivity', '# Time Management

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
- Daily Planning', 'Productivity', 4),
    ('leadership-basics', 'Leadership Basics', 'Develop essential leadership skills', '# Leadership Basics

## Introduction
Leadership isn''t just for managers - everyone can lead.

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
- Celebrate achievements', 'Leadership', 5)
ON CONFLICT (id) DO NOTHING;
