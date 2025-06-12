export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBankAccountRequest {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface UpdateBankAccountRequest {
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  isActive?: boolean;
}