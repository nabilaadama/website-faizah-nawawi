import { Product } from "@/core/entities/product";

// export interface ProductFilters {
//   category?: string;
//   featured?: boolean;
//   searchQuery?: string;
// }

// export interface ProductRepository {
//   getAllProducts(filters?: ProductFilters): Promise<Product[]>;
//   getProductById(id: string): Promise<Product | null>;
//   getProductBySlug(slug: string): Promise<Product | null>;
//   createProduct(product: Omit<Product, "id">): Promise<Product>;
//   updateProduct(product: Product): Promise<Product>;
//   deleteProduct(id: string): Promise<void>;
// }

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
