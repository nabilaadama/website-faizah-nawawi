"use server";

import { revalidatePath } from "next/cache";
import { ProductUseCases } from "@/core/usecases/admin/ProductUseCase";
import { FirebaseProductRepository } from "@/data/repositories/firebase-product-repository";
import { FirebaseCategoryRepository } from "@/data/repositories/firebase-category-repository";
import { CloudinaryImageRepository } from "@/lib/cloudinary/cloudinaryImageRepository";

const productRepository = new FirebaseProductRepository();
const categoryRepository = new FirebaseCategoryRepository();
const imageRepository = new CloudinaryImageRepository();
const productUseCases = new ProductUseCases(
  productRepository,
  categoryRepository,
  imageRepository
);

export async function getProducts() {
  try {
    return await productUseCases.getAllProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProduct(id: string) {
  try {
    return await productUseCases.getProductById(id);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const featured = formData.get("featured") === "true";
    const available = formData.get("available") === "true";

    const imageFiles: File[] = [];
    for (let i = 0; formData.get(`image_${i}`); i++) {
      const file = formData.get(`image_${i}`) as File;
      if (file.size > 0) {
        imageFiles.push(file);
      }
    }

    const productData = {
      name,
      slug,
      description,
      basePrice,
      stock,
      categoryId,
      featured,
      available,
      images: [],
    };

    const product = await productUseCases.createProduct(
      productData,
      imageFiles
    );

    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;
    const featured = formData.get("featured") === "true";
    const available = formData.get("available") === "true";

    const imageFiles: File[] = [];
    for (let i = 0; formData.get(`image_${i}`); i++) {
      const file = formData.get(`image_${i}`) as File;
      if (file.size > 0) {
        imageFiles.push(file);
      }
    }

    const productData = {
      name,
      slug,
      description,
      basePrice,
      stock,
      categoryId,
      featured,
      available,
    };

    const product = await productUseCases.updateProduct(
      id,
      productData,
      imageFiles.length > 0 ? imageFiles : undefined
    );

    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await productUseCases.deleteProduct(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
