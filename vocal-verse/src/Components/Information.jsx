import React, {useState} from 'react'
import Translation from './Translation'
import Clone from './Clone'
import Transcription from './Transcription'

export default function Information() {
    const [tab, setTab] = useState('transcription')
  return (
    <div className='bg-white w-1/2 rounded-4xl flex flex-1 flex-col items-center justify-center max-w-full mx-auto'>
    <div className="h-full flex flex-col justify-center items-center p-20 gap-4">
      <span className="text-3xl font-bold">
        Your <span className="text-pink-500">Transcription</span>
      </span>

      <div className='flex mx-auto bg-white  shadow rounded-full overflow-hidden tems-center'>
        <button onClick={() => setTab('transcription')}  className={'px-4 py-1 font-medium duration-200 ' + (tab === 'transcription' ?  ' bg-pink-400 text-white' : 'text-pink-400 hover:text-pink-600')}>Transcribe</button>
        <button onClick={() => setTab('translation')} className={'px-4 py-1 font-medium duration-200 ' + (tab === 'translation' ? 'bg-pink-400 text-white' : ' text-pink-400 hover:text-pink-600')}>Translate</button>
        <button onClick={() => setTab('clone')} className={'px-4 py-1 font-medium duration-200 ' + (tab === 'clone' ? ' bg-pink-400 text-white' : 'text-pink-400 hover:text-pink-600')}>Voice Clone</button>
      </div>

      <div>
        {tab === 'transcription' ? <Transcription /> : tab === 'translation' ? <Translation /> : <Clone />}
      </div>
      </div>

      </div>
  )
}
