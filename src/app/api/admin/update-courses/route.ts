import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/db";

const courses = [
  {
    id: "communication-basics",
    title: "Communication Basics",
    description: "Master the fundamentals of effective workplace communication",
    content: `# Communication Basics

## Introduction

Effective communication is the cornerstone of professional success. In today's fast-paced workplace, the ability to convey ideas clearly, listen actively, and adapt your message to different audiences is more valuable than ever.

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
Think about the last misunderstanding you had at work. Maybe someone missed a deadline, or you received unclear instructions. What went wrong? In most cases, the root cause was a communication breakdown.

### Explore
Consider this scenario: A manager sends a Slack message: "We need to talk about your project."

**Possible interpretations:**
- "I'm in trouble"—panic
- "There's a problem"—anxiety
- "They want an update"—neutral
- "Good news!"—excitement

The same four words, four different reactions. The gap between intent and interpretation is where communication fails.

### Explain
**The Communication Model:**

Every communication interaction involves five elements:
- **Sender** – The person initiating the message
- **Message** – The information being conveyed
- **Channel** – The medium used (spoken, written, non-verbal)
- **Receiver** – The person interpreting the message
- **Feedback** – The response that confirms understanding

### Elaborate
**Common Communication Barriers:**

| Barrier | Description | Example |
|---------|-------------|---------|
| Assumptions | Thinking you know without clarifying | "I assumed they knew the deadline" |
| Distractions | Phones, notifications | Checking email during conversation |
| Jargon | Technical terms audience doesn't understand | "Optimize API endpoints" to non-technical |
| Emotional state | Anger, stress clouding judgment | Sending angry email you'll regret |

### Evaluate
**Quick Check:** In the communication model, what is the purpose of feedback?

A) To show you're paying attention
B) To confirm that the message received matches the message sent
C) To provide your opinion
D) To end the conversation

*(Answer: B)*

### Your Action
[ ] Think of a recent miscommunication you experienced
[ ] Identify which element of the communication model broke down
[ ] Write one thing you could have done differently

---

## Module 2: Active Listening

### Engage
Here's a challenge: In your next conversation, try to remember everything the other person says without interrupting, planning your response, or checking your phone.

We spend 60% of our communication time listening, but retain only 25% of what we hear.

### Explain
**The HEAR Method:**

- **H**alt – Stop what you're doing and give full attention
- **E**ngage – Make eye contact and use encouraging body language
- **A**nticipate – Stay focused on the speaker, not your response
- **R**eplay – Summarize and paraphrase to confirm understanding

### Your Action
[ ] In your next three conversations, practice the HEAR method
[ ] After each person finishes, summarize what they said

---

## Module 3: Clear and Concise Speaking

### Engage
You're in a meeting. Your manager asks for an update. You have 30 seconds of attention. What do you say?

### Explain
**The BLUF Technique:**

BLUF stands for "Bottom Line Up Front." Start with your main point, then provide supporting details.

### Your Action
[ ] Before your next meeting, write your key point in one sentence
[ ] Practice delivering it first, before any context

---

## Module 4: Professional Email Writing

### Engage
You've just written an important email. Before hitting send, ask: Will they know exactly what I need? When I need it?

### Explain
**The PREP Framework:**

| Element | Purpose | Example |
|---------|---------|---------|
| P – Purpose | Why you're writing | "I need approval on the contract" |
| R – Request | Specific action | "Please review Sections 3-4 by Thursday" |
| E – Evidence | Supporting details | "Vendor scored highest on evaluation" |
| P – Parameters | Deadline | "I need signature by Thursday 5 PM" |

### Your Action
[ ] Rewrite your last 3 emails using PREP
[ ] Use checklist: Subject specific? Purpose first line? Action clear? Deadline included?

---

## Module 5: Non-Verbal Communication

### Engage
Someone says "I'm fine" with crossed arms, tight jaw, looking away. Which message do you believe?

### Explain
Research suggests 55-93% of communication is non-verbal. Your body language, expressions, and tone send powerful messages.

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
[ ] Identify someone who gave you feedback—thank them for it
[ ] Write out feedback using SBI before having a conversation

---

## Summary

Communication shapes your professional reputation. Every interaction is an opportunity to demonstrate competence and build relationships.`,
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

Job interviews can be nerve-wracking. With proper preparation, you can transform interviews into opportunities to showcase your value.

## Learning Objectives

By the end of this course, you will be able to:
- Research companies effectively before interviews
- Answer common questions using structured frameworks
- Use body language to project confidence
- Handle difficult questions with grace
- Ask meaningful questions
- Follow up professionally

## Module 1: Pre-Interview Research

### Engage
Imagine walking into an interview and the first question is: "What do you know about our company?"

Would your answer impress—or reveal you barely glanced at their website?

### Explain
**What to Research:**

| Level | What to Find | Where to Look |
|-------|--------------|---------------|
| Company | Mission, values, culture | Website, press releases |
| Role | Key responsibilities | Job posting, LinkedIn |
| Industry | Trends, challenges | Trade publications |

### Your Action
[ ] Pick a company you'd like to work for
[ ] Write three ways your skills address their challenges

---

## Module 2: Answering Common Questions

### Engage
The interviewer asks: "Tell me about yourself."

Do you share your life story? Recite your resume? Freeze up?

### Explain
**The STAR Method:**

- **S**ituation – Briefly set the context
- **T**ask – What you needed to accomplish
- **A**ction – What YOU did (not the team)
- **R**esult – Outcome with quantifiable data

### Your Action
[ ] Write STAR stories for 5 behavioral questions
[ ] Practice "Tell me about yourself" (under 2 minutes)

---

## Module 3: Body Language and Presence

### Engage
Within 7 seconds, interviewers form impressions. Before you speak, your presence has communicated.

### Explain
**During the Interview:**

| Element | Best Practice | Common Mistakes |
|---------|---------------|-----------------|
| Handshake | Firm, not crushing | Limp OR dominating |
| Posture | Upright, forward | Slouching, crossed arms |
| Eye contact | 60-70% | Avoiding OR staring |
| Voice | Moderate pace | Rushing, monotone |

### Your Action
[ ] Record yourself answering a question—watch for habits
[ ] Practice entering a room and introducing yourself

---

## Module 4: Handling Difficult Questions

### Engage
The interviewer asks: "Why did you leave your last job?" or "What's your salary expectation?"

Your heart rate spikes. What do you say?

### Explain
**Types of Difficult Questions:**

| Type | Strategy |
|------|----------|
| Employment gaps | Pivot to what you learned |
| Being fired | Brief, honest, growth-focused |
| Weaknesses | Real weakness + improvement plan |
| Salary | Defer early; research-based if pressed |

### Your Action
[ ] Write honest answers for gaps or challenging experiences
[ ] Prepare three weaknesses with improvement plans

---

## Module 5: Asking Great Questions

### Engage
At the end: "Do you have any questions for us?"

Your answer should always be "Yes."

### Explain
**Good Questions:**
- What would success look like in the first 90 days?
- What's the biggest challenge facing this team?
- How does this role contribute to company goals?

**Questions to Avoid:**
- "What does this company do?" (Research fail)
- "How much vacation do I get?" (Premature)

### Your Action
[ ] Write 10 questions about role, team, company
[ ] Research interviewers on LinkedIn

---

## Module 6: Following Up

### Engage
You nailed the interview. Now what?

Most candidates do nothing. The ones who stand out take action.

### Explain
Send personalized thank-you emails within 24 hours:
1. Thank them for their time
2. Reference something specific from the conversation
3. Reiterate your interest
4. Offer additional information if needed

### Your Action
[ ] Prepare a thank-you email template
[ ] Set reminder to follow up if no response in one week

---

## Summary

Interview success comes from thorough preparation and authentic presentation.`,
    category: "Communication",
    order_index: 2,
    duration_minutes: 50,
  },
  {
    id: "workplace-etiquette",
    title: "Workplace Etiquette",
    description: "Navigate professional settings with poise",
    content: `# Workplace Etiquette

## Introduction

Professional etiquette is the foundation of successful workplace relationships. It encompasses the unwritten rules that govern how we interact.

## Learning Objectives

By the end of this course, you will be able to:
- Communicate professionally across channels
- Navigate office dynamics and build relationships
- Handle workplace conflicts diplomatically
- Practice proper remote work etiquette

## Module 1: Professional Communication

### Engage
Every message you send reflects your professionalism. The channel you choose, your tone, your responsiveness—all contribute to perception.

### Explain
**Channel Selection:**

| Channel | Best For | Response Time |
|---------|----------|---------------|
| Email | Formal, documentation | 24 hours |
| Slack/Teams | Quick questions, updates | Same day |
| Phone/Video | Urgent, sensitive | Immediate |

### Your Action
[ ] Review last 10 messages—right channel?
[ ] Check your Slack status—accurate?

---

## Module 2: Office Conduct

### Engage
You walk into the office kitchen. Dishes in sink, coffee pot empty, microwave splattered.

What do you think about the person who left it?

### Explain
**Shared Spaces Etiquette:**

| Space | Rules |
|-------|-------|
| Open office | Use headphones, keep voice down |
| Kitchen | Clean immediately, replace what you finish |
| Meeting rooms | Book in advance, leave clean |

### Your Action
[ ] How does your workspace look to others?
[ ] Clean up after yourself in shared spaces today

---

## Module 3: Meeting Etiquette

### Engage
You've been in productive meetings. You've also been in meetings that felt like a waste of time.

What makes the difference?

### Explain
**Before the Meeting:**
- Question necessity
- Set agenda (24h in advance)
- Invite only essentials

**During:**
- Arrive on time
- Stay engaged (no phones)
- End with clear action items

### Your Action
[ ] Send agenda 24h before next meeting
[ ] Arrive 2 minutes early to next three meetings

---

## Module 4: Handling Difficult Situations

### Engage
You receive criticism publicly. A coworker takes credit for your idea.

How you respond reveals your professionalism.

### Explain
**Receiving Criticism:**
1. Listen without interrupting
2. Thank them for feedback
3. Ask clarifying questions
4. Take time to process

**Giving Criticism:**
- Do it privately
- Focus on behavior, not personality
- Be specific with examples

### Your Action
[ ] Think of a conflict—what's your plan?
[ ] Practice receiving criticism without defending

---

## Module 5: Remote Work Etiquette

### Engage
Remote work has unique challenges. Lines between work and home blur.

### Explain
**Remote Best Practices:**
- Maintain consistent hours
- Use video for important calls
- Over-communicate in async messages
- Create dedicated workspace
- Have start/end rituals

### Your Action
[ ] Evaluate workspace—professional on camera?
[ ] Check status—reflects actual availability?

---

## Module 6: Cultural Awareness

### Engage
You greet a colleague from Japan with firm handshake and direct eye contact. They seem uncomfortable. What went wrong?

### Explain
**Communication Styles:**

| Style | Cultures |
|-------|----------|
| Direct | US, Germany |
| Indirect | Japan, UK |
| Formal | France, Japan |
| Informal | US, Australia |

### Your Action
[ ] Learn correct pronunciation of three colleagues' names
[ ] Ask someone about a cultural norm you've wondered about

---

## Summary

Professional etiquette creates a foundation for workplace success.`,
    category: "Leadership",
    order_index: 3,
    duration_minutes: 45,
  },
  {
    id: "time-management",
    title: "Time Management",
    description: "Maximize your productivity",
    content: `# Time Management

## Introduction

Time is your most limited resource. Everyone gets 24 hours. The difference is how effectively you use them.

## Learning Objectives

By the end of this course, you will be able to:
- Use prioritization frameworks
- Apply time-blocking techniques
- Eliminate common time wasters
- Build sustainable productivity habits

## Module 1: Foundations

### Engage
Think about yesterday. Where did your time actually go?

Most people guess wrong. The gap between perception and reality is where productivity leaks.

### Explain
**Key Principles:**

| Principle | Insight |
|-----------|---------|
| Not all tasks equal | 2 hours on strategy > 2 hours on busywork |
| Energy matters | Match tasks to energy levels |
| Focus beats multitasking | Multitasking reduces productivity by 40% |
| Systems over willpower | Build habits, don't rely on discipline |

### Your Action
[ ] Track time for 3 days in 30-minute blocks
[ ] Calculate: What % went to high-value work?

---

## Module 2: Prioritization

### Engage
Your to-do list has 25 items. You have time for 5. How do you choose?

### Explain
**The Eisenhower Matrix:**

| | Urgent | Not Urgent |
|---|--------|------------|
| **Important** | DO first | SCHEDULE |
| **Not Important** | DELEGATE | ELIMINATE |

**Key Insight:** Spend most time in "Not Urgent/Important"—strategic work.

### Your Action
[ ] Write your to-do list
[ ] Place each in the matrix
[ ] Identify top 3 MITs (Most Important Tasks)

---

## Module 3: Time Blocking

### Engage
Intentions without protected time become wishes. "I'll work on strategy" without a scheduled block becomes "tomorrow"—every day.

### Explain
**How to Time Block:**
1. Plan tomorrow today
2. Block MITs first
3. Include buffer time (+20%)
4. Group similar tasks
5. Protect focus blocks

**Example Schedule:**

| Time | Block |
|------|-------|
| 8:00-8:30 | Email triage |
| 8:30-10:30 | FOCUS: MIT #1 |
| 10:30-11:00 | Break + email |
| 11:00-12:00 | Meetings |

### Your Action
[ ] Create time block schedule for tomorrow
[ ] Block your 2 MITs first
[ ] Include one 90-minute deep work block

---

## Module 4: Eliminating Time Wasters

### Engage
You're working on something important. A notification pops up. "Just check" for 30 seconds. Forty-five minutes later, you're in a rabbit hole.

### Explain
**Common Time Wasters:**

| Waster | Solution |
|--------|----------|
| Notifications | Turn off non-essential |
| Constant email | Schedule 2-3 blocks/day |
| Phone | Keep in another room during focus |
| Unnecessary meetings | Request agenda or decline |

### Your Action
[ ] Identify top 3 time wasters
[ ] Turn off non-essential notifications now

---

## Module 5: Managing Meetings

### Engage
Average professional spends 23 hours/week in meetings. More than half your work week.

How many were necessary?

### Explain
**Before Accepting:**
- What's the objective?
- Is my attendance necessary?
- Could this be async?

**If Organizing:**
- Define clear objective
- Send agenda 24h advance
- Invite only essentials
- Document action items

### Your Action
[ ] Review calendar for next week
[ ] Decline or propose async for one meeting

---

## Module 6: Building Habits

### Engage
Time management isn't about willpower—it's about systems that make productivity automatic.

### Explain
**The Two-Minute Rule:**

If a task takes less than 2 minutes, do it immediately. Don't add to a list.

**Morning Routine:**
- Review calendar and priorities
- Identify MITs
- Process email (triage, don't respond)

**Evening Routine:**
- Review: What did I accomplish?
- Capture: Tomorrow's tasks
- Prepare: Set up for first task

### Your Action
[ ] Design 15-minute morning routine
[ ] Create evening shutdown ritual
[ ] Try Two-Minute Rule for one day

---

## Summary

Time management compounds. Start with one technique today.`,
    category: "Productivity",
    order_index: 4,
    duration_minutes: 50,
  },
  {
    id: "leadership-basics",
    title: "Leadership Basics",
    description: "Develop essential leadership skills",
    content: `# Leadership Basics

## Introduction

Leadership isn't reserved for people with "Manager" in their title. Every day, you make choices that influence others, shape outcomes, and drive results.

## Learning Objectives

By the end of this course, you will be able to:
- Understand different leadership styles
- Communicate vision clearly
- Build and maintain trust
- Motivate and inspire others
- Give constructive feedback

## Module 1: What Makes a Leader

### Engage
Think of the best leader you've ever worked with. What made them great?

Now the worst. What made them ineffective?

The difference isn't title—it's how they made people feel.

### Explain
**Leadership vs. Management:**

| Management | Leadership |
|------------|------------|
| Systems and processes | People and vision |
| "How" and "when" | "What" and "why" |
| Maintains order | Creates change |
| Plans and organizes | Motivates and inspires |

### Your Action
[ ] Identify a leader you admire—write 3 behaviors
[ ] Find one situation to lead without authority

---

## Module 2: Leadership Styles

### Engage
You're facing a crisis—24 hours to fix a critical bug. Do you gather consensus? Direct the team? Coach individuals?

Context determines the right approach.

### Explain
**Leadership Styles:**

| Style | Best When | Risk |
|-------|-----------|------|
| Visionary | New direction | Disconnected from reality |
| Coaching | Helping someone grow | Time-intensive |
| Democratic | Need team buy-in | Slow decisions |
| Commanding | Genuine emergency | Destroys trust if overused |

### Your Action
[ ] Identify your default style
[ ] Practice different style in low-stakes situation

---

## Module 3: Communicating as a Leader

### Engage
You have a clear vision. You know where they need to go. But do they?

### Explain
**Communicating Vision:**

A compelling vision answers:
- Where are we going?
- Why does it matter?
- How do we get there?

**Key: People need to hear messages 7+ times before they stick.**

### Your Action
[ ] Write your team's vision in one sentence
[ ] Identify one message to communicate more consistently

---

## Module 4: Building Trust

### Engage
Trust is the foundation of leadership. Without it, influence is impossible.

Trust takes time to build, moments to destroy.

### Explain
**The Trust Equation:**

Trust = (Credibility + Reliability + Intimacy) / Self-Orientation

| Component | Meaning |
|-----------|---------|
| Credibility | Do I know my stuff? |
| Reliability | Can you count on me? |
| Intimacy | Are we connected? |
| Self-Orientation | Am I in it for me or you? (Lower = better) |

### Your Action
[ ] Rate yourself on each component (1-10)
[ ] Identify one trust-building behavior to practice daily

---

## Module 5: Motivating Others

### Engage
You've told your team what to do. Explained why. But are they motivated?

### Explain
**Autonomy, Mastery, Purpose (Daniel Pink):**

| Driver | What People Want | How to Provide |
|--------|------------------|----------------|
| Autonomy | Control over work | Let people decide HOW |
| Mastery | Getting better | Provide growth opportunities |
| Purpose | Meaningful impact | Connect work to impact |

### Your Action
[ ] Ask each team member about their motivators
[ ] Find one way to increase autonomy

---

## Module 6: Feedback and Difficult Conversations

### Engage
A team member is underperforming. You should address it, but it feels awkward. So you avoid it.

The problem gets worse.

### Explain
**The SBI Model:**

- **S**ituation – Describe the specific context
- **B**ehavior – Explain what you observed
- **I**mpact – Share the effect

**Best Practices:**
- Give feedback promptly (but privately)
- Focus on behavior, not personality
- Be specific with examples
- Suggest improvements

### Your Action
[ ] Identify feedback you've been avoiding
[ ] Write it out using SBI
[ ] Schedule conversation within 48 hours

---

## Summary

Leadership is a practice, not a position. Every day presents opportunities to improve.`,
    category: "Leadership",
    order_index: 5,
    duration_minutes: 55,
  },
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    let updated = 0;
    let errors = 0;

    for (const course of courses) {
      const { error } = await supabase
        .from("courses")
        .upsert({
          id: course.id,
          title: course.title,
          description: course.description,
          content: course.content,
          category: course.category,
          order_index: course.order_index,
          duration_minutes: course.duration_minutes,
        }, { onConflict: "id" });

      if (error) {
        console.error(`Error updating ${course.id}:`, error);
        errors++;
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      errors,
      message: `Updated ${updated} courses, ${errors} errors`,
    });
  } catch (error) {
    console.error("Update courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
