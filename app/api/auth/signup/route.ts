import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, gymName, phone } = body;

    if (!name || !email || !password) {
      return validationErrorResponse({
        name: !name ? "Name is required" : null,
        email: !email ? "Email is required" : null,
        password: !password ? "Password is required" : null,
      });
    }

    const existingUser = await prisma.gymOwner.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", "USER_EXISTS", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.gymOwner.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gymName: gymName || null,
        phone: phone || null,
      },
    });

    return successResponse(
      { id: user.id, name: user.name, email: user.email },
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("Something went wrong", "SIGNUP_ERROR", 500);
  }
}
