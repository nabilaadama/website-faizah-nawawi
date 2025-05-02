import { BookingRepository } from "@/core/interfaces/repositories/booking-repository";
import { Booking } from "@/core/entities/booking";
import { db } from "@/lib/firebase/firebase-config";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export const firebaseBookingRepository: BookingRepository = {
  async createBooking(data) {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, "bookings"), {
      ...data,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      ...data,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
  },

  async updateBookingStatus(id, status) {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  },

  async getAllBookings() {
    const snap = await getDocs(collection(db, "bookings"));
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];
  },
};
