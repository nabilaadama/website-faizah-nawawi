import { Product } from "@/core/entities/product";
import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

export interface CreateProductData {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  featured: boolean;
  images: Array<{
    url: string;
    alt: string;
  }>;
  variants: Array<{
    size: string;
    color: string;
    price: number;
    stock: number;
  }>;
}

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productData: CreateProductData): Promise<Product> {
    // Generate slug from product name
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Prepare product entity
    const newProduct: Omit<Product, "id"> = {
      slug,
      name: productData.name,
      description: productData.description,
      basePrice: productData.basePrice,
      category: productData.category,
      featured: productData.featured,
      images: productData.images.map((img, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: img.url,
        alt: img.alt,
      })),
      variants: productData.variants.map((variant, index) => ({
        id: `variant-${Date.now()}-${index}`,
        size: variant.size,
        color: variant.color,
        price: variant.price,
        stock: variant.stock,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.productRepository.createProduct(newProduct);
  }
}
