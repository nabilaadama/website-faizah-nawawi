import { BankAccount } from "@/core/entities/bank-account";
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";

export class GetBankAccountById {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(id: string): Promise<BankAccount | null> {
    if (!id) {
      throw new Error("Bank account ID is required");
    }

    try {
      return await this.bankAccountRepository.getById(id);
    } catch (error) {
      console.error("Error getting bank account by ID:", error);
      throw new Error("Failed to fetch bank account");
    }
  }
}
