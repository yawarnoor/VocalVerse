from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torch
import torchaudio
import numpy as np
import soundfile as sf
import io

app = Flask(__name__)

# Load the Whisper model and processor
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny")
processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")

def resample(audio_data, original_sample_rate, target_sample_rate=16000):
    # Convert the numpy array to a tensor and ensure it is float32
    audio_tensor = torch.from_numpy(audio_data).float()
    resampler = torchaudio.transforms.Resample(orig_freq=original_sample_rate, new_freq=target_sample_rate)
    return resampler(audio_tensor)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    audio_data, original_sample_rate = sf.read(io.BytesIO(audio_file.read()))

    # Ensure the audio is in the correct format
    if audio_data.ndim == 2:  # Stereo to Mono
        audio_data = np.mean(audio_data, axis=1)

    # Resample the audio to 16000 Hz
    resampled_audio_data = resample(audio_data, original_sample_rate).numpy()

    inputs = processor(resampled_audio_data, sampling_rate=16000, return_tensors="pt")
    predicted_ids = model.generate(inputs["input_features"])
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
