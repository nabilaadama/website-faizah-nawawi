import { User } from "../../entities/user";

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
    password: string
  ): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
