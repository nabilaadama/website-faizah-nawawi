import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseApp from "../../lib/firebase/firebase-config";
import { AuthService } from "../../core/interfaces/services/auth-service";
import { User } from "../../core/entities/user";

export class FirebaseAuthService implements AuthService {
  async register(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    password: string
  ): Promise<User> {
    try {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      const now = new Date();
      const userDoc = {
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber || null,
        role: userData.role || "customer",
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...userDoc,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });

      return userDoc;
    } catch (error: any) {
      // Translate Firebase errors to domain errors
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email sudah terdaftar");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password terlalu lemah");
      } else if (error.code === "auth/invalid-api-key") {
        throw new Error(
          "Konfigurasi API Key Firebase salah atau tidak ditemukan"
        );
      }
      throw new Error("Terjadi kesalahan saat mendaftar");
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User data not found");
      }

      const userData = userDoc.data();

      return {
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
      };
    } catch (error: any) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        throw new Error("Email atau password salah");
      } else if (error.code === "auth/invalid-credential") {
        throw new Error("Kredensial tidak valid");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error(
          "Terlalu banyak percobaan login, silakan coba lagi nanti"
        );
      }
      throw new Error("Terjadi kesalahan saat login");
    }
  }

  async logout(): Promise<void> {
    // Implementation for logout
    throw new Error("Not implemented");
  }

  async getCurrentUser(): Promise<User | null> {
    // Implementation to get current user
    throw new Error("Not implemented");
  }
}
