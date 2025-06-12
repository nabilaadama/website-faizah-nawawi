// src/app/api/admin/bank-accounts/[id]/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FirebaseBankAccountRepository } from "@/data/repositories/firebase-bank-account-repository";
import { ToggleBankAccountStatus } from "@/core/usecases/admin/bankAccount/ToggleBankAccountStatus";

const bankAccountRepository = new FirebaseBankAccountRepository();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const toggleBankAccountStatus = new ToggleBankAccountStatus(
      bankAccountRepository
    );
    const updatedBankAccount = await toggleBankAccountStatus.execute(params.id);

    return NextResponse.json({
      success: true,
      data: updatedBankAccount,
      message: `Bank account ${
        updatedBankAccount.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    console.error("Error toggling bank account status:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to toggle bank account status",
      },
      { status: 500 }
    );
  }
}
