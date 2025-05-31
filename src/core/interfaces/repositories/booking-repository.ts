import { Booking } from "@/core/entities/booking";

export interface BookingRepository {
  getAllBookings(): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  updateBookingStatus(id: string, status: Booking['status']): Promise<void>;
  deleteBooking(id: string): Promise<void>;
  updateBooking(id: string, data: Partial<Booking>): Promise<void>;
}