import {
  BankAccount,
  UpdateBankAccountRequest,
} from "@/core/entities/bank-account";;
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";

export class UpdateBankAccount {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(
    id: string,
    data: UpdateBankAccountRequest
  ): Promise<BankAccount> {
    if (!id) {
      throw new Error("Bank account ID is required");
    }

    // Validasi input jika ada
    if (data.bankName !== undefined && !data.bankName.trim()) {
      throw new Error("Bank name cannot be empty");
    }

    if (data.accountNumber !== undefined && !data.accountNumber.trim()) {
      throw new Error("Account number cannot be empty");
    }

    if (data.accountHolder !== undefined && !data.accountHolder.trim()) {
      throw new Error("Account holder cannot be empty");
    }

    try {
      // Cek apakah bank account exists
      const existingAccount = await this.bankAccountRepository.getById(id);
      if (!existingAccount) {
        throw new Error("Bank account not found");
      }

      return await this.bankAccountRepository.update(id, data);
    } catch (error) {
      console.error("Error updating bank account:", error);
      throw error;
    }
  }
}
