import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBook } from "@fortawesome/free-solid-svg-icons";
import { useColor } from "../../../store/color.state";
import { useUser } from "../../../store/user.state";

const Dictionary = () => {
  const { favoriteWords } = useUser();

  const { settingOptions } = useColor();

  const [filteredWords, setFilteredWords] = useState(favoriteWords);

  console.log(favoriteWords);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = favoriteWords.filter((wordObj) =>
      wordObj.word.toLowerCase().includes(searchTerm)
    );
    setFilteredWords(filtered);
  };

  const handleClick = (wordObj) => {
    setSelectedWord(wordObj);
  };

  const handleClose = () => {
    setSelectedWord(null);
  };

  return (
    <div className="container my-4">
      <div className="card p-4 shadow controller-list">
        <h4 className="mb-4">
          <FontAwesomeIcon
            icon={faBook}
            className={`text-${settingOptions.color} me-2`}
          />
          Dictionary
        </h4>

        {/* Search Bar */}
        <div className={`input-group  mb-3`}>
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for a word..."
            onChange={handleSearch}
          />
        </div>

        {/* Word List */}
        <ul className="list-group">
          {filteredWords.length > 0 ? (
            filteredWords.map((wordObj, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleClick(wordObj)}
                style={{ cursor: "pointer" }}
              >
                {wordObj.word}
              </li>
            ))
          ) : (
            <p className="text-muted">No words found.</p>
          )}
        </ul>
      </div>

      {/* Modal for displaying word meaning */}
      {selectedWord && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedWord.word}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedWord.meaning}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
