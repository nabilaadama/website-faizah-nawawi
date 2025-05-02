import { BookingRepository } from "@/core/interfaces/repositories/booking-repository";

export const createBooking = async (
  repo: BookingRepository,
  data: {
    email: string;
    whatsapp: string;
    appointmentDate: string;
    message?: string;
  }
) => {
  return repo.createBooking(data);
};
