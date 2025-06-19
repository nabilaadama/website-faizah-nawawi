"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../core/entities/user";
import { FirebaseAuthService } from "../../data/services/firebase-auth-service";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id" | "createdAt">,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = new FirebaseAuthService();

  useEffect(() => {
    const auth = getAuth();
    setLoading(true);

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const domainUser = await authService.getCurrentUser();
          setUser(domainUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error processing auth state:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, "id" | "createdAt">,
    password: string
  ) => {
    setLoading(true);
    try {
      const user = await authService.register(userData, password);
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
