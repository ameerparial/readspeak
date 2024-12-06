import { useMemo, useRef, useState } from "react";
import { useUser } from "../../store/user.state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as afterClick,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as beforeClick } from "@fortawesome/free-regular-svg-icons";
import {
  getMatchedVoices,
  getSpeakerDetails,
  getUniqueItems,
  indexOfCountryList,
} from "../utils/utils";
import { useSpeakers } from "../../store/speakers.state";
import { useTTSStore } from "../../store/tts.service";

const List = ({ handleList, color }) => {
  const {
    voices,
    selectedCountryIndex,
    setSelectedCountryIndex,
    shortname,
    setShortname,
  } = useUser();
  const { bookMarkedSpeakers } = useSpeakers();
  const [isToShowBookMarked, setIsToShowBookMarked] = useState(false);
  const [mapper, setMapper] = useState([]);
  const inputRef = useRef(null);

  const [isSearchOn, setIsSearchOn] = useState(false);
  const [searchFilter, setSearchFilter] = useState([]);
  const [value, setValue] = useState(false);
  const { setIsToRefetch } = useTTSStore();

  const unique = useMemo(() => {
    const result = getUniqueItems(voices);
    setMapper(result[1]);
    return result[0];
  }, [voices]);

  const handleSearchSpeaker = (event) => {
    const enterValue = event.target.value.trim();
    setValue(enterValue);
    if (!enterValue) {
      // setSearchFilter(getMatchedVoices(0, 50, voices));
      return;
    }
    setSearchFilter(
      voices.filter((voice) =>
        voice.privDisplayName.toLowerCase().includes(enterValue.toLowerCase())
      )
    );
  };
  const handleSpeakerClick = (speaker) => {
    setShortname(speaker.privShortName);
    if (isSearchOn || isToShowBookMarked)
      setSelectedCountryIndex(indexOfCountryList(speaker, unique));

    setIsToRefetch(true);
    handleList();
  };
  const handleCloseSearch = () => {
    setIsSearchOn(false);
    setValue(false);
  };

  return (
    <div
      className="shadow-lg border rounded scroll-parent-width controller-list"
      style={{ zIndex: "5" }}
    >
      <div className="d-flex justify-content-between align-items-center separator">
        <h5>Voices</h5>
        <button className="btn btn-close" onClick={handleList} />
      </div>
      <div className="d-flex align-items-center gap-3 separator">
        {/* select and input */}
        {isSearchOn ? (
          <div className={`d-flex align-items-center position-relative w-100`}>
            <input
              type={"text"}
              ref={inputRef}
              className="form-control"
              placeholder="Search Voice"
              onChange={handleSearchSpeaker}
            />
            <FontAwesomeIcon
              icon={faClose}
              className="position-absolute color-change"
              style={{ right: "10px" }}
              onClick={handleCloseSearch}
            />
          </div>
        ) : (
          <select
            className="form-control form-select"
            value={selectedCountryIndex}
            onChange={(e) => {
              setSelectedCountryIndex(e.target.value);
              setIsToShowBookMarked(false);
            }}
          >
            {unique.map((country, index) => (
              <option key={index + "speakers"} value={index}>
                {country}
              </option>
            ))}
          </select>
        )}

        <FontAwesomeIcon
          icon={faSearch}
          className={`${isSearchOn ? "d-none" : "d-block color-change"}`}
          onClick={() => {
            setIsSearchOn(true);
            setIsToShowBookMarked(false);
            // setSearchFilter(getMatchedVoices(0, 50, voices));
            // Set Focus
          }}
        />

        <FontAwesomeIcon
          className="color-change"
          icon={isToShowBookMarked ? afterClick : beforeClick}
          onClick={() => setIsToShowBookMarked((state) => !state)}
        />
      </div>
      {/* Content Render */}
      <div className="scrollable-container">
        {isToShowBookMarked ? (
          <>
            {bookMarkedSpeakers.map((voice, index) => (
              <Speaker
                key={index + "sbookmarkedspeaker"}
                speaker={getSpeakerDetails(voices, voice)}
                color={color}
                onClick={handleSpeakerClick}
                shortname={shortname}
              />
            ))}
          </>
        ) : (
          <>
            {value ? (
              <>
                {searchFilter.map((voice, index) => (
                  <Speaker
                    key={index + "speaker"}
                    speaker={voice}
                    color={color}
                    onClick={handleSpeakerClick}
                    shortname={shortname}
                  />
                ))}
              </>
            ) : (
              <>
                {getMatchedVoices(
                  mapper[Number(selectedCountryIndex)],
                  mapper[Number(selectedCountryIndex) + 1] || voices.length,
                  voices
                ).map((voice, index) => (
                  <Speaker
                    key={index + "speaker"}
                    speaker={voice}
                    color={color}
                    onClick={handleSpeakerClick}
                    shortname={shortname}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Speaker = ({ speaker, color, onClick, shortname }) => {
  const speakerName = speaker.privDisplayName;
  const displayName =
    speakerName.length > 10 ? speakerName.slice(0, 10) + "..." : speakerName;

  const completeNameLan = speaker.privLocaleName;
  const language = completeNameLan.substring(0, completeNameLan.indexOf("("));
  return (
    <div
      className={`voice-card ${
        speaker.privShortName === shortname && "active"
      } d-flex justify-content-between align-items-center m-2`}
      onClick={() => onClick(speaker)}
    >
      <div className="d-flex gap-1">
        <img
          className="rounded-circle speaker-image"
          src={"https://via.placeholder.com/150"}
          style={{ width: "25px", height: "25px" }}
          alt="No profile"
        />
        <div className="d-flex gap-1">
          <span className="style-text">{displayName}</span>
          <span className={`style-text text-${color}`}>{language}</span>
        </div>
      </div>
    </div>
  );
};

export default List;
