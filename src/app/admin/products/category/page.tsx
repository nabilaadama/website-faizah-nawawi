"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase-config";
import slugify from "@/lib/utils/slugify";
import { Category } from "@/core/entities/product";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

export default function CategoryManagementPage() {
  // State for categories list
  const [categories, setCategories] = useState<Category[]>([]);

  // Form states
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Define columns for MRT
  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        size: 150,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) => {
          const date = cell.getValue<Date>();
          return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        },
        size: 150,
      },
    ],
    []
  );

  // Function to fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const q = query(collection(db, "categories"), orderBy("name"));
      const querySnapshot = await getDocs(q);

      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        slug: doc.data().slug,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Category[];

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category name input change
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate name
      if (!categoryName.trim()) {
        throw new Error("Nama kategori wajib diisi");
      }

      // Create slug from name
      const slug = slugify(categoryName);

      // Check if slug already exists (for different category)
      const existingCategory = categories.find(
        (cat) => cat.slug === slug && cat.id !== currentCategoryId
      );

      if (existingCategory) {
        throw new Error("Category with the same name already exists");
      }

      const timestamp = new Date();

      if (formMode === "add") {
        // Add new category
        const categoryData = {
          name: categoryName.trim(),
          slug,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await addDoc(collection(db, "categories"), categoryData);
        setSuccess("Category successfully added!");
      } else {
        // Update existing category
        if (!currentCategoryId) {
          throw new Error("Category Id not valid");
        }

        const categoryRef = doc(db, "categories", currentCategoryId);
        await updateDoc(categoryRef, {
          name: categoryName.trim(),
          slug,
          updatedAt: timestamp,
        });

        setSuccess("Category successfully updated!");
      }

      // Reset form and refresh categories
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      setError(error.message || "Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category edit
  const handleEdit = (category: Category) => {
    setFormMode("edit");
    setCurrentCategoryId(category.id);
    setCategoryName(category.name);
    setFormOpen(true);
  };

  // Handle category delete
  const handleDelete = async (categoryId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      return;
    }

    setError(null);

    try {
      await deleteDoc(doc(db, "categories", categoryId));
      setSuccess("Kategori berhasil dihapus!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Gagal menghapus kategori");
    }
  };

  // Reset form to add mode
  const resetForm = () => {
    setFormMode("add");
    setCurrentCategoryId(null);
    setCategoryName("");
    setFormOpen(false);
  };

  return (
    <Box >
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
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setFormMode("add");
            setFormOpen(true);
          }}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Add Category
        </Button>
      </Box>
      {/* Success/Error Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Category Form Dialog */}
      <Dialog open={formOpen} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formMode === "add" ? "Add New Categroy" : "Edit Category"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={handleNameChange}
                required
                sx={{ mb: 2 }}
              />
            </Box>
            <DialogActions>
              <Button onClick={resetForm}>Batal</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {formMode === "add" ? "Add" : "update"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <MaterialReactTable
        columns={columns}
        data={categories}
        state={{ isLoading }}
        enableRowActions
        positionActionsColumn="last"
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          sorting: [{ id: "createdAt", desc: true }],
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row.original)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        muiTablePaperProps={{
          sx: {
            p: 2,
          },
        }}
      />
    </Box>
  );
}