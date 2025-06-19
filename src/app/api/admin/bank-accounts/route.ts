// src/app/api/admin/bank-accounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FirebaseBankAccountRepository } from "@/data/repositories/firebase-bank-account-repository";
import { GetAllBankAccounts } from "@/core/usecases/admin/bankAccount/GetAllBankAccounts";
import { CreateBankAccount } from "@/core/usecases/admin/bankAccount/CreateBankAccount";

const bankAccountRepository = new FirebaseBankAccountRepository();

export async function GET() {
  try {
    const getAllBankAccounts = new GetAllBankAccounts(bankAccountRepository);
    const bankAccounts = await getAllBankAccounts.execute();

    return NextResponse.json({
      success: true,
      data: bankAccounts,
    });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bank accounts",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bankName, accountNumber, accountHolder } = body;

    if (!bankName || !accountNumber || !accountHolder) {
      return NextResponse.json(
        {
          success: false,
          error: "Bank name, account number, and account holder are required",
        },
        { status: 400 }
      );
    }

    const createBankAccount = new CreateBankAccount(bankAccountRepository);
    const newBankAccount = await createBankAccount.execute({
      bankName,
      accountNumber,
      accountHolder,
    });

    return NextResponse.json({
      success: true,
      data: newBankAccount,
    });
  } catch (error) {
    console.error("Error creating bank account:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create bank account",
      },
      { status: 500 }
    );
  }
}
