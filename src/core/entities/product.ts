export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  images: ProductImage[];
  category: string;
  variants: ProductVariant[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}