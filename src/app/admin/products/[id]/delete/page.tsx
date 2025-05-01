"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminProducts } from "@/presentation/hooks/admin/use-admin-products";
import { Product } from "@/core/entities/product";

export default function DeleteProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { getProduct, deleteProduct } = useAdminProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteProduct(params.id);
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      setIsDeleting(false);
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
      <h1 className="text-2xl font-bold mb-6">Delete Product</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this product?
        </h2>

        <div className="mb-6">
          <p className="text-lg font-medium">{product.name}</p>
          <p className="text-gray-600">{product.description}</p>
          <p className="mt-2">Category: {product.category}</p>
          <p>Base Price: ${product.basePrice.toFixed(2)}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
              ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
