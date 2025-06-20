// import { NextRequest, NextResponse } from "next/server";
// import { FirebaseUserRepository } from "@/data/repositories/firebase-user-repository";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// // GET /api/users - Get all users
// export async function GET(request: NextRequest) {
//   try {
//     // Check authentication
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Check if user is admin
//     // @ts-ignore - We're assuming the session has a role property
//     if (session.user.role !== "admin") {
//       return NextResponse.json(
//         { success: false, message: "Forbidden: Admin access required" },
//         { status: 403 }
//       );
//     }

//     // Initialize repository and use case
//     const userRepository = new FirebaseUserRepository();
//     const getAllUsers = new GetAllUsers(userRepository);

//     // Execute the use case
//     const users = await getAllUsers.execute();

//     return NextResponse.json({ success: true, users });
//   } catch (error) {
//     console.error("Error in GET /api/users:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
