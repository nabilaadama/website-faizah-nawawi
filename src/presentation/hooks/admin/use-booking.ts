
import { useState, useEffect, useCallback } from "react";
import { BookingService } from "@/data/services/booking";
import { FirebaseBookingRepository } from "@/data/repositories/firebase-booking-repository";
import { Booking } from "@/core/entities/booking";

const bookingRepository = new FirebaseBookingRepository();
const bookingService = new BookingService(bookingRepository);

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(
    async (id: string, status: Booking["status"]) => {
      try {
        await bookingService.updateBookingStatus(id, status);
        await fetchBookings(); // Refresh data
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update booking status";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchBookings]
  );

  const updateBooking = useCallback(
    async (id: string, data: Partial<Booking>) => {
      try {
        await bookingService.updateBooking(id, data);
        await fetchBookings(); // Refresh data
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update booking";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchBookings]
  );

  const deleteBooking = useCallback(
    async (id: string) => {
      try {
        await bookingService.deleteBooking(id);
        await fetchBookings(); // Refresh data
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete booking";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [fetchBookings]
  );

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
    bookingService,
  };
};
