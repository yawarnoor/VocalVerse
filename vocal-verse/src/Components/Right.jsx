import React, { useState, useRef, useEffect } from "react";

export default function Right(props) {
  const { setFile, setAudioStream } = props;

  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);

  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording() {
    let tempStream;

    console.log("Start Recording");

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }

    setRecordingStatus("recording");

    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (typeof e.data === "undefined") {
        return;
      }
      if (e.data.size === 0) {
        return;
      }
      localAudioChunks.push(e.data);
    };

    setAudioChunks(localAudioChunks);
  }

  function stopRecording() {
    setRecordingStatus("inactive");

    console.log("Stop Recording");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioStream([]);
      setDuration(0)
    };
  }

  useEffect(() => {
    if (recordingStatus === "inactive") {
      return;
    }

    const interval = setInterval(() => {
    let curr = duration;
    setDuration((curr = curr + 1));
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="bg-white w-1/2 rounded-4xl flex items-center justify-center">
      <div className="border-dashed border-gray-400 border-2 rounded-2xl flex flex-col items-center justify-center p-10 gap-4 w-1/2">
        <button onClick={recordingStatus == 'recording' ? stopRecording : startRecording} className="flex bg-pink-500 px-4 py-2 rounded-xl text-white items-center justify-between mx-auto text-base max-w-full gap-4 specialBtn">
          <p>{recordingStatus === "inactive" ? "Record" : "Stop Recording"}</p>
          <i className="fa-solid fa-microphone"></i>
        </button>
        {duration > 0  && (
          <p>{duration}s</p>
        )}  
          <p>
            Or{" "}
            <label className="text-swatch-7 cursor-pointer hover:text-swatch-4 duration-200">
              upload
              <input
                className="hidden"
                onChange={(e) => {
                  const tempFile = e.target.files[0];
                  setFile(tempFile);
                }}
                type="file"
                accept=".mp3, •wave"
              />
            </label>{" "}
            mp3 file
          </p>
      </div>
    </div>
  );
}
