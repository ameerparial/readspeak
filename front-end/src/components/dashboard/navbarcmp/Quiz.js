import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../store/user.state";

const QuizComponent = ({}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [quizEnded, setQuizEnded] = useState(false);

  const { generateQuiz, favoriteWords } = useUser();
  const [quizData, setQuiz] = useState([]);

  useEffect(() => {
    const quizData = generateQuiz(favoriteWords);
    console.log(quizData);
    setQuiz(quizData);
    // console.log(quizData);
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const correctAnswer = quizData[currentQuestion].correctAnswer;
    if (selectedOption === correctAnswer) {
      setScore(score + 1);
      setToastMessage("Correct answer!");
    } else {
      setToastMessage("Wrong answer!");
    }

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null); // Reset the selected option for the new question
      } else {
        setQuizEnded(true); // End quiz when questions are completed
      }
    }, 2000); // Wait for 2 seconds before moving to the next question
  };

  if (quizEnded) {
    return (
      <>
        <div className="container mt-5 text-center d-flex flex-column">
          <h2>Quiz Finished!</h2>
          <p>
            Your final score is: {score} / {quizData.length}
          </p>

          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-success fa-2x"
          />
          <button
            className="btn btn-primary mt-3 m-auto"
            onClick={() => window.history.back()}
            style={{ width: "200px" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Move to Dashboard
          </button>
        </div>
      </>
    );
  }

  const question = quizData[currentQuestion];
  if (!question) {
    return (
      <>
        <h1>Could not Generate the Quiz!</h1>
        <button
          className="btn btn-primary m-1"
          onClick={() => window.history.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </button>
      </>
    );
  }

  return (
    <div className="container mt-5">
      <button
        className="btn btn-primary m-1"
        onClick={() => window.history.back()}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
      </button>
      <div className="card shadow-lg p-4">
        <div className="card-body">
          {/* Display the question */}
          <h5 className="card-title mb-4">{`Question ${currentQuestion + 1}: ${
            question.question
          }`}</h5>

          {/* Display the options */}
          <div className="list-group">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`list-group-item list-group-item-action ${
                  selectedOption === option ? "active" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Show the next button */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={handleNextQuestion}
              disabled={!selectedOption} // Disable if no option selected
            >
              Next Question
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </button>
            {/* Add to favorites icon */}
          </div>
        </div>
      </div>

      {/* Toast for correct or wrong answer */}
      {showToast && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div
            className={`toast show bg-${
              toastMessage === "Correct answer!" ? "success" : "danger"
            } text-white`}
          >
            <div className="toast-body">
              {toastMessage}
              <FontAwesomeIcon
                icon={
                  toastMessage === "Correct answer!"
                    ? faCheckCircle
                    : faTimesCircle
                }
                className="ms-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const quizData = [
  {
    question: "What is the meaning of 'benevolent'?",
    options: [
      "Well-meaning and kindly",
      "Difficult to find, catch, or achieve",
      "Fond of company",
      "Incapable of producing any useful result",
    ],
    correctOption: "Well-meaning and kindly",
  },
  {
    question: "What is the meaning of 'candid'?",
    options: [
      "Truthful and straightforward",
      "Arrogantly superior and disdainful",
      "Difficult to find, catch, or achieve",
      "About to happen",
    ],
    correctOption: "Truthful and straightforward",
  },
  // Add more questions here...
];

export default QuizComponent;
