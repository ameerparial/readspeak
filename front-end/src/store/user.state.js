import axios from "axios";
import { create } from "zustand";

// const API_URL =
//   process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/";

const API_URL = "https://readspeakapp.azurewebsites.net";

axios.defaults.withCredentials = true;
export const useUser = create((set) => ({
  voices: [],
  error: null,
  isLoading: false,
  audioUrl: null,
  selectedCountryIndex: 32,
  shortname: "en-AU-WilliamNeural",
  wordsWithMeanings: [],
  readPDFs: [],
  favoriteWords: JSON.parse(sessionStorage.getItem("dictionary-words")) || [],
  addToFavoriteList: function (word, meaning) {
    const list = JSON.parse(sessionStorage.getItem("dictionary-words")) || [];
    list.push({ word, meaning });
    sessionStorage.setItem("dictionary-words", JSON.stringify(list));
    set({ favoriteWords: list });
  },
  removeFromFavorite: (searchWord) => {
    const list = JSON.parse(sessionStorage.getItem("dictionary-words")) || [];
    const newList = [];
    for (let word of list) {
      if (word.word === searchWord) break;
      else newList.push(word);
    }

    sessionStorage.setItem("dictionary-words", JSON.stringify(newList));
    set({ favoriteWords: newList });
  },
  languages: {
    af: {
      placeholder: "Tik hier om hardop te lees",
      style: "LTR",
    },
    am: {
      placeholder: "እባክዎትን እዚህ ይፃፉ ለማንበብ",
      style: "LTR",
    },
    ar: {
      placeholder: "اكتب هنا للقراءة بصوت عالٍ",
      style: "RTL",
    },
    as: {
      placeholder: "এতিয়া ইবিধত লিখক পঢ়িবলৈ",
      style: "LTR",
    },
    az: {
      placeholder: "Bura yazın ki ucadan oxusun",
      style: "LTR",
    },
    bg: {
      placeholder: "Пишете тук за четене на глас",
      style: "LTR",
    },
    bn: {
      placeholder: "উচ্চস্বরে পড়তে এখানে টাইপ করুন",
      style: "LTR",
    },
    bs: {
      placeholder: "Ovdje upišite da biste glasno pročitali",
      style: "LTR",
    },
    ca: {
      placeholder: "Escriu aquí per llegir en veu alta",
      style: "LTR",
    },
    cs: {
      placeholder: "Zadejte zde pro čtení nahlas",
      style: "LTR",
    },
    cy: {
      placeholder: "Teipiwch yma i ddarllen yn uchel",
      style: "LTR",
    },
    da: {
      placeholder: "Skriv her for at læse højt",
      style: "LTR",
    },
    de: {
      placeholder: "Tippen Sie hier, um laut vorzulesen",
      style: "LTR",
    },
    el: {
      placeholder: "Πληκτρολογήστε εδώ για να διαβάσετε δυνατά",
      style: "LTR",
    },
    en: {
      placeholder: "Type here to read aloud",
      style: "LTR",
    },
    es: {
      placeholder: "Escribe aquí para leer en voz alta",
      style: "LTR",
    },
    et: {
      placeholder: "Sisestage siia, et valjult lugeda",
      style: "LTR",
    },
    eu: {
      placeholder: "Idatzi hemen ozen irakurtzeko",
      style: "LTR",
    },
    fa: {
      placeholder: "اینجا بنویسید تا با صدای بلند بخوانید",
      style: "RTL",
    },
    fi: {
      placeholder: "Kirjoita tähän lukeaksesi ääneen",
      style: "LTR",
    },
    fil: {
      placeholder: "Mag-type dito para magbasa nang malakas",
      style: "LTR",
    },
    fr: {
      placeholder: "Tapez ici pour lire à haute voix",
      style: "LTR",
    },
    ga: {
      placeholder: "Clóscríobh anseo chun léamh os ard",
      style: "LTR",
    },
    gl: {
      placeholder: "Escribe aquí para ler en voz alta",
      style: "LTR",
    },
    gu: {
      placeholder: "ઉચ્ચારવા માટે અહીં લખો",
      style: "LTR",
    },
    he: {
      placeholder: "הקלד כאן לקריאה בקול רם",
      style: "RTL",
    },
    hi: {
      placeholder: "जोर से पढ़ने के लिए यहां टाइप करें",
      style: "LTR",
    },
    hr: {
      placeholder: "Upišite ovdje za čitanje naglas",
      style: "LTR",
    },
    hu: {
      placeholder: "Írjon ide a hangos olvasáshoz",
      style: "LTR",
    },
    hy: {
      placeholder: "Մուտքագրեք այստեղ բարձրաձայն ընթերցելու համար",
      style: "LTR",
    },
    id: {
      placeholder: "Ketik di sini untuk membaca dengan lantang",
      style: "LTR",
    },
    is: {
      placeholder: "Sláðu inn hér til að lesa upphátt",
      style: "LTR",
    },
    it: {
      placeholder: "Digita qui per leggere ad alta voce",
      style: "LTR",
    },
    iu: {
      placeholder: "ᑯᑕᐃᕐᕕᖅᐸᑦ ᐊᑯᕋᓱᐊᓕᖅᐸᖅᑐᖅ ᐊᕐᕿᐅᓂᒃ",
      style: "LTR",
    },
    ja: {
      placeholder: "ここに入力して読み上げます",
      style: "LTR",
    },
    jv: {
      placeholder: "Ketik ing kene kanggo maca kanthi banter",
      style: "LTR",
    },
    ka: {
      placeholder: "შეიყვანეთ აქ ხმამაღლა წასაკითხად",
      style: "LTR",
    },
    kk: {
      placeholder: "Дауыс шығарып оқу үшін осында теріңіз",
      style: "LTR",
    },
    km: {
      placeholder: "វាយនៅទីនេះដើម្បីអានឱ្យបានខ្លាំង",
      style: "LTR",
    },
    kn: {
      placeholder: "ಹಾಗೂ ಓದಲು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ",
      style: "LTR",
    },
    ko: {
      placeholder: "여기에 입력하여 큰 소리로 읽으십시오",
      style: "LTR",
    },
    lo: {
      placeholder: "ພິມຢູ່ນີ້ເພື່ອອ່ານດັງ",
      style: "LTR",
    },
    lt: {
      placeholder: "Įveskite čia, kad garsiai skaitytumėte",
      style: "LTR",
    },
    lv: {
      placeholder: "Ierakstiet šeit, lai lasītu skaļi",
      style: "LTR",
    },
    mk: {
      placeholder: "Внесете тука за да прочитате на глас",
      style: "LTR",
    },
    ml: {
      placeholder: "വായിക്കാൻ ഇവിടെ ടൈപ്പ് ചെയ്യുക",
      style: "LTR",
    },
    mn: {
      placeholder: "Энд бичиж чанга дуудаж уншаарай",
      style: "LTR",
    },
    mr: {
      placeholder: "मोठ्याने वाचण्यासाठी येथे टाइप करा",
      style: "LTR",
    },
    ms: {
      placeholder: "Taip di sini untuk membaca dengan kuat",
      style: "LTR",
    },
    mt: {
      placeholder: "Ittajpja hawn biex taqra b'leħen għoli",
      style: "LTR",
    },
    my: {
      placeholder: "အလျင်မြန်ဆုံး သီချင်းဖတ်ပါ",
      style: "LTR",
    },
    nb: {
      placeholder: "Skriv her for å lese høyt",
      style: "LTR",
    },
    ne: {
      placeholder: "ठूलो स्वरमा पढ्न यहाँ टाइप गर्नुहोस्",
      style: "LTR",
    },
    nl: {
      placeholder: "Typ hier om hardop voor te lezen",
      style: "LTR",
    },
    or: {
      placeholder: "ଉଚ୍ଚରଣ ପାଇଁ ଏଠାରେ ଟାଇପ କରନ୍ତୁ",
      style: "LTR",
    },
    pa: {
      placeholder: "ਜੋਰ ਨਾਲ ਪੜ੍ਹਨ ਲਈ ਇੱਥੇ ਲਿਖੋ",
      style: "LTR",
    },
    pl: {
      placeholder: "Wpisz tutaj, aby przeczytać na głos",
      style: "LTR",
    },
    ps: {
      placeholder: "دلته ټایپ کړئ ترڅو په لوړ اواز ولولئ",
      style: "RTL",
    },
    pt: {
      placeholder: "Digite aqui para ler em voz alta",
      style: "LTR",
    },
    ro: {
      placeholder: "Tastați aici pentru a citi cu voce tare",
      style: "LTR",
    },
    ru: {
      placeholder: "Введите текст здесь, чтобы прочитать вслух",
      style: "LTR",
    },
    si: {
      placeholder: "මෙහි වචන නැත. කියවීමට ටයිප් කරන්න",
      style: "LTR",
    },
    sk: {
      placeholder: "Zadajte tu pre čítanie nahlas",
      style: "LTR",
    },
    sl: {
      placeholder: "Vnesite tukaj za glasno branje",
      style: "LTR",
    },
    so: {
      placeholder: "Halkan ka qor si cod loo akhriyo",
      style: "LTR",
    },
    sq: {
      placeholder: "Shkruani këtu për të lexuar me zë",
      style: "LTR",
    },
    sr: {
      placeholder: "Унесите овде да бисте читали наглас",
      style: "LTR",
    },
    su: {
      placeholder: "Ketik di dieu pikeun maca kalawan sora",
      style: "LTR",
    },
    sv: {
      placeholder: "Skriv här för att läsa högt",
      style: "LTR",
    },
    sw: {
      placeholder: "Andika hapa ili kusoma kwa sauti",
      style: "LTR",
    },
    ta: {
      placeholder: "உயர்ந்த குரலில் வாசிக்க இங்கே தட்டச்சு செய்க",
      style: "LTR",
    },
    te: {
      placeholder: "పగలగొట్టడానికి ఇక్కడ టైప్ చేయండి",
      style: "LTR",
    },
    th: {
      placeholder: "พิมพ์ที่นี่เพื่ออ่านออกเสียง",
      style: "LTR",
    },
    tr: {
      placeholder: "Yüksek sesle okumak için buraya yazın",
      style: "LTR",
    },
    uk: {
      placeholder: "Введіть текст тут, щоб читати вголос",
      style: "LTR",
    },
    ur: {
      placeholder: "یہاں ٹائپ کریں تاکہ زور سے پڑھا جائے",
      style: "RTL",
    },
    uz: {
      placeholder: "Baland ovozda o'qish uchun bu yerga yozing",
      style: "LTR",
    },
    vi: {
      placeholder: "Nhập vào đây để đọc to",
      style: "LTR",
    },
    wuu: {
      placeholder: "在此输入以大声朗读",
      style: "LTR",
    },
    yue: {
      placeholder: "在此输入以大声朗读",
      style: "LTR",
    },
    zh: {
      placeholder: "在此输入以大声朗读",
      style: "LTR",
    },
    zu: {
      placeholder: "Thayipha lapha ukuze ufunde ngokuzwakalayo",
      style: "LTR",
    },
  },

  updateProfile: async (fd) => {
    try {
      const response = await axios.post(`${API_URL}/user/updateuser`, fd);
      console.log(response);
    } catch (err) {
      console.log("Error while updating the profile section 1");
      console.log(err.message);
    }
  },

  fetchAudio: async (text, shortname) => {
    console.log("Fetching again with short name", shortname);
    set({ isLoading: true });

    try {
      const response = await axios.post(
        "http://localhost:5000/tts/read-aloud",
        { text, shortname },
        { responseType: "blob" }
      );
      const audioURL = response.data;
      const audioUrl = URL.createObjectURL(audioURL);
      set({ audioUrl });
      console.log("Audio is set");
    } catch (err) {
      console.log("Error occured");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getVoices: async () => {
    try {
      const response = await axios.get(`${API_URL}/tts/getvoices`);
      const result = response.data;
      if (result.success) {
        set({ voices: result.voices });
        return;
      }
      set({ error: result.message });
    } catch (err) {
      set({ error: err.message });
    }
  },
  setSelectedCountryIndex: (selectedCountryIndex) => {
    set({ selectedCountryIndex });
  },
  setShortname: (shortname) => {
    set({ shortname });
  },
  modifyPassword: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/user/updatepassword`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      const responseValue = response.data;
      console.log(responseValue);
      if (!responseValue.success) throw new Error(responseValue.message);
      return responseValue.message;
    } catch (err) {
      throw new Error(err.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAccount: async () => {
    try {
      const response = await axios.delete(`${API_URL}/user/deleteuser`);
      return response.data.message;
    } catch (err) {
      throw new Error(err.response.data.message);
    }
  },
  getWordsMeaning: async (wordsArray) => {
    try {
      console.log("Meaning to be found for words...");
      console.log(wordsArray);
      const response = await axios.post(`${API_URL}/user/show-dictionary`, {
        words: wordsArray,
      });

      const data = response.data;
      set((state) => {
        return {
          ...state,
          wordsWithMeanings: [...data, ...state.wordsWithMeanings],
        };
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  generateQuiz: (favoriteWords) => {
    // Helper function to shuffle an array (Fisher-Yates shuffle)
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Randomly select 10 words from the favoriteWords list
    const selectedWords = shuffleArray([...favoriteWords]).slice(0, 10);

    // Generate the quiz
    const quiz = selectedWords.map(({ word, meaning }) => {
      // Get the correct meaning
      const correctMeaning = meaning;

      // Randomly select three incorrect meanings
      const incorrectOptions = shuffleArray(
        favoriteWords
          .filter((item) => item.word !== word) // Filter out the current word
          .map((item) => item.meaning) // Extract the meanings
      ).slice(0, 3);

      // Combine correct and incorrect meanings
      const options = shuffleArray([correctMeaning, ...incorrectOptions]);

      return {
        question: `What is the meaning of the word "${word}"?`,
        options: options, // Shuffled array of correct and incorrect meanings
        correctAnswer: correctMeaning, // The correct answer for validation
      };
    });
    console.log(quiz);

    return quiz;
  },
  savePDF: async (file) => {
    try {
      const formData = new FormData();
      formData.set("pdffile", file);
      console.log("Called to save the file");
      const response = await axios.post(
        `${API_URL}/user/addpdfroute`,
        formData
      );
      const data = response.data;
      if (data) {
        const pdfFiles = data.pdfRead;
        console.log(pdfFiles);
        set({ readPDFs: pdfFiles });
      }
    } catch (err) {
      console.log("Error while saving the pdf...");
      console.log(err.message);
    }
  },

  getPDFs: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/showallpdfs`);
      set({ readPDFs: response.data.data });
    } catch (err) {
      console.log(err.message);
    }
  },
  deletePDF: async (file) => {
    try {
      // console.log(file);
      const response = await axios.delete(
        `${API_URL}/user/deletepdf/${file._id}`,
        {
          params: {
            filePath: file.filePath,
          },
        }
      );
      const remainingFiles = response.data.data;
      set({ readPDFs: remainingFiles });
    } catch (err) {
      console.log(err.message);
    }
  },

  openPDF: (url) => {
    axios
      .get(`${API_URL}/profiles/${url}`, {
        responseType: "blob",
        cache: "no-cache",
      })
      .then((response) => {
        const pdfUrl = URL.createObjectURL(response.data);
        window.open(pdfUrl, "_blank");
      })
      .catch((error) => console.error("Error loading PDF:", error));
  },
  getProfileImage: async (imageName) => {
    try {
      const response = await axios.get(`${API_URL}/profiles/${imageName}`, {
        responseType: "blob",
        cache: "no-cache",
      });
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (err) {
      throw err;
    }
  },
  sendMessage: async (message, email) => {
    try {
      axios.post(`${API_URL}/user/sendmessage`, { message, email });
    } catch (err) {
      throw err;
    }
  },
}));
