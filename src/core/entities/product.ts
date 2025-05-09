export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  createdAt?: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment?: string;
  status: "pending" | "approved";
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  stock: number;
  categoryId: string[];
  categoryName?: string[];
  images: ProductImage[];
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}