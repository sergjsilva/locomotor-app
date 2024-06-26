import { examsData } from "../db/db.js";
import { messagesData } from "../db/messagesDb.js";
import {
  displayElement,
  hideElement,
  getQuestionById,
  formatCorrectAnswer,
  formatIncorrectAnswer,
  disableElement,
  enableElement,
  setCircleProgress,
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
    trackExam(QUESTION_NUMBER);
    trackUserScore(USER_SCORE);
    showQuestions(QUESTION_NUMBER);
  }
});

// The user selected an option
options.addEventListener("click", (event) => {
  const totalOptions = CURRENT_QUESTION.options.length;

  if (event.target.tagName === "BUTTON" || event.target.tagName == "SPAN") {
    const selectedOption = event.target.closest(".option");
    const selectedOptionName = selectedOption.getAttribute("name");

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
    if (QUESTION_NUMBER <= TOTAL_EXAM_QUESTIONS) {
      enableElement(nextBtn);
    } else {
      hideElement(nextBtn);
      displayElement(resultBtn);
      const grade = USER_SCORE / TOTAL_EXAM_QUESTIONS;
      setMessageFromGrade(grade);
    }
  }
});

resultBtn.addEventListener("click", (event) => {
  const mainCointainer = document.querySelector(".fixed-background");
  hideElement(mainCointainer);

  //Tells which exam user did
  const graphicMessage = document.querySelector(".graphic-header");
  const headerMessage = document.querySelector(".header-message");
  graphicMessage.textContent = headerMessage.textContent;

  const resultContainer = document.querySelector(".result-container");
  displayElement(resultContainer);

  const examContent = document.querySelector("#exam-content");
  hideElement(examContent);
  document.body.style.backgroundColor = "#fbfbfb";
  const scoreText = document.querySelector(".graphic-score-text");
  scoreText.textContent = `Has acertado ${USER_SCORE} de ${TOTAL_EXAM_QUESTIONS} preguntas`;
  /*drawResult();*/
});

function loadExam(examId) {
  QUESTION_NUMBER = 1;
  const keys = Object.keys(examsData); // keys=[exam01, exam02, ...]
  CURRENT_EXAM = examsData[keys[examId - 1]];

  //  TOTAL_EXAM_QUESTIONS = CURRENT_EXAM.length;
  TOTAL_EXAM_QUESTIONS = 5;

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

function setMessageFromGrade(grade) {
  const percentValue = grade * 100;
  console.log(percentValue);
  setCircleProgress(percentValue);

  let message = "";

  const score = grade * 10;

  if (score < 5) {
    message = messagesData.find((msg) => msg.grade === "reprovado");
  } else if (score >= 5 && score <= 7.9) {
    message = messagesData.find((msg) => msg.grade === "notable");
  } else if (score >= 8 && score <= 8.9) {
    message = messagesData.find((msg) => msg.grade === "sobresaliente");
  } else if (score >= 9 && score <= 10) {
    message = messagesData.find((msg) => msg.grade === "honor");
  } else {
    console.log("ERROR:: Invalid Data in function setMessageFromGrade!");
    return;
  }

  const titleMessage = document.querySelector(".result-title-message");
  const summaryMessage = document.querySelector(".result-summary");

  titleMessage.textContent = message.gradeText;
  summaryMessage.textContent = message.comment;
}
