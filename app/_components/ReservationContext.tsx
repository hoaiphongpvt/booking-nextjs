'use client'

import { createContext, useContext, useState } from 'react'

interface Range {
  from?: Date
  to?: Date
}

interface ReservationContextType {
  range: Range
  setRange: React.Dispatch<React.SetStateAction<Range>>
  resetRange: () => void
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
)

const initialState: Range = { from: undefined, to: undefined }

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>(initialState)
  const resetRange = () => setRange(initialState)
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  )
}

function useReservation() {
  const context = useContext(ReservationContext)

  if (!context) throw new Error('Context was used outside provider!')

  return context
}

export { ReservationProvider, useReservation }
