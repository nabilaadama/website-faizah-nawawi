import {
  BankAccount,
  CreateBankAccountRequest,
} from "@/core/entities/bank-account";
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";

export class CreateBankAccount {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(data: CreateBankAccountRequest): Promise<BankAccount> {
    // Validasi input
    if (!data.bankName?.trim()) {
      throw new Error("Bank name is required");
    }

    if (!data.accountNumber?.trim()) {
      throw new Error("Account number is required");
    }

    if (!data.accountHolder?.trim()) {
      throw new Error("Account holder is required");
    }

    try {
      return await this.bankAccountRepository.create(data);
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw new Error("Failed to create bank account");
    }
  }
}
