import React from 'react';

export default function Transcription(props) {
  const { transcription } = props;

  return (
    <div>
      <p className="text-lg font-medium mt-4">Transcription:</p>
      <div className="border border-gray-300 p-4 rounded-md bg-white shadow-md mt-2">
        <p className="text-gray-800">{transcription}</p>
      </div>
    </div>
  );
}
