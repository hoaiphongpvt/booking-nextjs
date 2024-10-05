'use server'
import { redirect } from 'next/navigation'
import { auth, signIn, signOut } from './auth'
import { getBookings } from './data-service'
import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

export async function updateGuest(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in!')
  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = formData.get('nationality').split('%')

  if (!/^\d{12}$/.test(nationalID)) {
    throw new Error('Please provide a valid national ID!')
  }

  const updateData = { nationalID, nationality, countryFlag }
  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error) {
    throw new Error('Guest could not be updated')
  }

  revalidatePath('/account/profile')
}

export async function deleteReservation(bookingId: number) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in!')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking!')
  const { error } = await supabase.from('bookings').delete().eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be deleted')
  }

  revalidatePath('/account/reservations')
}

export async function updateReservation(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('You are not allow to update this booking!')

  const updateData = {
    numGuests: Number(formData.get('numGuests')),
    observationd: formData.get('observations'),
  }

  const bookingId = Number(formData.get('id'))
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`)

  redirect('/account/reservations')
}

export async function createBooking(bookingData, formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('You are not allow to create this booking!')
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observationd: formData.get('observations'),
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  }

  const { error } = await supabase.from('bookings').insert([newBooking])

  if (error) {
    console.log(error)
    throw new Error('Booking could not be created')
  }

  revalidatePath(`/cabin/${bookingData.cabinId}`)

  redirect('/cabins/thankyou')
}
