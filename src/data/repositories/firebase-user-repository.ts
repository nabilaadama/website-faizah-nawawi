import { User } from "@/core/entities/user";
import { UserRepository } from "@/core/interfaces/repositories/user-repository";
import { db } from "@/lib/firebase/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export class FirebaseUserRepository implements UserRepository {
  private collection = "users";

  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return this.mapUserData(id, data);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw new Error("Failed to get user by ID");
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.collection),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.mapUserData(doc.id, doc.data());
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to get user by email");
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collection));
      return querySnapshot.docs.map((doc) =>
        this.mapUserData(doc.id, doc.data())
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      throw new Error("Failed to get all users");
    }
  }

  async create(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      const newUser = {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collection), newUser);

      // Get the newly created document
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Failed to create user");
      }

      return this.mapUserData(docRef.id, docSnap.data());
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      const docRef = doc(db, this.collection, id);

      // Get the current data first
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("User not found");
      }

      // Prepare update data
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp(),
      };

      // Remove fields that should not be updated
      delete updateData.id;
      delete updateData.createdAt;

      // Update the document
      await updateDoc(docRef, updateData);

      // Get the updated document
      const updatedDocSnap = await getDoc(docRef);
      if (!updatedDocSnap.exists()) {
        throw new Error("Failed to get updated user");
      }

      return this.mapUserData(id, updatedDocSnap.data());
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  private mapUserData(id: string, data: any): User {
    // Convert Firestore Timestamps to JavaScript Date objects
    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt);
    const updatedAt =
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt);

    return {
      id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber || null,
      role: data.role || "customer",
      createdAt,
      updatedAt,
    };
  }
}