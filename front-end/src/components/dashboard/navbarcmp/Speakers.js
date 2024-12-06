import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../../store/user.state";
import { getMatchedVoices, getResult, getUniqueItems } from "../../utils/utils";
import { useColor } from "../../../store/color.state";
import toast from "react-hot-toast";
import { useSpeakers } from "../../../store/speakers.state";

const Speakers = () => {
  const { voices, selectedCountryIndex } = useUser();
  const [selectedLanguage, setSelectedLanguage] =
    useState(selectedCountryIndex);
  const [mapper, setMapper] = useState([]);

  const uniqueLanguages = useMemo(() => {
    const result = getUniqueItems(voices);
    setMapper(result[1]);
    return result[0];
  }, [voices]);

  const [currentIndex, setCurrentIndex] = useState(null);

  const handlePlayBtn = (index) => {
    setCurrentIndex(index);
  };
  const handleItemSelect = (index) => {
    setSelectedLanguage(index);
    setCurrentIndex(false);
  };

  return (
    <>
      <div className="container">
        <select
          className="form-select p-1"
          value={selectedLanguage}
          onChange={(e) => handleItemSelect(e.target.value)}
        >
          {uniqueLanguages.map((language, index) => {
            return (
              <option key={index + "language"} value={index}>
                {language}
              </option>
            );
          })}

          {/* <option value="en-US">English (United States)</option>
          <option value="en-GB">English (United Kingdom)</option>
          <option value="es-ES">Spanish (Spain)</option>
          <option value="es-MX">Spanish (Mexico)</option>
          <option value="fr-FR">French (France)</option>
          <option value="fr-CA">French (Canada)</option> */}
        </select>

        <div className="row">
          {getMatchedVoices(
            mapper[Number(selectedLanguage)],
            mapper[Number(selectedLanguage) + 1] || voices.length,
            voices
          ).map((voice, index) => (
            <Speaker
              voice={voice}
              flagUrl={"https://robohash.org/united_states_or_gender.png"}
              key={index + "voices"}
              handleBtn={handlePlayBtn}
              index={index}
              ci={currentIndex}
            />
          ))}
        </div>
      </div>
    </>
  );
};
const Speaker = ({ voice, flagUrl, handleBtn, index, ci }) => {
  const { settingOptions } = useColor();
  const { bookMarkedSpeakers, setBookMarkedSpeakers } = useSpeakers();

  const handleBookMark = (speaker) => {
    const r = setBookMarkedSpeakers(speaker, bookMarkedSpeakers);
    if (r === -1) {
      toast.success("Removed from the favorite list.");
    } else {
      toast.success("Added to the favorite list.");
    }
  };
  return (
    <div className="col-md-6 speaker">
      <div className={`voice-card m-1`}>
        <img className="voice-avatar" src={flagUrl} alt="not found" />
        <div className="info-section">
          <div className={`speaker-name text-${settingOptions.color}`}>
            {voice.privDisplayName}
          </div>
          <p className="mb-1 text-muted">
            {voice.privGender === 1 ? "Female" : "Male"}
          </p>
          <p className="mb-1">
            <span className="badge bg-light text-dark border">
              {getResult(voice.privLocaleName, voice.privLocale)}
            </span>
          </p>
          <p className="styles-text">{voice.privStyleList.length} Style</p>
        </div>
        <div className="d-flex flex-column gap-1">
          <button
            className={`btn btn-outline-${settingOptions.color}`}
            onClick={() => handleBtn(index)}
          >
            <FontAwesomeIcon
              icon={index === ci ? faPause : faPlay}
              className="play-icon"
            />
          </button>
          <button
            className={`btn ${
              bookMarkedSpeakers.includes(voice.privShortName)
                ? `btn-${settingOptions.color}`
                : `btn-outline-${settingOptions.color}`
            }`}
            onClick={() => handleBookMark(voice.privShortName)}
          >
            <FontAwesomeIcon icon={faBookmark} className="" />
          </button>
        </div>
      </div>
    </div>

    // <div className="col-md-6">
    //   <div className="voice-card d-flex align-items-start">

    //     <div className="info-section ms-3">
    //       <h6 className="mb-1">Andrew Mulligan</h6>
    //       <p className="mb-1 text-muted">Male</p>
    //       <p className="mb-1">
    //         <span className="badge bg-light text-dark border">
    //           <i className="fas fa-globe"></i> English (United States) +90
    //         </span>
    //       </p>
    //       <p className="styles-text">
    //         <i className="fas fa-swatchbook"></i> 3 styles
    //       </p>
    //       <p className="description">
    //         A warm, engaging voice that sounds like someone you want to know,
    //         perfect for...
    //       </p>
    //     </div>

    //     <button className="btn btn-outline-primary">
    //       <FontAwesomeIcon icon={faPlay} className="play-icon" />
    //     </button>
    //   </div>
    // </div>
  );
};

export default Speakers;
