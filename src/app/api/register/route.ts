import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userDb } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit } from "@/middleware/rateLimit";
import { handleError, createErrorResponse } from "@/lib/errorHandler";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export async function POST(request: Request) {
  // Rate limiting check
  const rateLimitResult = checkRateLimit(request as any);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests", retryAfter: rateLimitResult.resetTime },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // Check if user already exists
    const existingUser = await userDb.findByEmail.get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = crypto.randomUUID();
    await userDb.create({
      id: userId,
      email,
      password_hash: passwordHash,
      name,
      role: "user",
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    const appError = handleError(error, "registration");
    const errorResponse = createErrorResponse(appError, false);
    return NextResponse.json(errorResponse, { status: appError.status });
  }
}
