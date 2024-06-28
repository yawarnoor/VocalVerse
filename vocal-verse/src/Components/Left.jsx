import React from "react";

export default function Left() {
  return (
    <div className="w-1/2 h-screen flex flex-col">
      <div className="text-xl text-swatch-2 p-5">
        Voice<span className="text-blue-300">Verse</span>
      </div>

      <div className="h-full flex flex-col justify-center items-center p-20">
        <span className="text-6xl font-bold">
          Voice<span className="text-blue-300">Verse</span>
        </span>
        <br />
        <div className="text-2xl font-semibold text-center">
          A Tool powered by Whisper, to transcribe, translate and clone your
          voice
        </div>
      </div>
    </div>
  );
}
