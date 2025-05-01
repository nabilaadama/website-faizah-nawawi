// import { AuthService } from "@/core/interfaces/services/auth-service";
// import { UserRepository } from "@/core/interfaces/repositories/user-repository";
// import { Address, User } from "@/core/entities/user";

// export interface RegisterUserDTO {
//   addresses: Address[];
//   email: string;
//   password: string;
//   name: string;
//   phoneNumber?: string;
// }

// export class RegisterUser {
//   constructor(
//     private authService: AuthService,
//     private userRepository: UserRepository
//   ) {}

//   async execute(
//     userData: RegisterUserDTO
//   ): Promise<{ user: User; token: string }> {
//     try {
//       // Create user in auth service
//       const { user, token } = await this.authService.register(
//         userData.email,
//         userData.password,
//         userData
//       );

//       // Create user in database
//       const newUser: User = {
//         id: user.id,
//         email: userData.email,
//         name: userData.name,
//         phoneNumber: userData.phoneNumber || "",
//         addresses: userData.addresses,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         role: "customer",
//       };

//       await this.userRepository.create(newUser);

//       return { user: newUser, token };
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error(`Registration failed: ${error.message}`);
//       }
//       throw new Error("Registration failed: Unknown error");
//     }
//   }
// }

import { AuthService } from "../../interfaces/services/auth-service";
import { User } from "../../entities/user";

export class RegisterUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    password: string

  ): Promise<User> {
    if (!userData.email || !password) {
      throw new Error("Email and password are required");
    }
    return this.authService.register(userData, password);
  }
}