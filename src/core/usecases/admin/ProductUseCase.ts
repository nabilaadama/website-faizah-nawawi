import { Product } from "@/core/entities/product";
import { ProductRepository } from "@/core/interfaces/repositories/product-repository"
import { CategoryRepository } from "@/core/interfaces/repositories/category-repository";
import { ImageRepository } from "@/core/interfaces/repositories/image-repository";

export class ProductUseCases {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    private imageRepository: ImageRepository
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.getAll();

    // Enrich products with category names
    const categories = await this.categoryRepository.getAll();
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    return products.map((product) => ({
      ...product,
      categoryName: categoryMap.get(product.categoryId),
    }));
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.productRepository.getById(id);
    if (!product) return null;

    const category = await this.categoryRepository.getById(product.categoryId);
    return {
      ...product,
      categoryName: category?.name,
    };
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    imageFiles: File[]
  ): Promise<Product> {
    // Upload images
    const imagePromises = imageFiles.map(async (file, index) => {
      const url = await this.imageRepository.upload(file, "products");
      return {
        url,
        alt: `${productData.name} - Image ${index + 1}`,
        isPrimary: index === 0,
      };
    });

    const images = await Promise.all(imagePromises);

    return this.productRepository.create({
      ...productData,
      images,
    });
  }

  async updateProduct(
    id: string,
    productData: Partial<Product>,
    newImageFiles?: File[]
  ): Promise<Product> {
    let images = productData.images;

    if (newImageFiles && newImageFiles.length > 0) {
      // Upload new images
      const imagePromises = newImageFiles.map(async (file, index) => {
        const url = await this.imageRepository.upload(file, "products");
        return {
          url,
          alt: `${productData.name} - Image ${index + 1}`,
          isPrimary: index === 0,
        };
      });

      images = await Promise.all(imagePromises);
    }

    return this.productRepository.update(id, {
      ...productData,
      images,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.getById(id);
    if (product) {
      // Delete associated images from Cloudinary
      for (const image of product.images) {
        try {
          const publicId = this.extractPublicIdFromUrl(image.url);
          await this.imageRepository.delete(publicId);
        } catch (error) {
          console.error("Failed to delete image:", error);
        }
      }
    }

    await this.productRepository.delete(id);
  }

  private extractPublicIdFromUrl(url: string): string {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  }
}
