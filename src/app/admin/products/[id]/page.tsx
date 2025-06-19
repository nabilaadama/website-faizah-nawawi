"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminProducts } from "@/presentation/hooks/admin/use-admin-products";
import ProductForm from "@/presentation/components/admin/product-form";
import { Product } from "@/core/entities/product";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getProduct, updateProduct } = useAdminProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(params.id);
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, getProduct]);

  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateProduct(params.id, productData);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.name}</h1>

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={product}
      />
    </div>
  );
}
