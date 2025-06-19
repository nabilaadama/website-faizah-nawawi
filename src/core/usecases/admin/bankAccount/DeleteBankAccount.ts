// src/core/usecases/bankAccount/DeleteBankAccount.ts
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";
export class DeleteBankAccount {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("Bank account ID is required");
    }

    try {
      // Cek apakah bank account exists
      const existingAccount = await this.bankAccountRepository.getById(id);
      if (!existingAccount) {
        throw new Error("Bank account not found");
      }

      await this.bankAccountRepository.delete(id);
    } catch (error) {
      console.error("Error deleting bank account:", error);
      throw error;
    }
  }
}
