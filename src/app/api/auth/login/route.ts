// // app/api/auth/login/route.ts
// import { NextResponse } from "next/server";
// import { LoginUserUseCase } from "@/core/usecases/auth/login-user";
// import { FirebaseAuthService } from "@/data/services/firebase-auth-service";

// const authService = new FirebaseAuthService();
// const loginUseCase = new LoginUserUseCase(authService);

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Validasi input dasar
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const user = await loginUseCase.execute(email, password);

//     return NextResponse.json({
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "Authentication failed",
//         code: "AUTH_ERROR",
//       },
//       { status: 401 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { LoginUserUseCase } from "../../../../core/usecases/auth/login-user";
import { FirebaseAuthService } from "../../../../data/services/firebase-auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate data
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Create dependencies
    const authService = new FirebaseAuthService();
    const loginUseCase = new LoginUserUseCase(authService);

    // Execute use case
    const user = await loginUseCase.execute(email, password);

    // Return user data including role for redirection
    return NextResponse.json(
      {
        user,
        message: "Login berhasil",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat login" },
      { status: 401 }
    );
  }
}