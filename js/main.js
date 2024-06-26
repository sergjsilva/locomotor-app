import { examsData } from "../db/db.js";
import {
  displayElement,
  hideElement,
  getQuestionById,
  formatCorrectAnswer,
  formatIncorrectAnswer,
  disableElement,
  enableElement,
} from "./utility.js";

// HTML Queries
const examGrid = document.querySelector("#grid-of-exams");
const nextBtn = document.querySelector(".next-btn");
const resultBtn = document.querySelector(".result-btn");
const options = document.querySelector(".exam-options");

// -- Global Variables
let CURRENT_EXAM = [];
let QUESTION_NUMBER = 0;
let CURRENT_QUESTION = {};
let TOTAL_EXAM_QUESTIONS = 0;
let USER_SCORE = 0;
let CURRENT_QUESTION_INDEX = 0;
let ARRAY_OF_QUESTION_INDEX = Array.from({ length: 28 }, (v, i) => i);

examGrid.addEventListener("click", (event) => {
  const examId = event.target.getAttribute("value");
  loadExam(examId);

  const examContent = document.querySelector("#exam-content");
  const initialMessage = document.querySelector(".exam-message");
  const headerMessage = document.querySelector(".header-message");
  headerMessage.textContent = event.target.getAttribute("message");
  headerMessage.classList.remove("text-success");
  headerMessage.classList.add("text-light");

  hideElement(initialMessage);
  hideElement(examGrid);
  hideElement(resultBtn);
  displayElement(examContent);
});

nextBtn.addEventListener("click", (event) => {
  if (QUESTION_NUMBER <= TOTAL_EXAM_QUESTIONS) {
    //hideElement(nextBtn);

    trackExam(QUESTION_NUMBER);
    trackUserScore(USER_SCORE);
    showQuestions(QUESTION_NUMBER);
  } else {
    hideElement(nextBtn);
    displayElement(resultBtn);
  }
});

// The user selected an option
options.addEventListener("click", (event) => {
  const totalOptions = CURRENT_QUESTION.options.length;

  if (event.target.tagName === "BUTTON" || event.target.tagName == "SPAN") {
    const selectedOption = event.target.closest(".option");
    const selectedOptionName = selectedOption.getAttribute("name");

    console.log("CORRECT: " + CURRENT_QUESTION.correctAnswer);
    console.log("SELECTED: " + selectedOptionName);

    if (selectedOptionName === CURRENT_QUESTION.correctAnswer) {
      USER_SCORE++;
      trackUserScore(USER_SCORE);
      formatCorrectAnswer(selectedOption);
    } else {
      formatIncorrectAnswer(selectedOption);
      for (let i = 0; i < totalOptions; i++) {
        if (
          options.children[i].getAttribute("name") ===
          CURRENT_QUESTION.correctAnswer
        ) {
          formatCorrectAnswer(options.children[i]);
        }
      }
    }

    for (let i = 0; i < totalOptions; i++) {
      disableElement(options.children[i]);
    }
    if (CURRENT_QUESTION_INDEX < TOTAL_EXAM_QUESTIONS) {
      enableElement(nextBtn);
    } else {
      resultBtn.classList.remove("btn-secondary");
      resultBtn.classList.add("btn-success");
      resultBtn.style.visibility = "visible";
      nextBtn.style.visibility = "hidden";
      const grade = (USER_SCORE / TOTAL_EXAM_QUESTIONS) * 10;
      getMessageFromScore(grade);
    }
  } else {
    console.log("NOT CLICKED");
  }
});

function loadExam(examId) {
  QUESTION_NUMBER = 1;
  const keys = Object.keys(examsData); // keys=[exam01, exam02, ...]
  CURRENT_EXAM = examsData[keys[examId - 1]];

  TOTAL_EXAM_QUESTIONS = CURRENT_EXAM.length;

  trackExam(QUESTION_NUMBER);
  trackUserScore(USER_SCORE);
  showQuestions(QUESTION_NUMBER);
}

function trackUserScore(score) {
  const userScoreText = document.querySelector(".user-score");
  userScoreText.textContent = `Acertos: ${score}/${TOTAL_EXAM_QUESTIONS}`;
}

function trackExam(questionNumber) {
  const examTrack = document.querySelector(".exam-track");
  examTrack.textContent = `Pregunta ${QUESTION_NUMBER} de ${TOTAL_EXAM_QUESTIONS}`;
}

function showQuestions(questionNumber) {
  //let id = ARRAY_OF_QUESTION_INDEX[currentId];

  CURRENT_QUESTION = getQuestionById(CURRENT_EXAM, questionNumber);
  const totalOptions = CURRENT_QUESTION.options.length;

  const optionNames = ["A", "B", "C", "D", "E", "F"];
  let optTags = [];

  for (let i = 0; i < totalOptions && i < optionNames.length; i++) {
    optTags.push(`<button class="option text-start mb-3 btn btn-outline-secondary" name=${optionNames[i]}>
                <span>${optionNames[i]}. ${CURRENT_QUESTION.options[i]}
              </button>`);
  }

  const examTitle = document.querySelector(".exam-title");

  examTitle.textContent = `${QUESTION_NUMBER}. ${CURRENT_QUESTION.text}`;
  QUESTION_NUMBER++;

  options.innerHTML = optTags.join("");
  disableElement(nextBtn);

  // Change the content
  //questionText.textContent = `${counterVal}. ${CURRENT_QUESTION.text}`;
  //optionContainer.innerHTML = optTag;

  //resultBtn.style.visibility = "hidden";
}
