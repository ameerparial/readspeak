import sdk from "microsoft-cognitiveservices-speech-sdk";
import { parseBuffer } from "music-metadata";

export async function generateAudio(text, shortname) {
  console.log("Received the sentence, ");
  console.log(text);
  console.log(shortname);
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.SPEECH_KEY,
      process.env.SPEECH_REGION
    );
    speechConfig.speechSynthesisVoiceName = shortname;
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const wordTimings = [];
    let offsetBase = 0;

    speechSynthesizer.wordBoundary = (s, e) => {
      // audio is in ms

      wordTimings.push({
        word: e.text,
        start: offsetBase + e.audioOffset / 10000,
        end: offsetBase + (e.audioOffset + e.duration) / 10000,
      });
    };

    speechSynthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBuffer = Buffer.from(result.audioData); // Convert the audio data to a proper Buffer

          // console.log(wordBoundary);

          resolve({ audioBuffer, wordTimings }); // Resolve with the audio buffer
        } else {
          reject(result.errorDetails); // Reject if there's an error
        }

        speechSynthesizer.close();
      },
      (error) => {
        speechSynthesizer.close();
        console.log(error.message);
        reject(error); // Reject in case of an error
      }
    );
  });
}

export async function getAudioDuration(buffer) {
  try {
    const metadata = await parseBuffer(buffer, { mimeType: "audio/wav" });
    return metadata.format.duration; // duration is in seconds
  } catch (err) {
    console.error("Error parsing audio metadata:", err);
    return 0; // Default to 0 if an error occurs
  }
}
// export async function readTextAloud(text) {

//   return new Promise((resolve, reject) => {
//     const audioConfig = sdk.AudioConfig.fromAudioOutputStream(new sdk.PullAudioOutputStream());
//     const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

//     synthesizer.speakTextAsync(
//       text,
//       result => {

//       },
//       err => {
//         reject(err);
//         synthesizer.close();
//       }
//     );
//   });

// }

export async function getVoices(req, res) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );
  try {
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const response = await synthesizer.getVoicesAsync();
    return res.json({ success: true, voices: response["privVoices"] });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
}

/**
 * const fileData = readFile(
      "D:\\VS Code\\FYP\\readspeak\\Back-end\\services\\example.wav"
    );

    const bufferData = Buffer.from(fileData);
    return res.send(bufferData);
 * 
 * 
 */

// const fileData = readFileSync(
//   "D:\\VS Code\\FYP\\readspeak\\Back-end\\services\\example.wav"
// );

// const bufferData = Buffer.from(fileData);
// return res.send(bufferData);
