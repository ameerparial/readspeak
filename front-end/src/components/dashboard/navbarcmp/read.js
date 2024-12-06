import React, { useRef, useEffect, useState } from "react";
import Controller from "../Controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faClosedCaptioning,
  faFilePdf,
  faStar as faStartRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faClose,
  faFileWord,
  faInfoCircle,
  faSpinner,
  faStar,
  faStarAndCrescent,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../store/user.state";
import { useTTSStore } from "../../../store/tts.service";
import { useColor } from "../../../store/color.state";
import toast from "react-hot-toast";
import { extractText } from "../../utils/pdf_text";
import Loader from "../../Loader";

const App = ({ voices }) => {
  const {
    setSentences,
    sentences,
    currentIndex,
    isPlaying,
    isToRefetch,
    setIsToRefetch,
    togglePlaying,
    text,
    setText,
    audioCache,
    isDictionaryModeOn,
    setIsDictionaryModeOn,
  } = useTTSStore();

  const textareaRef = useRef(null);
  const divRef = useRef(null);
  const {
    languages,
    shortname,
    getWordsMeaning,
    wordsWithMeanings,
    savePDF,
    addToFavoriteList,
  } = useUser();
  const language = shortname.split("-")[0];
  const writingStyle = languages[language]?.style || "LTR";
  const { settingOptions } = useColor();

  const [isSubtitleOn, setIsSubtitleOn] = useState(false);
  const [CT, setCT] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCopied, setisCopied] = useState(false);
  const [isDictionaryOn, setIsDictionaryOn] = useState(false);
  const [isDictionaryLoading, setIsDictionaryLoading] = useState(false);
  const [hoveredWord, setHoveredWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [meaningLoading, setMeaningLoading] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      console.log("New Sentence");
      setCurrentWordIndex("new-sentence");
      // console.log(sentences[currentIndex]);
    } else {
      setCurrentWordIndex(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isPlaying) {
      const currentSentence = sentences[currentIndex];

      const wordTimings = audioCache[currentSentence].wordTimings;

      // Calculating the time for each word:
      const mili = CT * 1000;
      const currentWord = wordTimings.find(
        (timing) => mili >= timing.start && mili <= timing.end
      );
      // console.log(currentWord);
      if (currentWord) {
        const word = currentWord.word;
        if (word === "." || word === ",") {
          return;
        }
        // console.log(
        //   `Searching for the word ${word} from index ${currentWordIndex}`
        // );

        if (currentWordIndex === "new-sentence") {
          setCurrentWordIndex(0);
          console.log("New line");
        } else {
          const index = indexOf(currentSentence, word, currentWordIndex);

          if (index !== -1) {
            setCurrentWordIndex(index);
          } else {
            console.log("Index is -1");
          }
        }
      }
    }
  }, [CT]);

  function indexOf(sentence, wordToFind, currentIndex) {
    const words = sentence.replace(/[.,!?;:]/g, "").split(" ");
    for (let i = currentIndex; i < words.length; i++) {
      if (words[i].toLowerCase() === wordToFind.toLowerCase()) {
        return i;
      }
    }

    return -1;
  }

  useEffect(() => {
    const language = shortname.split("-")[0];
    if (!text.trim()) {
      console.log(language);
      let dummmyText = ``;
      if (language === "en")
        dummmyText = `ReadSpeak is a versatile application designed to bring your written content to life. Whether you're immersed in a captivating novel, delving into academic research, or simply need to hear important documents, ReadSpeak is your solution. With its advanced text-to-speech capabilities, ReadSpeak accurately converts text into natural-sounding audio, allowing you to listen to your content hands-free.

Beyond traditional text, ReadSpeak seamlessly handles PDF files, making it a valuable tool for students, professionals, and anyone who frequently works with digital documents. By extracting text from PDFs and converting it into spoken word, ReadSpeak provides a convenient and accessible way to consume information.`;
      else if (language === "ur") {
        dummmyText = `ریڈ اسپیک ایک متنوع ایپلیکیشن ہے جو آپ کے تحریری مواد کو زندگی بخشتی ہے۔

چاہے آپ ایک دلکش ناول میں ڈوبے ہوئے ہوں، علمی تحقیق میں گہرائی کر رہے ہوں، یا بس اہم دستاویزات سننے کی ضرورت ہو، ریڈ اسپیک آپ کا حل ہے۔ اپنی جدید ٹیکسٹ ٹو اسپیچ صلاحیتوں کے ساتھ، ریڈ اسپیک متن کو قدرتی آواز میں درستگی سے تبدیل کرتا ہے، جس سے آپ اپنے مواد کو ہاتھوں کے بغیر سن سکتے ہیں۔

روایتی متن سے ہٹ کر، ریڈ اسپیک پی ڈی ایف فائلوں کو بخوبی سنبھالتا ہے، جو طلباء، پیشہ ور افراد، اور کسی بھی شخص کے لیے ایک قیمتی آلہ ہے جو اکثر ڈیجیٹل دستاویزات کے ساتھ کام کرتا ہے۔ 

پی ڈی ایف سے متن کو نکال کر اور اسے بولی جانے والی شکل میں تبدیل کرکے، ریڈ اسپیک معلومات کو استعمال کرنے کا ایک آسان اور قابل رسائی طریقہ فراہم کرتا ہے۔`;
      }
      setText(dummmyText);
      handleTextChange(dummmyText);
    }

    return () => {
      // console.log("Unmount");
      // Set the current Index to 0:
      togglePlaying(false);

      //playing to off
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setIsSubtitleOn(false);
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   // Highlight the current Sentence and words.
  //   if (isReading && currentIndex < sentences.length) {
  //     const id = setInterval(() => {
  //       setCurrentIndex((i) => i + 1);
  //     }, 500);

  //     return () => {
  //       clearInterval(id);
  //     };
  //   } else {
  //     // setIsReading(false);
  //     setCurrentIndex(0);
  //   }
  // }, [isReading, currentIndex, sentences]);

  // useEffect(() => {
  //   // Adjust textarea height based on content
  //   if (textareaRef && textareaRef.current) {
  //     textareaRef.current.style.height = "auto";
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  //   }

  //   // Adjust div height to match textarea
  //   if (divRef && divRef.current) {
  //     divRef.current.style.height = "auto";
  //     divRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
  //   }
  // }, [text]);

  const handleTextChange = (e) => {
    const text = e.target?.value || e;
    if (typeof text !== "string") {
      setText("");
      return;
    }
    setText(text);
    setIsToRefetch(true);

    // const newSentences = text.split(
    //   /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/
    // );
    // setSentences(newSentences);
    // return;

    // Above

    const structedSentences = [];

    text
      .trim()
      .split("\n")
      .forEach((pargraph) => {
        if (!pargraph.trim()) {
          structedSentences.push("\n");
          return;
        }
        const sentences = pargraph.split(
          /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/
        );
        structedSentences.push(...sentences);
        structedSentences.push("\n");
      });
    setSentences(structedSentences);
  };

  const copyText = () => {
    navigator.clipboard.writeText(text).then(() => {
      setisCopied(true);
      toast.success("Text is copied.");
      setTimeout(() => setisCopied(false), 2000);
    });
  };
  const handlePdfInput = (event) => {
    console.log("I'm called");
    const file = event.target.files[0];
    if (file) {
      extractText(file, function (text) {
        setText(text);
        savePDF(file);
        handleTextChange(text);
      });
    }
    console.log(" Called on change");
    console.log(file);
  };
  const handleDictionaryClick = async () => {
    if (isDictionaryModeOn) {
      return setIsDictionaryModeOn(false);
    }
    if (!text.trim()) {
      alert("No word found.");
      return;
    }
    setIsDictionaryModeOn(true);

    setIsDictionaryLoading(true);

    try {
      const wordsArray = text.match(/\b\w+(?:'\w+)?\b/g);
      console.log("Meaning of the words..");
      console.log(wordsWithMeanings);

      const words = wordsWithMeanings.map((wordWithMean) => wordWithMean.word);
      // console.log(words);

      const englishWords = wordsArray.filter((word) => {
        if (
          word.length > 3 &&
          word.match(/^[a-zA-Z]+$/) &&
          !words.includes(word)
        )
          return true;

        return false;
      });
      // console.log("looking for words");
      // console.log(englishWords);
      await getWordsMeaning(englishWords);
      wordsWithMeanings.forEach((word) => {
        const meanings = word.meanings;
        if (meanings) {
          addToFavoriteList(
            word.word,
            meanings[0]?.definitions[0]?.definition || "NOT FOUND"
          );
        }
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDictionaryLoading(false);
    }
  };

  const handleMouseEnter = (word) => {
    console.log(word + " is hovered");
    setHoveredWord(word);
  };
  const handleMouseLeave = () => {
    setHoveredWord(null);
  };

  const color = settingOptions.theme === "dark" ? "white" : "black";

  return (
    <div className="container">
      <div className="d-flex justify-content-end align-items-center icons">
        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={faClosedCaptioning}
            className={`icon border btn ${
              isSubtitleOn ? `text-${settingOptions.color}` : ""
            }`}
            onClick={() => {
              if (isPlaying) setIsSubtitleOn(!isSubtitleOn);
            }}
          />
          <label className="label">Subtitle</label>
        </div>

        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={isCopied ? faCheck : faClipboard}
            className="icon border btn"
            onClick={copyText}
          />
          <label className="label">Copy</label>
        </div>

        <div className="icon-wrapper">
          <input
            type="file"
            id="pdfinput"
            className="d-none"
            accept=".pdf"
            onChange={handlePdfInput}
          />
          <label htmlFor="pdfinput">
            <FontAwesomeIcon
              icon={faFilePdf}
              className="icon border btn"
              id="pdfinput"
            />
            <label className="label">Read PDF</label>
          </label>
        </div>

        <div className="icon-wrapper">
          {isDictionaryLoading ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="fa-spinner fa-spin"
              aria-hidden="true"
              style={{ animationDuration: "1s" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faFileWord}
              className={`icon border btn ${
                isDictionaryModeOn ? "text-" + settingOptions.color : ""
              }`}
              onClick={handleDictionaryClick}
            />
          )}

          <label className="label">Dictionary Mode</label>
        </div>

        <div className="icon-wrapper">
          <FontAwesomeIcon
            icon={faClose}
            className="icon border btn btn-danger shadow"
            onClick={() => {
              setText("");
            }}
          />
          <label className="label">Clear Text </label>
        </div>
      </div>

      {/*Styled Div to match Textarea */}

      {isPlaying || isDictionaryModeOn ? (
        <>
          <div
            ref={divRef}
            className={`form-control shadow bg-${settingOptions.theme}`}
            style={{
              overflow: "visible", // Allow tooltips to overflow the container
              minHeight: "40px",
              resize: "none",
              color,
              whiteSpace: "pre-wrap", // Ensures that line breaks in the text are respected
              lineHeight: "inherit", // Ensure the same line height
              marginBottom: "100px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "18px",
              zIndex: 1,
            }}
            dir={writingStyle === "LTR" ? "ltr" : "rtl"} // Apply direction dynamically
          >
            {/* Render the sentences */}
            {sentences.map((sentence, sentenceIndex) => (
              <React.Fragment key={sentenceIndex}>
                {sentence === "\n" ? (
                  <br />
                ) : (
                  sentence.split(" ").map((word, wordIndex) => {
                    const isCurrentSentence = isPlaying
                      ? currentIndex === sentenceIndex
                      : false;
                    const isCurrentWord =
                      isPlaying && isCurrentSentence
                        ? currentWordIndex === wordIndex
                        : false;

                    return (
                      <span
                        key={`${sentenceIndex}-${wordIndex}-sentence`}
                        onMouseEnter={() =>
                          handleMouseEnter(sentenceIndex + "-" + wordIndex)
                        }
                        onMouseLeave={handleMouseLeave}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          backgroundColor: isCurrentSentence
                            ? isCurrentWord
                              ? "#FFF9C4" // Highlight current word
                              : "#FFF8E1" // Highlight current sentence
                            : "transparent",
                        }}
                      >
                        {word}{" "}
                        {isDictionaryModeOn &&
                          hoveredWord === `${sentenceIndex}-${wordIndex}` && (
                            <WordMeaningDialogBox
                              word={word}
                              wordsWithMeanings={wordsWithMeanings}
                            />
                          )}
                      </span>
                    );
                  })
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <>
          {" "}
          <textarea
            ref={textareaRef}
            className={`form-control bg-${settingOptions.theme}`}
            value={text}
            onChange={handleTextChange}
            rows="20"
            style={{
              overflow: "hidden",
              color,
              resize: "none",
              fontFamily: "Roboto, sans-serif",
              fontSize: "18px",
              lineHeight: "inherit", // Match line height with div
              marginBottom: "100px",
            }}
            placeholder={
              languages[shortname.split("-")[0]]?.placeholder ||
              "Type here to read the text"
            }
            dir={languages[shortname.split("-")[0]]?.style || "LTR"}
          />
        </>
      )}

      {/* Dynamic Textarea */}

      {isSubtitleOn ? (
        <SubtitleComponent
          sentence={sentences[currentIndex]}
          writingStyle={languages[shortname.split("-")[0]]?.style || "LTR"}
        />
      ) : (
        <></>
      )}
      <Controller
        isTextChanged={isToRefetch}
        setIsTextChanged={setIsToRefetch}
        text={text}
        voices={voices}
        setCT={setCT}
      />
    </div>
  );
};

function SubtitleComponent({ sentence, writingStyle }) {
  return (
    <div
      className={`subtitle  p-3 fixed-position text-center`}
      style={{
        position: "fixed",
        bottom: "60px",
        right: "0px",
        backgroundColor: "#FFF9C4",
      }}
    >
      <span
        className=""
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "20px",
        }}
        dir={writingStyle}
      >
        {sentence}
      </span>
    </div>
  );
}

// import { FaVolumeUp, FaStar, FaStarHalfAlt, FaStarBorder } from 'react-icons/fa';

const WordMeaning = ({
  wordData,
  addToFavorites,
  removeFromFavorite,
  isFavorite,
}) => {
  const { settingOptions } = useColor();
  return (
    <div className="mt-4">
      {wordData && (
        <div className="card p-3 shadow-sm border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`word-title text-${settingOptions.color}`}>
                {wordData.word}
              </h2>
              {/* <p className="text-muted">
                Phonetics:{" "}
                <span className="text-primary">
                  {wordData.phonetics || "N/A"}
                </span>
              </p> */}
            </div>
            {/* Play Audio Button */}
            {/* {wordData.audio && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => new Audio(wordData.audio).play()}
              >
                <FontAwesomeIcon icon={faVolumeHigh} className="me-2" />
              </button>
            )} */}
          </div>

          <hr className={`border-${settingOptions.color}`} />

          {/* Meanings */}
          <div>
            <h5 className={`text-${settingOptions.color}`}>Meanings</h5>
            <ul className="list-group list-group-flush">
              {wordData.meanings.map((meaning, index) => (
                <React.Fragment key={"word-meaning" + index}>
                  <li key={index} className="list-group-item border-0 ps-0">
                    <strong>{meaning.partOfSpeech}:</strong>{" "}
                    {meaning.definitions.map((def) => (
                      <>
                        <div className="list-group-item border-0 ps-0">
                          {def.definition}
                        </div>
                      </>
                    ))}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="mt-3">
                        <h5 className={`text-${settingOptions.color}`}>
                          Synonyms
                        </h5>
                        <p className="text-muted">
                          {meaning.synonyms.join(", ")}
                        </p>
                      </div>
                    )}
                    {meaning.antonyms && meaning.antonyms.length > 0 && (
                      <div className="mt-3">
                        <h5 className={`text-${settingOptions.color}`}>
                          Antonyms
                        </h5>
                        <p className="text-muted">
                          {meaning.antonyms.join(", ")}
                        </p>
                      </div>
                    )}
                    <hr className={`border-${settingOptions.color}`} />
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* Synonyms */}

          {/* Favorite Button */}
          <div className="d-flex justify-content-end">
            <button
              className={`btn btn-outline-${settingOptions.color}`}
              onClick={() => {
                isFavorite
                  ? removeFromFavorite(wordData.word)
                  : addToFavorites(wordData.word, wordData.meanings);
              }}
            >
              {isFavorite ? (
                <FontAwesomeIcon icon={faStar} />
              ) : (
                <FontAwesomeIcon icon={faStartRegular} />
              )}{" "}
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage of the component

const DictionaryDialog = ({ setMode, isDictionaryLoading }) => {
  const { favoriteWords, addToFavoriteList, removeFromFavorite } = useUser();

  const { wordsWithMeanings } = useUser();

  const addToFavorites = (word, meaning) => {
    addToFavoriteList(word, meaning[0]?.definitions[0]?.definition);
  };

  if (isDictionaryLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container">
        <button
          className="btn btn-close border-0 shadow-none"
          onClick={() => setMode(false)}
        />
        {wordsWithMeanings.map((word, index) => (
          <React.Fragment key={"word" + index}>
            <WordMeaning
              wordData={word}
              addToFavorites={addToFavorites}
              isFavorite={
                favoriteWords.find((fav) => fav.word === word.word) || false
              }
              removeFromFavorite={removeFromFavorite}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const WordMeaningDialogBox = ({ word, wordsWithMeanings }) => {
  const { favoriteWords, addToFavoriteList, removeFromFavorite } = useUser();

  const addToFavorites = (word, meaning) => {
    addToFavoriteList(word, meaning[0]?.definitions[0]?.definition);
  };

  const wordMeaning = wordsWithMeanings.find(
    (wordMeaning) => wordMeaning.word === word
  );
  return (
    <div
      className="position-absolute bg-light border rounded p-2 shadow"
      style={{
        top: "-3rem", // Move tooltip above the word
        left: "50%", // Center tooltip horizontally
        transform: "translateX(-50%)",
        zIndex: 10,
        whiteSpace: "nowrap",
        // maxWidth: "200px", // Limit tooltip width
      }}
    >
      {wordMeaning && wordMeaning.meaning !== "NOT FOUND" ? (
        <>
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="fa fa-info-circle text-info me-2"
          />
          {wordMeaning.meanings[0]?.definitions[0]?.definition}
        </>
      ) : (
        <span>Meaning not found!</span>
      )}
    </div>
  );
};

export default App;
