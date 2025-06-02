import { BookingRepository } from "@/core/interfaces/repositories/booking-repository";
import { Booking } from "@/core/entities/booking";

export class BookingService {
  constructor(private bookingRepository: BookingRepository) {}

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.getAllBookings();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    if (!id) {
      throw new Error("Booking ID is required");
    }
    return await this.bookingRepository.getBookingById(id);
  }

  async updateBookingStatus(
    id: string,
    status: Booking["status"]
  ): Promise<void> {
    if (!id) {
      throw new Error("Booking ID is required");
    }

    const validStatuses: Booking["status"][] = [
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid booking status");
    }

    await this.bookingRepository.updateBookingStatus(id, status);
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<void> {
    if (!id) {
      throw new Error("Booking ID is required");
    }

    // Validate required fields if updating
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error("Name is required");
    }

    if (data.email !== undefined && !this.isValidEmail(data.email)) {
      throw new Error("Valid email is required");
    }

    await this.bookingRepository.updateBooking(id, data);
  }

  async deleteBooking(id: string): Promise<void> {
    if (!id) {
      throw new Error("Booking ID is required");
    }
    await this.bookingRepository.deleteBooking(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getStatusColor(status: Booking["status"]): string {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "confirmed":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  }

  getStatusLabel(status: Booking["status"]): string {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "confirmed":
        return "Dikonfirmasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  }
}
