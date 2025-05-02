export interface Booking {
  id: string;
  email: string;
  whatsapp: string;
  appointmentDate: string; // ISO string
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
