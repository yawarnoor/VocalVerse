from flask import Flask, request, jsonify
from transformers import WhisperProcessor, WhisperForConditionalGeneration, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import torchaudio
import numpy as np
import io
from flask_cors import CORS
import traceback
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load the Whisper model and processor
try:
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny")
    processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    logger.info("Whisper model and processor loaded successfully")
except Exception as e:
    logger.error(f"Error loading Whisper model: {str(e)}")
    raise

# Load the translation model and tokenizer
try:
    translation_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")
    tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
    logger.info("Translation model and tokenizer loaded successfully")
except Exception as e:
    logger.error(f"Error loading translation model: {str(e)}")
    raise

# Manually define the forced_bos_token_id for the target languages
forced_bos_token_ids = {
    "eng_Latn": tokenizer.convert_tokens_to_ids("eng_Latn"),
    "urd_Arab": tokenizer.convert_tokens_to_ids("urd_Arab"),
    # Add other language codes here as needed
}

def read_audio(audio_file):
    try:
        # Read the audio file using torchaudio
        waveform, sample_rate = torchaudio.load(io.BytesIO(audio_file.read()))
        
        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        # Convert to numpy array
        audio_data = waveform.numpy().flatten()
        
        return audio_data, sample_rate
    except Exception as e:
        logger.error(f"Error reading audio file: {str(e)}")
        raise

def resample(audio_data, original_sample_rate, target_sample_rate=16000):
    audio_tensor = torch.from_numpy(audio_data).float()
    resampler = torchaudio.transforms.Resample(orig_freq=original_sample_rate, new_freq=target_sample_rate)
    return resampler(audio_tensor)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        logger.info("Transcribe request received")
        if 'audio' not in request.files:
            logger.warning("No audio file provided in the request")
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        logger.info(f"Received audio file: {audio_file.filename}, Content-Type: {audio_file.content_type}")

        try:
            audio_data, original_sample_rate = read_audio(audio_file)
            logger.info(f"Audio data shape: {audio_data.shape}, Sample rate: {original_sample_rate}")
        except Exception as e:
            logger.error(f"Error reading audio file: {str(e)}")
            return jsonify({'error': f'Error reading audio file: {str(e)}'}), 400

        # Resample the audio to 16000 Hz
        try:
            resampled_audio_data = resample(audio_data, original_sample_rate).numpy()
            logger.info(f"Resampled audio data shape: {resampled_audio_data.shape}")
        except Exception as e:
            logger.error(f"Error resampling audio: {str(e)}")
            return jsonify({'error': 'Error processing audio'}), 500

        # Process with Whisper model
        try:
            inputs = processor(resampled_audio_data, sampling_rate=16000, return_tensors="pt")
            predicted_ids = model.generate(inputs["input_features"])
            transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
            logger.info("Transcription completed successfully")
        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return jsonify({'error': 'Error during transcription'}), 500

        return jsonify({'transcription': transcription})

    except Exception as e:
        logger.error(f"Unexpected error in transcribe: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@app.route('/translate', methods=['POST'])
def translate():
    try:
        logger.info("Translate request received")
        data = request.json
        if 'text' not in data or 'target_lang' not in data:
            logger.warning("Text or target language not provided in the request")
            return jsonify({'error': 'Text or target language not provided'}), 400

        text = data['text']
        target_lang = data['target_lang']
        logger.info(f"Received text to translate: {text}, Target language: {target_lang}")

        # Translate the text
        try:
            inputs = tokenizer(text, return_tensors="pt")
            # Setting forced_bos_token_id based on target_lang
            forced_bos_token_id = forced_bos_token_ids.get(target_lang, tokenizer.pad_token_id)
            translated_tokens = translation_model.generate(**inputs, forced_bos_token_id=forced_bos_token_id)
            translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
            logger.info("Translation completed successfully")
        except Exception as e:
            logger.error(f"Error during translation: {str(e)}")
            return jsonify({'error': 'Error during translation'}), 500

        return jsonify({'translated_text': translated_text})

    except Exception as e:
        logger.error(f"Unexpected error in translate: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@app.route('/test', methods=['GET'])
def test():
    logger.info("Test request received")
    return jsonify({'message': 'Server is running'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)