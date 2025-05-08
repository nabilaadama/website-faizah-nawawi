import { User } from "./user";

export interface Booking {
  id: string;
  userId?: string;
  name: string;
  email: string;
  whatsapp: string;
  appointmentDate: Date;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
