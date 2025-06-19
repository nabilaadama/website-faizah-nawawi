"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/core/entities/bank-account";

interface BankAccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateBankAccountRequest | UpdateBankAccountRequest
  ) => Promise<void>;
  initialData?: BankAccount | null;
  mode: "create" | "edit";
}

export const BankAccountForm: React.FC<BankAccountFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        bankName: initialData.bankName,
        accountNumber: initialData.accountNumber,
        accountHolder: initialData.accountHolder,
        isActive: initialData.isActive,
      });
    } else {
      setFormData({
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        isActive: true,
      });
    }
    setError(null);
  }, [mode, initialData, open]);

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        await onSubmit({
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountHolder: formData.accountHolder,
        });
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.bankName.trim() &&
    formData.accountNumber.trim() &&
    formData.accountHolder.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === "create" ? "Add New Bank Account" : "Edit Bank Account"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Bank Name"
              value={formData.bankName}
              onChange={handleChange("bankName")}
              fullWidth
              required
              disabled={loading}
              placeholder="e.g., Bank Central Asia"
            />

            <TextField
              label="Account Number"
              value={formData.accountNumber}
              onChange={handleChange("accountNumber")}
              fullWidth
              required
              disabled={loading}
              placeholder="e.g., 1234567890"
            />

            <TextField
              label="Account Holder"
              value={formData.accountHolder}
              onChange={handleChange("accountHolder")}
              fullWidth
              required
              disabled={loading}
              placeholder="e.g., PT. Example Company"
            />

            {mode === "edit" && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange("isActive")}
                    disabled={loading}
                  />
                }
                label="Active"
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : mode === "create" ? (
              "Create"
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
