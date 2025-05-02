import { NextRequest, NextResponse } from "next/server";
import { FirebaseUserRepository } from "@/data/repositories/firebase-user-repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin or requesting their own data
    // @ts-ignore - Assuming session has role and id properties
    const isAdmin = session.user.role === "admin";
    // @ts-ignore
    const isSelfRequest = session.user.id === params.id;

    if (!isAdmin && !isSelfRequest) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Initialize repository
    const userRepository = new FirebaseUserRepository();

    // Get the user
    const user = await userRepository.getById(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(`Error in GET /api/users/${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin or updating their own data
    // @ts-ignore - Assuming session has role and id properties
    const isAdmin = session.user.role === "admin";
    // @ts-ignore
    const isSelfRequest = session.user.id === params.id;

    if (!isAdmin && !isSelfRequest) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Parse request body
    const userData = await request.json();

    // Prevent non-admins from changing their role
    if (!isAdmin && userData.role) {
      delete userData.role;
    }

    // Initialize repository
    const userRepository = new FirebaseUserRepository();

    // Check if user exists
    const existingUser = await userRepository.getById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await userRepository.update(params.id, userData);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(`Error in PUT /api/users/${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can delete users
    // @ts-ignore - Assuming session has role property
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Initialize repository
    const userRepository = new FirebaseUserRepository();

    // Check if user exists
    const existingUser = await userRepository.getById(params.id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await userRepository.delete(params.id);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(`Error in DELETE /api/users/${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
