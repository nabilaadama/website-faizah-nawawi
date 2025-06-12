import {
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/core/entities/bank-account";

export interface BankAccountRepository {
  getAll(): Promise<BankAccount[]>;
  getById(id: string): Promise<BankAccount | null>;
  create(data: CreateBankAccountRequest): Promise<BankAccount>;
  update(id: string, data: UpdateBankAccountRequest): Promise<BankAccount>;
  delete(id: string): Promise<void>;
  toggleActive(id: string): Promise<BankAccount>;
}
