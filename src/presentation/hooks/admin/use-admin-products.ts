import { useState, useEffect } from "react";
import { Product } from "@/core/entities/product";

interface UseAdminProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: {
    category?: string;
    featured?: boolean;
    searchQuery?: string;
  }) => Promise<void>;
  createProduct: (productData: any) => Promise<Product>;
  updateProduct: (id: string, productData: any) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Promise<Product>;
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: {
    category?: string;
    featured?: boolean;
    searchQuery?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      let url = "/api/admin/products";

      // Add query parameters if filters are provided
      if (filters) {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.featured !== undefined)
          params.append("featured", filters.featured.toString());
        if (filters.searchQuery) params.append("search", filters.searchQuery);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Convert string dates back to Date objects
      const formattedProducts = data.map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      }));

      setProducts(formattedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = async (id: string): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();

      // Convert string dates back to Date objects
      return {
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Failed to fetch product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: any): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();

      // Add to products list and return
      const newProduct = {
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      };

      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Failed to create product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    productData: any
  ): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();

      // Update in products list and return
      const updatedProduct = {
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );

      return updatedProduct;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Failed to update product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from products list
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Failed to delete product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on initial mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
