import React, {useState, useEffect, user, useRef} from 'react';
import Left from './Components/Left';
import Right from './Components/Right';
import './index.css';
import FileDisplay from './Components/FileDisplay';
import Transcribing from './Components/Transcribing';
import Information from './Components/Information';

const App = () => {
  const [file,setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [output,setOutput] = useState(false)
  const [loading, setLoading] = useState(null)
  const [finished,setFinished] = useState(false)

  function handleAudioReset(){
    setFile(null)
    setAudioStream(null)
  }

  const worker = useRef(null)

  useEffect(() => {
    if(!worker.current){
      worker.current = new Worker(new URL('./', import.meta.url), {type: 'module'});
    }
  }, [])

  const isAudioAvailable = file || audioStream

  return (
    <div className='flex h-screen w-screen justify-between bg-swatch-1'>
      <Left />
      {output ? <Information/> :  loading ? <Transcribing/> : isAudioAvailable ? <FileDisplay file={file} audioStream={audioStream} handleAudioReset = {handleAudioReset} /> : <Right setFile = {setFile} setAudioStream = {setAudioStream}/>} 
    </div>
  );
};
export default App;
