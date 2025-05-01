import { Product } from "@/core/entities/product";
import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

export interface ProductFilters {
  category?: string;
  featured?: boolean;
  searchQuery?: string;
}

export class GetAllProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(filters?: ProductFilters): Promise<Product[]> {
    return this.productRepository.getAllProducts(filters);
  }
}
