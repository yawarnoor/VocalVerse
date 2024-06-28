import React from 'react'

export default function FileDisplay(props) {
    const {file, audioStream, handleAudioReset} = props
  return (
    <div className='bg-white w-1/2 rounded-4xl flex items-center justify-center max-w-full mx-auto'>
      <div className="h-full flex flex-col justify-center items-center p-20">
        <span className="text-3xl font-bold">
          Your <span className="text-pink-500">File</span>
        </span>
        <br />
        <div className='mx-auto flex flex-col text-left my-4'>
            <h3 className=' font-semibold'>Name</ h3>
            <p>{file ? file?.name : "Recorded Audio"}</p>
        </div>

    <div className='flex items-center justify-between gap-4'> 
    <button className=' text-swatch-3' onClick={handleAudioReset}>Reset</ button>  
    <button className='specialBtn px-4 py-2 rounded-lg text-pink-500 '>
Transcribe
</button>
    </div>
    </div>
    </div>
  )
}
