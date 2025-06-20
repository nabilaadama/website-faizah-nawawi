"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { BankAccountTable } from "@/presentation/components/admin/bank-account-table";
import { BankAccountForm } from "@/presentation/components/admin/bank-account-form";
import {
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/core/entities/bank-account";
import { Add } from "@mui/icons-material";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchBankAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/bank-accounts");
      const result: ApiResponse<BankAccount[]> = await response.json();

      if (result.success && result.data) {
        const bankAccountsWithDates = result.data.map((account) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        }));
        setBankAccounts(bankAccountsWithDates);
      } else {
        throw new Error(result.error || "Failed to fetch bank accounts");
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      showSnackbar("Failed to fetch bank accounts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateSubmit = async (data: CreateBankAccountRequest) => {
    try {
      const response = await fetch("/api/admin/bank-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<BankAccount> = await response.json();

      if (result.success && result.data) {
        const newAccount = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
        };
        setBankAccounts((prev) => [newAccount, ...prev]);
        showSnackbar("Bank account created successfully");
        setCreateDialogOpen(false); // Tutup dialog setelah berhasil
      } else {
        throw new Error(result.error || "Failed to create bank account");
      }
    } catch (error) {
      console.error("Error creating bank account:", error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to create bank account",
        "error"
      );
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateBankAccountRequest) => {
    try {
      const response = await fetch(`/api/admin/bank-accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<BankAccount> = await response.json();

      if (result.success && result.data) {
        const updatedAccount = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
        };
        setBankAccounts((prev) =>
          prev.map((account) => (account.id === id ? updatedAccount : account))
        );
        showSnackbar("Bank account updated successfully");
      } else {
        throw new Error(result.error || "Failed to update bank account");
      }
    } catch (error) {
      console.error("Error updating bank account:", error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to update bank account",
        "error"
      );
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/bank-accounts/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<void> = await response.json();

      if (result.success) {
        setBankAccounts((prev) => prev.filter((account) => account.id !== id));
        showSnackbar("Bank account deleted successfully");
      } else {
        throw new Error(result.error || "Failed to delete bank account");
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to delete bank account",
        "error"
      );
      throw error;
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/bank-accounts/${id}/toggle`, {
        method: "PATCH",
      });

      const result: ApiResponse<BankAccount> = await response.json();

      if (result.success && result.data) {
        const updatedAccount = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
        };
        setBankAccounts((prev) =>
          prev.map((account) => (account.id === id ? updatedAccount : account))
        );
        showSnackbar(
          result.message || "Bank account status updated successfully"
        );
      } else {
        throw new Error(result.error || "Failed to toggle bank account status");
      }
    } catch (error) {
      console.error("Error toggling bank account status:", error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "Failed to toggle bank account status",
        "error"
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  return (
    <Box sx={{ padding: "24px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#5C4033",
          }}
        >
          Bank Account Management
        </Typography>
        {/* <Typography variant="body1" color="text.secondary">
          Manage bank accounts for payment processing
        </Typography> */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Add Bank Account
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <BankAccountTable
          data={bankAccounts}
          loading={loading}
          onRefresh={fetchBankAccounts}
          onCreate={handleCreateSubmit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </Paper>

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Bank Account</DialogTitle>
        <DialogContent>
          <BankAccountForm
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            onSubmit={async (data, mode) => {
              if (mode === "create") {
                await handleCreateSubmit(data as CreateBankAccountRequest);
              }
            }}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
