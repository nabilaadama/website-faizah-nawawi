import { AuthService } from "../../interfaces/services/auth-service";
import { User } from "../../entities/user";

export class LoginUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }
    return this.authService.login(email, password);
  }
}
