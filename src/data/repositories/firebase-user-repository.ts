import { User } from "@/core/entities/user";
import { UserRepository } from "@/core/interfaces/repositories/user-repository";
import { db } from "@/lib/firebase/firebase-config";
import {
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp
} from "firebase/firestore";

export class FirebaseUserRepository implements UserRepository {
  private collectionName = "users";

  private convertTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date();

    // If it's already a Date object
    if (timestamp instanceof Date) return timestamp;

    // If it's a Firebase Timestamp
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    }

    // If it's a string, try to parse it
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }

    // If it's a number (milliseconds)
    if (typeof timestamp === "number") {
      return new Date(timestamp);
    }

    // Fallback to current date
    return new Date();
  }

  async getUsers(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || "",
          name: data.name || "",
          phoneNumber: data.phoneNumber || null,
          role: data.role || "customer",
          createdAt: this.convertTimestamp(data.createdAt),
          updatedAt: this.convertTimestamp(data.updatedAt),
        } as User;
      });
    } catch (error) {
      console.error("Error getting users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          email: data.email || "",
          name: data.name || "",
          phoneNumber: data.phoneNumber || null,
          role: data.role || "customer",
          createdAt: this.convertTimestamp(data.createdAt),
          updatedAt: this.convertTimestamp(data.updatedAt),
        } as User;
      }

      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...userData,
        createdAt: now,
        updatedAt: now,
      });

      const newUser: User = {
        id: docRef.id,
        ...userData,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...userData,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();

      if (!data) {
        throw new Error("User not found after update");
      }

      return {
        id: updatedDoc.id,
        email: data.email || "",
        name: data.name || "",
        phoneNumber: data.phoneNumber || null,
        role: data.role || "customer",
        createdAt: this.convertTimestamp(data.createdAt),
        updatedAt: this.convertTimestamp(data.updatedAt),
      } as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }
}