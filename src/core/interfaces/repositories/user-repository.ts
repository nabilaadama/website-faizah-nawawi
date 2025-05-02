import { User } from "../../entities/user";

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
}
