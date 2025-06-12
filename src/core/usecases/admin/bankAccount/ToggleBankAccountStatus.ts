// src/core/usecases/bankAccount/ToggleBankAccountStatus.ts
import { BankAccount } from "@/core/entities/bank-account";
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";

export class ToggleBankAccountStatus {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(id: string): Promise<BankAccount> {
    if (!id) {
      throw new Error("Bank account ID is required");
    }

    try {
      // Cek apakah bank account exists
      const existingAccount = await this.bankAccountRepository.getById(id);
      if (!existingAccount) {
        throw new Error("Bank account not found");
      }

      return await this.bankAccountRepository.toggleActive(id);
    } catch (error) {
      console.error("Error toggling bank account status:", error);
      throw error;
    }
  }
}
