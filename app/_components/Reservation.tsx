import React from 'react'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import { getBookedDatesByCabinId, getSettings } from '../_lib/data-service'
import { auth } from '../_lib/auth'

const Reservation = async ({ cabin }) => {
  const session = await auth()
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ])
  return (
    <div className='grid grid-cols-2 border border-primary-800 min-h-[400px]'>
      <DateSelector settings={settings} bookDates={bookedDates} cabin={cabin} />
      <ReservationForm cabin={cabin} user={session?.user} />
    </div>
  )
}

export default Reservation
