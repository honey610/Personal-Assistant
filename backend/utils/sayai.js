import fs from 'fs';
import recorder from 'node-record-lpcm16';
import say from 'say';
import { audioai } from './audioai.js'; // your existing function

const RECORD_FILE = 'voice_input.wav';

const listenAndRespond = () => {
  console.log('🎙 Listening for 5 seconds...');

  const file = fs.createWriteStream(RECORD_FILE, { encoding: 'binary' });

  const recording = recorder.record({
    sampleRate: 16000,
    threshold: 0,
    verbose: true,
    recordProgram: 'sox', // Make sure SoX is installed on Windows
  });

  recording.stream().pipe(file);

  // Stop recording after 5 seconds
  setTimeout(async () => {
    recording.stop();
    console.log('⏹ Recording stopped, processing...');

    try {
      const result = await audioai(RECORD_FILE);
      if (result?.response) {
        console.log('🤖 Assistant says:', result.response);
        say.speak(result.response); // Speak the response
      }
    } catch (err) {
      console.error('Error processing audio:', err);
    } finally {
      // Clean up
      if (fs.existsSync(RECORD_FILE)) fs.unlinkSync(RECORD_FILE);
    }
  }, 5000);
};

// Start the assistant
listenAndRespond();
