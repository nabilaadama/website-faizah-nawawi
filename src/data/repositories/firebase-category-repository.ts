// data/firebase/FirebaseCategoryRepository.ts
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import { Category } from "@/core/entities/product";
import { CategoryRepository } from "@/core/interfaces/repositories/category-repository";

export class FirebaseCategoryRepository implements CategoryRepository {
  private collectionName = "categories";

  async getAll(): Promise<Category[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  }

  async getById(id: string): Promise<Category | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Category;
    }

    return null;
  }
}
