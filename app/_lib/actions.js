'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getBookings, getGuest } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

export async function updateGuest(formData) {
    const session = await getServerSession(authOptions);
    const guest = await getGuest(session?.user.email)

    if (!session) throw new Error('You must be logged in')

    const nationalID = formData.get('nationalID')
    const [nationality, countryFlag] = formData.get('nationality').split('%');
    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
        throw new Error('Please provide a valid national ID')
    }
    const updateData = {
        nationality,
        countryFlag,
        nationalID
    }
    const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', guest.id)

    if (error) {
        throw new Error('Guest could not be updated');
    }
    revalidatePath('/account/profile')
}

export async function deleteReservation(reservationId) {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error('You must be logged in')
    const guest = await getGuest(session?.user.email)
    const guestbookings = await getBookings(guest.id)
    const guestbookingsIds = guestbookings.map((booking) => booking.id)

    if (!guestbookingsIds.includes(reservationId)) {
        throw new Error('You are not allowed to delete this booking')
    }

    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', reservationId)
    if (error) {
        throw new Error('Booking could not be deleted')
    }
    revalidatePath('/account/reservations')
}

