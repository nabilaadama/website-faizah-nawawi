export interface CartItem {
  id: any;
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  size: string;
  color: string;
  imageUrl: string;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}
