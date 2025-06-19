import { BankAccount } from "@/core/entities/bank-account";
import { BankAccountRepository } from "@/core/interfaces/repositories/bank-account-repository";;

export class GetAllBankAccounts {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(): Promise<BankAccount[]> {
    try {
      return await this.bankAccountRepository.getAll();
    } catch (error) {
      console.error("Error getting all bank accounts:", error);
      throw new Error("Failed to fetch bank accounts");
    }
  }
}
