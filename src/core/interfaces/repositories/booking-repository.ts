import { Booking } from "@/core/entities/booking";

export interface BookingRepository {
  createBooking(
    data: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<Booking>;
  updateBookingStatus(id: string, status: Booking["status"]): Promise<void>;
  getAllBookings(): Promise<Booking[]>; // Untuk admin
}
