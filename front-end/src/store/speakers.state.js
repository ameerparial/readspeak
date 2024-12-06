import { create } from "zustand";

export const useSpeakers = create((set) => ({
  bookMarkedSpeakers:
    JSON.parse(sessionStorage.getItem("favoritespeakers")) || [],
  setBookMarkedSpeakers: (speaker, bookMarkedSpeakers) => {
    if (bookMarkedSpeakers.includes(speaker)) {
      // Remove the speaker
      const newList = [];
      bookMarkedSpeakers.forEach((sp) => {
        if (sp !== speaker) newList.push(sp);
      });
      set({ bookMarkedSpeakers: newList });
      sessionStorage.setItem("favoritespeakers", JSON.stringify(newList));
      return -1;
    } else {
      bookMarkedSpeakers.push(speaker);
      set({ bookMarkedSpeakers });
      sessionStorage.setItem(
        "favoritespeakers",
        JSON.stringify(bookMarkedSpeakers)
      );
      return 1;
    }
  },
  saveToDatabase: (bookMarkedSpeakers) => {
    console.log("Save to database");
    console.log(bookMarkedSpeakers);
  },
}));
