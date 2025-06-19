import { NextResponse } from "next/server";
import { createBooking } from "@/core/usecases/booking/create-booking";
import { firebaseBookingRepository } from "@/data/repositories/firebase-booking-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, whatsapp, appointmentDate, message } = body;

    if (!email || !whatsapp || !appointmentDate) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const booking = await createBooking(firebaseBookingRepository, {
      email,
      whatsapp,
      appointmentDate,
      message,
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
