import React, { useState, useEffect } from 'react';
import Left from './Components/Left';
import Right from './Components/Right';
import './index.css';
import FileDisplay from './Components/FileDisplay';
import Transcribing from './Components/Transcribing';
import Information from './Components/Information';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const ffmpeg = new FFmpeg({ log: true });

const App = () => {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [currentPage, setCurrentPage] = useState('right'); // 'right', 'fileDisplay', 'transcribing', 'information'
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

  const testServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/test');
      const data = await response.json();
      console.log("Server test response:", data);
    } catch (error) {
      console.error("Error testing server connection:", error);
    }
  };

  useEffect(() => {
    testServerConnection();
    const loadFFmpeg = async () => {
      await ffmpeg.load();
      setIsFFmpegLoaded(true);
    };

    if (!isFFmpegLoaded) {
      loadFFmpeg();
    }
  }, [isFFmpegLoaded]);

  const convertAudio = async (file) => {
    await ffmpeg.writeFile('input.mkv', await fetchFile(file));
    await ffmpeg.exec(['-i', 'input.mkv', 'output.mp3']);
    const data = await ffmpeg.readFile('output.mp3');
    return new Blob([data.buffer], { type: 'audio/mp3' });
  };

  const handleAudioReset = () => {
    setFile(null);
    setAudioStream(null);
    setTranscription('');
    setCurrentPage('right');
  };

  const handleTranscribe = async () => {
    console.log("transcribe clicked");
    setCurrentPage('transcribing');
    const data = file || audioStream;
    console.log("Audio data:", data);

    let audioData = data;
    if (data && data.type === 'audio/x-matroska') {
      audioData = await convertAudio(data);
    }

    const formData = new FormData();
    formData.append('audio', audioData, audioData.name || 'recorded_audio.mp3');

    try {
      console.log('Transcribing audio...');
      const response = await fetch('http://localhost:3000/transcribe', {
        method: 'POST',
        body: formData,
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const result = await response.json();
      setTranscription(result.transcription);
      setCurrentPage('information');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setCurrentPage('right');
      // Optionally, set an error state here to display to the user
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'right':
        return <Right setFile={setFile} setAudioStream={setAudioStream} setCurrentPage={setCurrentPage} />;
      case 'fileDisplay':
        return <FileDisplay file={file} audioStream={audioStream} handleAudioReset={handleAudioReset} handleTranscribe={handleTranscribe} />;
      case 'transcribing':
        return <Transcribing />;
      case 'information':
        return <Information transcription={transcription} />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-screen w-screen justify-between bg-swatch-1'>
      <Left />
      {renderPage()}
    </div>
  );
};

export default App;