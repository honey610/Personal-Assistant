// import dotenv from "dotenv";
// import OpenAI from "openai";
// import fs from "fs";
// import fetch from "node-fetch";

// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Example: fetch sample WAV file (you can replace this with your recorded file)
// const audioai=async(audioPath)=>{

//   try{


// // Step 1️⃣: Transcribe speech to text
// const transcription = await openai.audio.transcriptions.create({
//   file: fs.createReadStream(audioPath),
//   model: "gpt-4o-mini-transcribe", // or "whisper-1"
// });

// console.log("User said:", transcription.text);

// // Step 2️⃣: Send transcribed text to GPT model
// const response = await openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   messages: [
//     { role: "system", content: "You are a helpful voice assistant." },
//     { role: "user", content: transcription.text },
//   ],
// });

// console.log("GPT Response:", response.choices[0].message.content);

// }catch(err){
//   console.log(err)
// }

// }

// export default audioai;



import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import { execSync } from "child_process";
import ffmpegPath from "ffmpeg-static";
import path from "path";

dotenv.config();
const convertToWav = (audioPath) => {
  const ext = path.extname(audioPath).toLowerCase();
  if (ext === ".wav") return audioPath;

 const dir = path.dirname(audioPath);               // folder
  const baseName = path.basename(audioPath, ext);   // filename without ext
  const outputPath = path.join(dir, baseName + ".wav"); // correct full path

  execSync(`"${ffmpegPath}" -i "${audioPath}" -ar 16000 -ac 1 "${outputPath}"`);
  return outputPath;
};


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const audioai = async (audioPath) => {
  try {
  console.log("🎧 File received for transcription:", audioPath);

    // Convert to WAV if needed
    const safeAudioPath = convertToWav(audioPath);

    // Log file size and type
    const stats = fs.statSync(safeAudioPath);
    console.log("📏 File size (bytes):", stats.size);

    // 1️⃣ Try transcription
    const transcriptionResult = await openai.audio.transcriptions.create({
      file: fs.createReadStream(safeAudioPath),
      model: "whisper-1", // Whisper model
    });

    console.log("📝 Raw transcription result:", transcriptionResult);

    const transcription = transcriptionResult.text;
    if (!transcription) throw new Error("No transcription text received");

    // 2️⃣ Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: transcription },
      ],
    });

    const response = completion.choices[0].message.content;
    console.log("🤖 AI Response:", response);

    // Optional: cleanup converted WAV if different from original
    if (safeAudioPath !== audioPath) {
      fs.unlinkSync(safeAudioPath);
    }


    return { transcription, response };
  } catch (err) {
    console.error("❌ Error in audioai():", err);
    return { error: err.message };
  }
};

// import OpenAI from "openai";
// import fs from "fs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const audioai = async (audioPath) => {
//   try {
//     // 1️⃣ Transcribe audio
//     const transcriptionResult = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(audioPath),
//       model: "gpt-4o-mini-transcribe", // or "whisper-1"
//     });

//     const transcription = transcriptionResult.text;

//     // 2️⃣ Generate AI response from transcription
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are an intelligent assistant." },
//         { role: "user", content: transcription },
//       ],
//     });

//     const response = completion.choices[0].message.content;

//     return { transcription, response };
//   } catch (err) {
//     console.error("Error in audioai:", err);
//     return null;
//   }
// };
