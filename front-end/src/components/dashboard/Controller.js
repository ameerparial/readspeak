import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRotateRight,
  faRotateLeft,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import List from "./ShowList";
import { useState, useRef, useEffect } from "react";
import SpeedMeter from "./SpeedMeter";
import { useColor } from "../../store/color.state";
import { useUser } from "../../store/user.state";
import { useTTSStore } from "../../store/tts.service";
import toast from "react-hot-toast";
const Controller = ({
  isTextChanged,
  setIsTextChanged,
  text,
  voices,
  setCT,
}) => {
  const [showSpeaker, setShowSpeaker] = useState(false);
  const [showSpeedMeter, setShowSpeedMeter] = useState(false);

  const audioRef = useRef(null);
  const [duration, setDuration] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [preTime, setPreTime] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [speed, setSpeed] = useState(1);

  const { shortname } = useUser();
  const {
    sentences,
    audioCache,
    addAudiosToCache,
    currentIndex,
    togglePlaying,
    setCurrentIndex,
    isPlaying,
    fetchSentenceAudio,
    currentText,
    setCurrentText,
  } = useTTSStore();

  const { settingOptions, getHexaCode } = useColor();

  useEffect(() => {
    const isChanged = text.trim() === currentText.trim() ? false : true;
    // console.log("Am I called to interupt the erro");
    setIsTextChanged(isChanged);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const playAudio = async (index) => {
    if (index < sentences.length) {
      const sentence = sentences[index];
      console.log(audioCache[sentence]?.wordTimings);
      // console.log("Now I will read the sentence: at index", index);
      // console.log(sentence);
      // console.log(audioCache);
      if (sentence === "\n") {
        setCurrentIndex(index + 1);
        playAudio(index + 1);
        console.log("Ignoreing the \n");
        return;
      }
      // console.log(audioCache);

      // Check if audio is cached
      let audioUrl = audioCache[sentence]?.audioUrl;
      // const audio = new Audio(audioUrl);
      // audio.play();
      if (!audioUrl) {
        console.log("Invalid Audio Format");
        // Setting text changed to true to refetch.
        togglePlaying(false);
        setIsTextChanged(true);
        return;
      }

      // Set the audio source
      if (audioRef.current?.src !== audioUrl) {
        audioRef.current.src = audioUrl;
      }
      // // Start playing
      audioRef.current.playbackRate = speed;
      audioRef.current.play().catch((err) => {
        console.log("Error whiling playing or resuming the audio");
        console.log(err);
      });
    } else {
      togglePlaying(false);
      setCurrentIndex(0);
      setPreTime(0);
    }
  };

  const togglePlayPause = async () => {
    // First Time
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // console.log("is text changed", isTextChanged);

    if (isTextChanged) {
      // Fetch audios
      console.log(isTextChanged + "  text changed");
      await fetchAllAudios(sentences, shortname);
      setCurrentText(trimmedText);
      // Playing the first audio
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        togglePlaying(false);
      } else {
        playAudio(currentIndex);
      }
      getTotalTimeDuration();
    }
  };

  const fetchAllAudios = async () => {
    // I have to fetch the audio in two cases:
    // 1. When the sentence is not there in cache.
    // 2. There is sentence but shortname is different (changed)
    try {
      setIsLoading(true);
      console.log("Fetching all Audios....");
      const audios = { ...audioCache };

      const fetchedPromises = sentences.map(async (sentence) => {
        if (sentence === "\n") return;
        if (
          !audioCache[sentence] ||
          (audioCache[sentence] && audioCache[sentence].shortname !== shortname)
        ) {
          const responseData = await fetchSentenceAudio(sentence, shortname);
          audios[sentence] = {
            audioUrl: responseData.audioUrl,
            shortname,
            duration: responseData.duration,
            wordTimings: responseData.wordTimings,
          };
        }
        // Audio will not fetched if the same speaker is there in cache.
      });

      await Promise.all(fetchedPromises)
        .then(() => {
          // If fetched audios then, add it to the cache.
          addAudiosToCache({ ...audioCache, ...audios });
          console.log("All audios have been fetched and cached.");
          // Playing the first Audio;
          console.log("Playing audio at index: ", currentIndex);
          // When all the audios are fetched:

          if (currentIndex >= sentences.length - 1) {
            setCurrentIndex(0);
            audioRef.current.src = audios[sentences[0]].audioUrl;
            audioRef.current.play();
          } else if (audios[sentences[currentIndex]]) {
            console.log("Playing the first audio...");
            audioRef.current.src = audios[sentences[currentIndex]].audioUrl;
            audioRef.current.play();
          }
          setIsTextChanged(false);
        })
        .catch((err) => {
          console.log("Error occured in promise.all");
          toast.error("Could not convert the text due to low internet");
          togglePlaying(false);
          setIsTextChanged(true);
        });
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalTimeDuration = () => {
    console.log("settiing durtion");
    let duration = 0;
    sentences.forEach((sentence) => {
      if (sentence !== "\n" && audioCache[sentence]) {
        duration += audioCache[sentence].duration;
      }
    });
    setDuration(duration);
  };

  const handleAudioEnd = () => {
    console.log("Ending the text..");
    if (currentIndex + 1 < sentences.length) {
      const dur = audioCache[sentences[currentIndex]]?.duration;
      if (dur) {
        setPreTime((t) => t + dur);
      }

      setCurrentIndex(currentIndex + 1);
      playAudio(currentIndex + 1);
      // When previous audio is finished.
    }
  };

  function changeTime(seconds) {
    function addExtra(number) {
      const r = number < 10 ? "0" + number : "" + number;
      return r;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingS = Math.floor(seconds - minutes * 60);
    return `${addExtra(minutes)}:${addExtra(remainingS)}`;
  }

  const handleList = () => {
    if (isPlaying) {
      return;
    }
    setShowSpeaker(!showSpeaker);
  };
  const handleSpeedMeter = () => {
    setShowSpeedMeter(!showSpeedMeter);
    setShowSpeaker(false);
  };

  const onBackBtn = () => {
    if (!isPlaying) return;
    const previous = findPreSentence(currentIndex);
    if (previous !== -1) {
      // On previous click:
      const nextSentence = sentences[currentIndex];
      console.log("Sub dur of ");
      console.log(nextSentence);

      const duration = audioCache[nextSentence]?.duration;
      console.log(duration);
      if (duration) {
        setPreTime((t) => {
          const time = Number(t - duration);
          if (time < 0) return 0;
          else return time;
        });
      }

      setCurrentIndex(previous);
      playAudio(previous);
    } else {
      toast("Reached at the start", {
        duration: 1000,
        style: {
          border: "1px solid black",
          padding: "5px",
        },
      });
    }
  };
  const findPreSentence = (curIndex) => {
    const nextIndex = curIndex - 1;
    if (nextIndex < sentences.length) {
      if (sentences[nextIndex] === "\n") {
        return findPreSentence(nextIndex);
      }
      return nextIndex;
    }
    return -1;
  };

  const findNextSentence = (curIndex) => {
    const nextIndex = curIndex + 1;
    if (nextIndex < sentences.length) {
      if (sentences[nextIndex] === "\n") {
        return findNextSentence(nextIndex);
      }
      return nextIndex;
    }
    return -1;
  };
  const onNextBtn = () => {
    if (!isPlaying) return;
    const nextIndex = findNextSentence(currentIndex);
    if (nextIndex !== -1) {
      const preSentence = sentences[currentIndex];
      const duration = audioCache[preSentence]?.duration;
      if (duration) {
        setPreTime((t) => t + duration);
      }

      setCurrentIndex(nextIndex);
      playAudio(nextIndex);
    } else {
      toast("Reached at the end", {
        duration: 1000,
        style: {
          border: "1px solid black",
          padding: "5px",
        },
      });
    }
  };

  const handleTimeUpdate = () => {
    const audioTime = Number(audioRef.current.currentTime);
    const totalCurrentTime = audioTime + preTime;
    setCurrentTime(totalCurrentTime);

    setCT(audioTime);

    const coveredWidth = (totalCurrentTime / duration) * 100;
    document.getElementById("tracker").style.width = coveredWidth + "%";
  };

  return (
    <>
      <div
        className={`${
          showSpeaker || showSpeedMeter
            ? "position-absolute top-0 start-0 w-100 h-100"
            : "d-none"
        }`}
        onClick={() => {
          setShowSpeaker(false);
          setShowSpeedMeter(false);
        }}
      ></div>

      <div className="fixed-bottom bottombar border">
        <div
          className={`${isPlaying ? "tracker-container" : "d-none"}`}
          style={{ height: "1.75px" }}
        >
          <span className="timer">
            {changeTime(currentTime)}/{changeTime(duration)}
          </span>
          <div
            className={"tracker"}
            style={{ height: "inherit", width: "0%" }}
            id="tracker"
          />
          <audio
            ref={audioRef}
            onEnded={handleAudioEnd}
            onPlay={() => {
              togglePlaying(true);
              getTotalTimeDuration();
            }}
            onTimeUpdate={handleTimeUpdate}
            type="audio/wav"
            className="d-none"
          />
        </div>

        <ul className="nav justify-content-center">
          <div className="controller gap-md-5 gap-3">
            {/* Image */}
            <div className="wrapper">
              <img
                src="https://via.placeholder.com/150"
                className="rounded-circle border shadow-lg imgSpeed"
                alt="Not Found"
                onClick={handleList}
              />
              <div className="show-onclick">
                {showSpeaker && (
                  <List
                    list={voices}
                    handleList={handleList}
                    color={settingOptions.color}
                    getHexaCode={getHexaCode}
                  />
                )}
              </div>
            </div>
            <FontAwesomeIcon
              icon={faRotateLeft}
              className="icon"
              onClick={onBackBtn}
            />
            {isLoading ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="fa-spinner fa-spin icon playpause"
                aria-hidden="true"
                style={{ animationDuration: "1s" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                className={`icon playpause`}
                onClick={togglePlayPause}
                aria-disabled={true}
              />
            )}

            <FontAwesomeIcon
              icon={faRotateRight}
              className="icon"
              onClick={onNextBtn}
            />
            {/* Speed Meter */}
            <div className="wrapper">
              <div className="imgSpeed" onClick={handleSpeedMeter}>
                {speed}x
              </div>
              <div className="show-onclick" style={{ right: "0px" }}>
                {showSpeedMeter && (
                  <SpeedMeter
                    handleSpeedShow={handleSpeedMeter}
                    color={settingOptions.color}
                    speed={speed}
                    changeSpeed={setSpeed}
                  />
                )}
              </div>
            </div>
          </div>
        </ul>
      </div>
    </>
  );
};
export default Controller;
