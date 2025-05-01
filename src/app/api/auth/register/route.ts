import { NextRequest, NextResponse } from "next/server";
import { RegisterUserUseCase } from "../../../../core/usecases/auth/register-user";
import { FirebaseAuthService } from "../../../../data/services/firebase-auth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validate data
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua kolom harus diisi" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password dan konfirmasi password tidak cocok" },
        { status: 400 }
      );
    }

    // Create dependencies
    const authService = new FirebaseAuthService();
    const registerUseCase = new RegisterUserUseCase(authService);

    // Execute use case
    const user = await registerUseCase.execute(
      {
        email,
        name,
        role: "customer",
      },
      password
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    );
  }
}
