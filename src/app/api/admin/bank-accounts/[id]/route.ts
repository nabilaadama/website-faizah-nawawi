// src/app/api/admin/bank-accounts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FirebaseBankAccountRepository } from "@/data/repositories/firebase-bank-account-repository";
import { GetBankAccountById } from "@/core/usecases/admin/bankAccount/GetBankAccountById";
import { UpdateBankAccount } from "@/core/usecases/admin/bankAccount/UpdateBankAccount";
import { DeleteBankAccount } from "@/core/usecases/admin/bankAccount/DeleteBankAccount";

const bankAccountRepository = new FirebaseBankAccountRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const getBankAccountById = new GetBankAccountById(bankAccountRepository);
    const bankAccount = await getBankAccountById.execute(params.id);

    if (!bankAccount) {
      return NextResponse.json(
        {
          success: false,
          error: "Bank account not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bankAccount,
    });
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bank account",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { bankName, accountNumber, accountHolder, isActive } = body;

    const updateBankAccount = new UpdateBankAccount(bankAccountRepository);
    const updatedBankAccount = await updateBankAccount.execute(params.id, {
      bankName,
      accountNumber,
      accountHolder,
      isActive,
    });

    return NextResponse.json({
      success: true,
      data: updatedBankAccount,
    });
  } catch (error) {
    console.error("Error updating bank account:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update bank account",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleteBankAccount = new DeleteBankAccount(bankAccountRepository);
    await deleteBankAccount.execute(params.id);

    return NextResponse.json({
      success: true,
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete bank account",
      },
      { status: 500 }
    );
  }
}
