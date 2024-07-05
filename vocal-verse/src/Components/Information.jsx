import React, { useState } from 'react';
import Translation from './Translation';
import Clone from './Clone';
import Transcription from './Transcription';

export default function Information(props) {
  const { transcription } = props;
  const [tab, setTab] = useState('transcription');
  const [translation, setTranslation] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [toLanguage, setToLanguage] = useState('Select Language');

  async function generateTranslation() {
    setTranslating(true);
    try {
      const response = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcription, target_lang: toLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const result = await response.json();
      setTranslation(result.translated_text);
    } catch (error) {
      console.error('Error translating text:', error);
    } finally {
      setTranslating(false);
    }
  }

  return (
    <div className='bg-white w-1/2 rounded-4xl flex flex-1 flex-col items-center justify-center max-w-full mx-auto'>
      <div className="h-full flex flex-col justify-center items-center p-20 gap-4">
        <span className="text-3xl font-bold">
          Your <span className="text-pink-500">Transcription</span>
        </span>

        <div className='flex mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
          <button onClick={() => setTab('transcription')} className={'px-4 py-1 font-medium duration-200 ' + (tab === 'transcription' ? ' bg-pink-400 text-white' : 'text-pink-400 hover:text-pink-600')}>Transcribe</button>
          <button onClick={() => setTab('translation')} className={'px-4 py-1 font-medium duration-200 ' + (tab === 'translation' ? 'bg-pink-400 text-white' : ' text-pink-400 hover:text-pink-600')}>Translate</button>
          <button onClick={() => setTab('clone')} className={'px-4 py-1 font-medium duration-200 ' + (tab === 'clone' ? ' bg-pink-400 text-white' : 'text-pink-400 hover:text-pink-600')}>Voice Clone</button>
        </div>

        <div>
          {tab === 'transcription' ? <Transcription transcription={transcription} /> : tab === 'translation' ? <Translation toLanguage={toLanguage} translating={translating} translation={translation} setTranslation={setTranslation} setTranslating={setTranslating} setToLanguage={setToLanguage} generateTranslation={generateTranslation} /> : <Clone />}
        </div>
      </div>
    </div>
  );
}