import React from 'react'
import loader from '../assets/loader.gif'

export default function Transcribing() {
  return (
    <div className='bg-white w-1/2 rounded-4xl flex items-center justify-center max-w-full mx-auto'>
    <div className="h-full flex flex-col justify-center items-center p-20">

      <h1 className="text-4xl font-semibold text-pink-500"> Transcribing
      </h1>
      <br />
      <img src={loader} alt="Loading" width={100} />

  </div>
  </div>
  )
}
