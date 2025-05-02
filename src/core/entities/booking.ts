export interface Booking {
  id: string;
  email: string;
  whatsapp: string;
  appointmentDate: string; // ISO 8601 format: "2025-05-02T15:00:00Z"
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
