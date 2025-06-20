"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { User } from "@/core/entities/user";
import { UserUseCases } from "@/core/usecases/users/userUseCase";
import { FirebaseUserRepository } from "@/data/repositories/firebase-user-repository";

const userRepository = new FirebaseUserRepository();
const userUseCases = new UserUseCases(userRepository);

interface UserFormData {
  name: string;
  email: string;
  phoneNumber: string;
  role: "customer" | "admin";
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    role: "customer",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await userUseCases.getUsers();
      setUsers(usersData);
    } catch (error) {
      showSnackbar("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Dialog handlers
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        role: "customer",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      role: "customer",
    });
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await userUseCases.updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber || null,
          role: formData.role,
        });
        showSnackbar("User updated successfully", "success");
      } else {
        await userUseCases.createUser({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber || null,
          role: formData.role,
        });
        showSnackbar("User created successfully", "success");
      }

      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to save user", "error");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userUseCases.deleteUser(userId);
        showSnackbar("User deleted successfully", "success");
        fetchUsers();
      } catch (error) {
        showSnackbar("Failed to delete user", "error");
      }
    }
  };

  // Table columns
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 100,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>()}
            color={cell.getValue<string>() === "admin" ? "primary" : "default"}
            size="small"
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ cell }) =>
          new Date(cell.getValue<Date>()).toLocaleDateString("id-ID"),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableEditing: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "8px" }}>
        <IconButton
          onClick={() => handleOpenDialog(row.original)}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(row.original.id)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
    state: {
      isLoading: loading,
    },
    muiTableProps: {
      sx: {
        "& .MuiTableHead-root": {
          "& .MuiTableCell-root": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
        },
      },
    },
  });

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
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Add User
        </Button>
      </Box>

      <MaterialReactTable table={table} />

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                label="Role"
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.email}
          >
            {editingUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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
};

export default UserManagementPage;