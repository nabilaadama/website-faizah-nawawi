// import { CartItem } from "./cart";
// // import { Address } from "./user";

import { Address } from "./address";
import { PaymentDetails} from "./payment-details";


// export type OrderStatus =
//   | "pending_payment"
//   | "payment_confirmed"
//   | "processing"
//   | "shipped"
//   | "delivered"
//   | "cancelled";

// export interface OrderItem extends CartItem {
//   priceAtPurchase: number;
// }

// export interface Order {
//   id: string;
//   userId: string;
//   items: OrderItem[];
//   shippingAddress: {
//     name: string;
//     phoneNumber: string;
//     address: string;
//     city: string;
//     province: string;
//     postalCode: string;
//     notes?: string;
//   };
//   paymentMethod: string;
//   totalItems: number;
//   totalAmount: number;
//   status: OrderStatus;
//   paymentId: string;
//   paymentStatus: "pending" | "confirmed" | "expired";
//   bankAccount: string;
//   createdAt: Date;
//   paymentDeadline: Date;
//   updatedAt: Date;
// }

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
  shippingFee: number;
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