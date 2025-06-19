"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";
import { BankAccount } from "@/core/entities/bank-account";
import { BankAccountForm } from "./bank-account-form";

interface BankAccountTableProps {
  data: BankAccount[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (data: any) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
}

export const BankAccountTable: React.FC<BankAccountTableProps> = ({
  data,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  onToggleStatus,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null
  );

  const columns = useMemo<MRT_ColumnDef<BankAccount>[]>(
    () => [
      {
        accessorKey: "bankName",
        header: "Bank Name",
        size: 200,
      },
      {
        accessorKey: "accountNumber",
        header: "Account Number",
        size: 250,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontFamily="monospace">
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: "accountHolder",
        header: "Account Holder",
        size: 250,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<boolean>() ? "Active" : "Inactive"}
            color={cell.getValue<boolean>() ? "success" : "default"}
            size="small"
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
    ],
    []
  );

  const handleCreate = () => {
    setFormMode("create");
    setSelectedAccount(null);
    setFormOpen(true);
  };

  const handleEdit = (account: BankAccount) => {
    setFormMode("edit");
    setSelectedAccount(account);
    setFormOpen(true);
  };

  const handleDeleteClick = (account: BankAccount) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (accountToDelete) {
      await onDelete(accountToDelete.id);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleToggleStatus = async (account: BankAccount) => {
    await onToggleStatus(account.id);
  };

  const handleFormSubmit = async (data: any) => {
    if (formMode === "create") {
      await onCreate(data);
    } else if (selectedAccount) {
      await onUpdate(selectedAccount.id, data);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    positionActionsColumn: "last",
    createDisplayMode: "modal",
    editDisplayMode: "row",
    enableEditing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "createdAt", desc: true }],
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "4px" }}>
        <Tooltip title="Toggle Status">
          <IconButton
            color="primary"
            onClick={() => handleToggleStatus(row.original)}
          >
            {row.original.isActive ? <ToggleOn /> : <ToggleOff />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={() => handleEdit(row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    // renderTopToolbarCustomActions: () => (
    //   <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
    //     <Button
    //       variant="contained"
    //       startIcon={<AddIcon />}
    //       onClick={handleCreate}
    //     >
    //       Add Bank Account
    //     </Button>
    //     <Button variant="outlined" onClick={onRefresh}>
    //       Refresh
    //     </Button>
    //   </Box>
    // ),
    // initialState: {
    //   pagination: {
    //     pageSize: 10,
    //     pageIndex: 0,
    //   },
    //   sorting: [
    //     {
    //       id: "createdAt",
    //       desc: true,
    //     },
    //   ],
    // },
  });

  return (
    <>
      <MaterialReactTable table={table} />

      <BankAccountForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedAccount}
        mode={formMode}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Bank Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bank account?
          </Typography>
          {accountToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Bank:</strong> {accountToDelete.bankName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Account Number:</strong> {accountToDelete.accountNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Account Holder:</strong> {accountToDelete.accountHolder}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
