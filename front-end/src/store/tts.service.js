import axios from "axios";
import { create } from "zustand";

// const API_URL =
//   process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/";

const API_URL = "https://readspeakapp.azurewebsites.net";

export const useTTSStore = create((set) => ({
  sentences: [],
  currentIndex: 0,
  audioCache: {}, // Cache for storing audio URLs
  isPlaying: false, // Track play/pause state
  isDictionaryModeOn: false,
  setIsDictionaryModeOn: (value) => {
    set({ isDictionaryModeOn: value });
  },
  isToRefetch: true,
  text: "",
  setText: (text) => {
    set({ text });
  },
  wordMeaning: [],
  meaningOfWord: async (word) => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  },
  setIsToRefetch: (isTo) => set({ isToRefetch: isTo }),
  currentText: "",
  setCurrentText: (currentText) => set({ currentText }),
  setSentences: (sentences) => set({ sentences }),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  togglePlaying: (isPlaying) => {
    set({ isPlaying });
  },
  addAudioToCache: (sentence, audioUrl) =>
    set((state) => ({
      audioCache: { ...state.audioCache, [sentence]: audioUrl },
    })),
  addAudiosToCache: (audioCache) => {
    set({ audioCache });
  },
  fetchSentenceAudio: async (sentence, shortname) => {
    console.log("Fetching audio for...");
    console.log(sentence);
    console.log(shortname);
    try {
      const response = await axios.post(`${API_URL}/tts/read-aloud`, {
        text: sentence,
        shortname,
      });

      const { audio, duration, wordTimings } = response.data;

      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
        { type: "audio/mpeg" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      return { audioUrl, duration, wordTimings };
    } catch (err) {
      console.log("Error occured");
      console.log(err.message);
      set({ isPlaying: false });
      throw err;
    } finally {
    }
  },
}));

// export const useTTS = create((set) => ({
//   sentences: [], // Store the list of sentences
//   currentIndex: 0,
//   audioQueue: [], // Queue for pre-fetched audio
//   audioUrl: false,
//   isLoading: false,
//   setSentences: (sentences) => set({ sentences }),
//   setCurrentIndex: (index) => set({ currentIndex: index }),
//   setAudioQueue: (audioQueue) => set({ audioQueue }),

//   currentAudioUrl: (url) => {
//     set({ audioUrl: url });
//   },
// }));
