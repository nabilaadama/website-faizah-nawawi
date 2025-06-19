import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import {
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/core/entities/bank-account";
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";

export class FirebaseBankAccountRepository implements BankAccountRepository {
  private collectionName = "bank-accounts";

  async getAll(): Promise<BankAccount[]> {
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
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountHolder: data.accountHolder,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BankAccount;
      });
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<BankAccount | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as BankAccount;
    } catch (error) {
      console.error("Error fetching bank account by ID:", error);
      throw error;
    }
  }

  async create(data: CreateBankAccountRequest): Promise<BankAccount> {
    try {
      const docData = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
        isActive: true, // Default aktif
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), docData);

      // Fetch the created document to return complete data
      const createdDoc = await getDoc(docRef);
      const createdData = createdDoc.data();

      return {
        id: docRef.id,
        bankName: createdData!.bankName,
        accountNumber: createdData!.accountNumber,
        accountHolder: createdData!.accountHolder,
        isActive: createdData!.isActive,
        createdAt: createdData!.createdAt?.toDate() || new Date(),
        updatedAt: createdData!.updatedAt?.toDate() || new Date(),
      } as BankAccount;
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw error;
    }
  }

  async update(
    id: string,
    data: UpdateBankAccountRequest
  ): Promise<BankAccount> {
    try {
      const docRef = doc(db, this.collectionName, id);

      const updateData: any = {
        updatedAt: serverTimestamp(),
      };

      if (data.bankName !== undefined) updateData.bankName = data.bankName;
      if (data.accountNumber !== undefined)
        updateData.accountNumber = data.accountNumber;
      if (data.accountHolder !== undefined)
        updateData.accountHolder = data.accountHolder;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      await updateDoc(docRef, updateData);

      // Fetch updated document
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id: updatedDoc.id,
        bankName: updatedData!.bankName,
        accountNumber: updatedData!.accountNumber,
        accountHolder: updatedData!.accountHolder,
        isActive: updatedData!.isActive,
        createdAt: updatedData!.createdAt?.toDate() || new Date(),
        updatedAt: updatedData!.updatedAt?.toDate() || new Date(),
      } as BankAccount;
    } catch (error) {
      console.error("Error updating bank account:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting bank account:", error);
      throw error;
    }
  }

  async toggleActive(id: string): Promise<BankAccount> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Bank account not found");
      }

      const currentData = docSnap.data();
      const newActiveStatus = !currentData.isActive;

      await updateDoc(docRef, {
        isActive: newActiveStatus,
        updatedAt: serverTimestamp(),
      });

      // Fetch updated document
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      return {
        id: updatedDoc.id,
        bankName: updatedData!.bankName,
        accountNumber: updatedData!.accountNumber,
        accountHolder: updatedData!.accountHolder,
        isActive: updatedData!.isActive,
        createdAt: updatedData!.createdAt?.toDate() || new Date(),
        updatedAt: updatedData!.updatedAt?.toDate() || new Date(),
      } as BankAccount;
    } catch (error) {
      console.error("Error toggling bank account status:", error);
      throw error;
    }
  }
}
