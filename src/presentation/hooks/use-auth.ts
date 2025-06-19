// "use client";
// import { User } from "../../core/entities/user";
// import { useState, useEffect } from "react";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       setIsLoading(true);
//       try {
//         const userData = localStorage.getItem("user");
//         if (userData) {
//           setUser(JSON.parse(userData));
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     // Create a mock user that matches your User interface
//     const mockUser: User = {
//       id: "1",
//       name: "John Doe",
//       email: email,
//       // addresses: [], // Default empty array
//       role: "customer", // Default role
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       // Add any other required properties from your User interface
//     };

//     localStorage.setItem("user", JSON.stringify(mockUser));
//     setUser(mockUser);
//     return mockUser;
//   };

//   const logout = async () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return {
//     user,
//     isLoading,
//     login,
//     logout,
//   };
// };

import { AuthContext } from "../providers/auth-provider";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}