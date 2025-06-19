"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminProducts } from "@/presentation/hooks/admin/use-admin-products";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const { products, isLoading, error, fetchProducts, deleteProduct } =
    useAdminProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts({ searchQuery, category });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Product
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="accessories">Accessories</option>
          </select>
          <button type="submit" className="bg-gray-200 px-4 py-2 rounded">
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-6">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-6">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Image</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Base Price</th>
                <th className="py-2 px-4 border-b text-left">Featured</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-2 px-4 border-b">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b">{product.category}</td>
                    <td className="py-2 px-4 border-b">
                      ${product.basePrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {product.featured ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
