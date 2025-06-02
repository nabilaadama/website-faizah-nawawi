import { User } from "@/core/entities/user";
import { UserRepository } from "@/core/interfaces/repositories/user-repository";

export class UserUseCases {
  constructor(private userRepository: UserRepository) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    return await this.userRepository.createUser(userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return await this.userRepository.updateUser(id, userData);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}