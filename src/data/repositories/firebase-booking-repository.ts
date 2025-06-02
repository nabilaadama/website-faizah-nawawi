import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy, 
  Timestamp
} from 'firebase/firestore';
import { db } from "@/lib/firebase/firebase-config";
import { BookingRepository } from "@/core/interfaces/repositories/booking-repository";
import { Booking } from "@/core/entities/booking";

export class FirebaseBookingRepository implements BookingRepository {
  private collectionName = "bookings";

  async getAllBookings(): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          appointmentDate: this.convertToDate(data.appointmentDate),
          createdAt: this.convertToDate(data.createdAt),
          updatedAt: this.convertToDate(data.updatedAt),
        };
      }) as Booking[];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw new Error("Failed to fetch bookings");
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          appointmentDate: this.convertToDate(data.appointmentDate),
          createdAt: this.convertToDate(data.createdAt),
          updatedAt: this.convertToDate(data.updatedAt),
        } as Booking;
      }

      return null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw new Error("Failed to fetch booking");
    }
  }

  async updateBookingStatus(
    id: string,
    status: Booking["status"]
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw new Error("Failed to update booking status");
    }
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Convert Date objects to Firestore Timestamps
      const updateData: any = { ...data };

      if (
        updateData.appointmentDate &&
        updateData.appointmentDate instanceof Date
      ) {
        updateData.appointmentDate = Timestamp.fromDate(
          updateData.appointmentDate
        );
      }

      updateData.updatedAt = Timestamp.fromDate(new Date());

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating booking:", error);
      throw new Error("Failed to update booking");
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw new Error("Failed to delete booking");
    }
  }

  /**
   * Helper method to safely convert various date formats to JavaScript Date
   * Handles Firestore Timestamp, Date objects, strings, and null/undefined
   */
  private convertToDate(dateValue: any): Date | null {
    if (!dateValue) {
      return null;
    }

    // If it's already a Date object
    if (dateValue instanceof Date) {
      return dateValue;
    }

    // If it's a Firestore Timestamp
    if (dateValue && typeof dateValue.toDate === "function") {
      return dateValue.toDate();
    }

    // If it's a string, try to parse it
    if (typeof dateValue === "string") {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // If it's a number (timestamp)
    if (typeof dateValue === "number") {
      return new Date(dateValue);
    }

    // If it has seconds property (Firestore Timestamp-like object)
    if (dateValue && typeof dateValue.seconds === "number") {
      return new Date(dateValue.seconds * 1000);
    }

    console.warn("Unknown date format:", dateValue);
    return null;
  }
}