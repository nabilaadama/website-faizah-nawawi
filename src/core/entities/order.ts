import { Address } from "./address";
import { PaymentDetails} from "./payment-details";

export interface OrderItem {
  id?: string; 
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  shippingAddress: Address; 
  subtotal: number;
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  items: OrderItem[];
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}