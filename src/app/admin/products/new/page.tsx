"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminProducts } from "@/presentation/hooks/admin/use-admin-products";
import ProductForm from "@/presentation/components/admin/product-form";

export default function NewProductPage() {
  const router = useRouter();
  const { createProduct } = useAdminProducts();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createProduct(productData);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
