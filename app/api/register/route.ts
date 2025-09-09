import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import the shared auth config

/**
 * Handles POST requests to create a new user.
 * This endpoint is protected and can only be accessed by an admin.
 */
export async function POST(request: Request) {
  // 1. Get the current user's session from the server.
  // We pass `authOptions` to ensure it can correctly decode the session token.
  const session = await getServerSession(authOptions);

  // 2. Verify that the user is authenticated and has the 'ADMIN' role.
  // We cast `session.user` to `any` to access our custom `role` property.
  if (!session || (session.user as any)?.role !== "ADMIN") {
    // If not an admin, return a "Forbidden" error.
    return NextResponse.json(
      { error: "Forbidden: You are not authorized to perform this action." },
      { status: 403 }
    );
  }

  try {
    // 3. Parse the incoming request body for the new user's details.
    const body = await request.json();
    const { username, password, name, role } = body;

    // 4. Validate that all required fields are present.
    if (!username || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }
    
    // 5. Securely hash the new user's password.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create the new user in the database.
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
        role, // The role is assigned from the form ('USER' or 'ADMIN').
      },
    });

    // 7. Return the newly created user object (without the password) as a success response.
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    // 8. Handle potential errors, such as a username that already exists.
    // Prisma's P2002 code indicates a unique constraint violation.
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
       return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 } // 409 Conflict
      );
    }

    console.error("Registration error:", error);
    // Return a generic server error for any other issues.
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
