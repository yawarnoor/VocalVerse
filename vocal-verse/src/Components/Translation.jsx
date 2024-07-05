import React from 'react';
import { LANGUAGES } from '../utils/Languages';

export default function Translation(props) {
  const { translation, translating, setTranslation, setTranslating, toLanguage, setToLanguage, generateTranslation } = props;

  return (
    <div className='flex flex-col gap-2 max-w-[400px] w-full mx-auto'>
      {!translating && (
        <div className='flex flex-col gap-2'>
          <div className="flex items-stretch gap-4">
            <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
              <option value='Select Language'>Select Language</option>
              {Object.entries(LANGUAGES).map(([key, value]) => (
                <option key={key} value={value}>{key}</option>
              ))}
            </select>
            <button
              onClick={generateTranslation}
              className="flex bg-pink-500 px-4 py-2 rounded-xl text-white items-center justify-between mx-auto text-base max-w-full gap-4 specialBtn"
            >
              Translate
            </button>
          </div>
        </div>
      )}
      {(translation && !translating) && (
        <p>{translation}</p>
      )}
      {translating && (
        <div className='grid place-items-center'>
          <i className='fa-solid fa-spinner animate-spin'></i>
        </div>
      )}
    </div>
  );
}
