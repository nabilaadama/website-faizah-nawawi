import { User } from "@/core/entities/user";
import { UserRepository } from "@/core/interfaces/repositories/user-repository";
import { db } from "@/lib/firebase/firebase-config";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export class FirebaseUserRepository implements UserRepository {
  getById(id: string): Promise<User | null> {
      throw new Error("Method not implemented.");
  }
  getByEmail(email: string): Promise<User | null> {
      throw new Error("Method not implemented.");
  }
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
      throw new Error("Method not implemented.");
  }
  update(id: string, userData: Partial<User>): Promise<User> {
      throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
      throw new Error("Method not implemented.");
  }
  private userCollection = "users";

  async createUser(user: User): Promise<void> {
    try {
      const userRef = doc(db, this.userCollection, user.id);
      await setDoc(userRef, {
        ...user,
        createdAt: user.createdAt.toISOString(),
      });
    } catch (error) {
      throw new Error(
        `Failed to create user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const userRef = doc(db, this.userCollection, id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      const userData = userSnap.data();
      return {
        ...userData,
        id: userSnap.id,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      throw new Error(
        `Failed to get user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userQuery = query(
        collection(db, this.userCollection),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        ...userData,
        id: userDoc.id,
        createdAt: new Date(userData.createdAt),
      } as User;
    } catch (error) {
      throw new Error(
        `Failed to get user by email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.userCollection, id);
      await updateDoc(userRef, userData);
    } catch (error) {
      throw new Error(
        `Failed to update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
