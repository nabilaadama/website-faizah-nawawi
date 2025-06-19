import { NextRequest, NextResponse } from "next/server";
import { FirebaseProductRepository } from "@/data/repositories/firebase-product-repository";
import { CreateProductUseCase } from "@/core/usecases/admin/product/create-product";
import { GetAllProductsUseCase } from "@/core/usecases/admin/product/get-all-products";

// Initialize repository and use cases
const productRepository = new FirebaseProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;
    const searchQuery = searchParams.get("search") || undefined;

    const products = await getAllProductsUseCase.execute({
      category,
      featured,
      searchQuery,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Validate product data here...

    const newProduct = await createProductUseCase.execute(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
