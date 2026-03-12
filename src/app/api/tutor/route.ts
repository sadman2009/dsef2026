import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatDb, courseDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, courseId } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Get course context if provided
    let courseContext = "";
    if (courseId) {
      const course = await courseDb.findById.get(courseId);
      if (course) {
        courseContext = `\n\nThe user is currently learning about: ${course.title}\nCourse content:\n${course.description}\n\n`;
      }
    }

    // Build system prompt
    const systemPrompt = `You are a friendly and knowledgeable soft skills tutor for UpSkill. Your role is to help workers in developing economies learn essential professional skills like communication, leadership, time management, and workplace etiquette.

Guidelines:
- Be encouraging and supportive
- Use simple, clear language
- Provide practical examples
- Break down complex topics into digestible pieces
- Ask follow-up questions to check understanding
- Keep responses concise but helpful${courseContext}

Remember: You're helping people improve their careers and lives through better soft skills.`;

    // Call Groq API
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Save to chat history
    const chatId = crypto.randomUUID();
    await chatDb.create(chatId, userId, courseId || null, message, aiResponse);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Tutor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}