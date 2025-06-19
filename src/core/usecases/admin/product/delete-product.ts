import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    return this.productRepository.deleteProduct(productId);
  }
}
