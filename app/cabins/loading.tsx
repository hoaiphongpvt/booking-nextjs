import React from 'react'
import SpinnerMini from '@/app/_components/SpinnerMini'

const Loading = () => {
  return (
    <div className='grid justify-center items-center'>
      <SpinnerMini />
      <p className='text-xl text-primary-200'>Loading cabins data...</p>
    </div>
  )
}

export default Loading
