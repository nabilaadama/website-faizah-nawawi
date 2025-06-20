"use client";

import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { ProductTable } from "@/presentation/components/admin/product-table";
import { useProducts } from "@/presentation/hooks/admin/product/useProducts";
import { Product } from "@/core/entities/product";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, error, refetch } = useProducts();

  const handleAddProduct = () => {
    // Navigate to the new product page
    router.push("/admin/products/new");
  };

  const handleEditProduct = (product: Product) => {
    // Navigate to the edit product page with product ID
    router.push(`/admin/products/edit/${product.id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#5C4033",
          }}
        >
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onRefresh={refetch}
        />
      </Paper>
    </Container>
  );
}
