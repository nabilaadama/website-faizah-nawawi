export interface PaymentDetails {
  method: "bank_transfer" | "other";
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  paymentProofUrl?: string;
  senderBank?: string;
  senderAccountNumber?: string;
  senderName?: string;
  paymentDate?: Date;
  verifiedBy?: string;
  verificationDate?: Date;
  verificationNotes?: string;
}
