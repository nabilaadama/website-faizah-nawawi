import { Product } from "@/core/entities/product";

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  searchQuery?: string;
}

export interface ProductRepository {
  getAllProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  createProduct(product: Omit<Product, "id">): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
