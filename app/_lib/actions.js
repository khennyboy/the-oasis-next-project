'use server'

import { getServerSession } from "next-auth";
import { getBookings, getGuest } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
    const session = await getServerSession();
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
    /* this is used to make sure the user is logged in and 
    and they are updating there own booking*/
    const session = await getServerSession();
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

export async function UpdateBooking(formData) {
    /* this is used to make sure the user is logged in and 
     and they are updating there own booking*/
    const session = await getServerSession();
    if (!session) throw new Error('You must be logged in')
    const guest = await getGuest(session?.user.email)
    const guestbookings = await getBookings(guest.id)
    const guestbookingsIds = guestbookings.map((booking) => booking.id)

    const bookingId = Number(formData.get('bookingId'))

    if (!guestbookingsIds.includes(bookingId)) {
        throw new Error('You are not allowed to delete this booking')
    }

    const updateData = {
        numGuests: Number(formData.get('numGuests')),
        observations: formData.get('observations'.slice(0, 1000))
    }

    const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single()
    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }
    revalidatePath(`account/reservations/edit/${bookingId}`)
    revalidatePath('/account/reservations')
    redirect('/account/reservations')
}

export async function createBooking(bookingData, formData) {
    const session = await getServerSession();
    if (!session) throw new Error('You must be logged in')
    const guest = await getGuest(session?.user.email)

    const newBooking = {
        ...bookingData,
        guestId: guest.id,
        numGuests: Number(formData.get('numGuests')),
        observations: formData.get('observations').slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: 'unconfirmed'
    }
    const { error } = await supabase
        .from('bookings')
        .insert([newBooking])
    if (error) throw new Error('Booking could not be created');
    revalidatePath(`/cabins/${bookingData.cabinId}`)
    redirect('/cabins/thankyou')
}