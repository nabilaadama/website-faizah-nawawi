import { Product } from "@/core/entities/product";
import { ProductRepository } from "@/core/interfaces/repositories/product-repository";

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string;
  basePrice?: number;
  category?: string;
  featured?: boolean;
  images?: Array<{
    id?: string;
    url: string;
    alt: string;
  }>;
  variants?: Array<{
    id?: string;
    size: string;
    color: string;
    price: number;
    stock: number;
  }>;
}

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productData: UpdateProductData): Promise<Product> {
    // First get the existing product
    const existingProduct = await this.productRepository.getProductById(
      productData.id
    );

    if (!existingProduct) {
      throw new Error(`Product with ID ${productData.id} not found`);
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug;
    if (productData.name && productData.name !== existingProduct.name) {
      slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Prepare updated product
    const updatedProduct: Product = {
      ...existingProduct,
      slug,
      name: productData.name || existingProduct.name,
      description: productData.description || existingProduct.description,
      basePrice: productData.basePrice ?? existingProduct.basePrice,
      category: productData.category || existingProduct.category,
      featured: productData.featured ?? existingProduct.featured,
      images: productData.images
        ? productData.images.map((img, index) => ({
            id: img.id || `img-${Date.now()}-${index}`,
            url: img.url,
            alt: img.alt,
          }))
        : existingProduct.images,
      variants: productData.variants
        ? productData.variants.map((variant, index) => ({
            id: variant.id || `variant-${Date.now()}-${index}`,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
          }))
        : existingProduct.variants,
      updatedAt: new Date(),
    };

    return this.productRepository.updateProduct(updatedProduct);
  }
}
