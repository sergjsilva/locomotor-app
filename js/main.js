// User's Data declaration
class UserData {
  constructor() {
    this.load();
  }

  load() {
    let loadedData =
      JSON.parse(sessionStorage.getItem("userSessionData")) || {};
    this.hasFinished = loadedData.hasFinished || false;
    this.questionsBank = loadedData.questionsBank || [];
    this.numberOfQuestions = loadedData.numberOfQuestions || 0;
    this.examID = loadedData.examID || 0;
    this.shouldRepeatExam = loadedData.shouldRepeatExam || false;
    this.currentQuestionNumber = loadedData.currentQuestionNumber || 0;
    this.targetQuestionNumber = loadedData.targetQuestionNumber || 0; // integer
    this.userScore = loadedData.userScore || 0; // integer
    this.currentQuestion = loadedData.currentQuestion || {}; // object
    this.currentExam = loadedData.currentExam || []; // array of objects
    this.userAnswers = loadedData.userAnswers || []; // array of chars
  }

  save() {
    sessionStorage.setItem("userSessionData", JSON.stringify(this));
  }

  setExamID(id) {
    this.examID = id;
    this.save();
  }

  setNumberOfQuestions(val) {
    this.numberOfQuestions = val;
    this.save();
  }
  setShouldRepeat(val) {
    this.shouldRepeatExam = val;
    this.save();
  }

  setCurrentQuestionNumber(n) {
    this.currentQuestionNumber = n;
    this.save();
  }

  setTargetQuestionNumber(n) {
    this.targetQuestionNumber = n;
    this.save();
  }

  setUserScore(val) {
    this.userScore = val;
    this.save();
  }

  setCurrentQuestion(question) {
    this.currentQuestion = question;
    this.save();
  }

  setCurrentExam(exam) {
    this.currentExam = exam;
    this.save();
  }
  setUserAnswer(answers) {
    this.userAnswers = answers;
    this.save();
  }
  setHasFinished(val) {
    this.hasFinished = val;
    this.save();
  }
}

// Initialize global userData
let userData = new UserData();

// Button that controls number of question
const buttonGroup = document.querySelectorAll(".dropdown-item");

// Group of
const examGroup = document.querySelectorAll(".clickable");

// Group of options
const optionsContainer = document.querySelector(".choice");

// Example exams data
const baseURL = "https://sergjsilva.github.io/anatomia-general-exam-data/";
const examList = [
  {
    id: 1,
    name: "Aparato Motor Inferior",
    url: `${baseURL}exam01.json`,
    questions: 28,
  },
  {
    id: 2,
    name: "Aparato Motor Superior",
    url: `${baseURL}exam02.json`,
    questions: 150,
  },
  {
    id: 3,
    name: "Aparato Motor Inferior",
    url: `${baseURL}exam03.json`,
    questions: 30,
  },
];

const forwardBtn = document.querySelector(".right-arrow");
const backwardBtn = document.querySelector(".left-arrow");
const finalResultContainer = document.querySelector(".final-result");
const viewResultIcon = document.querySelector("#view-results");
const loader = document.querySelector("#loader");
const repeatBtn = document.querySelector("#repeat-button");
const reloadBtn = document.querySelector("#reload-button");
const exitBtn = document.querySelector("#exit-test");
// --------------------
// Variables
// --------------------

const NOT_ANSWERED = "z";

// Should run the program if user's selected the number of questions
let hasSelectedNumOfQuestion = false;
//let numberOfQuestions = 0;
let examQuestionBank = [];
let currentExam = [];

// // Keep track of this quiz variables
// let currentQuestionNumber = 0; // Tracks the current question number
// let targetQuestionNumber = 0; // Tracks the question user wants to show

// let userScore = 0;
// let currentQuestion = {};
//let userAnswers = [];

// ------------------
// Helper Functions
// ------------------
function isButtonActive(element) {
  return element.classList.contains("btn-light");
}

function getButtonByName(nameValue) {
  return optionsContainer.querySelector(`button[name="${nameValue}"]`);
}

function createArray(sizeofArray) {
  return Array.from({ length: sizeofArray }, (_, i) => i + 1);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
  return array;
}

function createQuestionsArray(
  totalQuestionsInDatabase,
  totalOfQuestionsOnMyExam
) {
  // Create an array with all IDs
  let arrayWithAllIds = createArray(totalQuestionsInDatabase);

  // Shuffled array
  let shuffledArray = shuffleArray(arrayWithAllIds);

  // Seleciona os IDs do array embaralhado
  return shuffledArray.slice(0, totalOfQuestionsOnMyExam);
}

function updateQuizScoreInfo() {
  const currentQuestText = document.querySelector("#ques-left");
  const currentScoreText = document.querySelector("#score");

  currentQuestText.textContent = `Pregunta: ${userData.targetQuestionNumber}/${userData.numberOfQuestions}`;
  currentScoreText.textContent = `Acertos: ${userData.userScore}`;
}

function toggleArrowState(button, action) {
  if (action === "activate") {
    button.classList.remove("deactivated");
    button.classList.add("activated");
  } else if (action === "deactivate") {
    button.classList.remove("activated");
    button.classList.add("deactivated");
  }
}

function disableElement(element) {
  element.disabled = true;
}

function formatCorrectAnswer(element) {
  if (isButtonActive(element)) {
    element.classList.remove("btn-light");
    element.classList.add("btn-success");
  }
}

function formatIncorrectAnswer(element) {
  if (isButtonActive(element)) {
    element.classList.remove("btn-light");
    element.classList.add("btn", "btn-danger");
  }
}

function handleSelectedOption(answer, buttonPressed, isTakingTest) {
  const numberOfOptions = userData.currentQuestion.options.length;

  if (answer === userData.currentQuestion.correctAnswer) {
    if (isTakingTest) {
      userData.userScore++;
      userData.save();
    }
    updateQuizScoreInfo();
    formatCorrectAnswer(buttonPressed);
  } else {
    formatIncorrectAnswer(buttonPressed);
    // Loop through all questions to find the correct one
    for (let i = 0; i < numberOfOptions; i++) {
      const checkThisOption = optionsContainer.children[i].getAttribute("name");
      if (checkThisOption === userData.currentQuestion.correctAnswer) {
        formatCorrectAnswer(optionsContainer.children[i]);
      }
    } // end for
  } // end else

  // Disable all elements
  for (let i = 0; i < numberOfOptions; i++) {
    disableElement(optionsContainer.children[i]);
  }

  if (userData.targetQuestionNumber < userData.numberOfQuestions) {
    toggleArrowState(forwardBtn, "activate");
  } else {
    toggleArrowState(forwardBtn, "deactivate");
  }
}

function hasUserAnsweredAllQuestions() {
  return !userData.userAnswers.includes(NOT_ANSWERED);
}

// --------------
// Functions
// --------------
function handleForwardButton(questionNumber) {
  if (
    questionNumber === userData.currentQuestionNumber && // we are in current question
    userData.userAnswers[questionNumber - 1] === NOT_ANSWERED // current question was not answered
  ) {
    toggleArrowState(forwardBtn, "deactivate");
  } else {
    toggleArrowState(forwardBtn, "activate");
  }
}

function handleBackwardButton(questionNumber) {
  if (questionNumber > 1) {
    toggleArrowState(backwardBtn, "activate");
  } else {
    toggleArrowState(backwardBtn, "deactivate");
  }
}

function showQuestion(number) {
  const introContainer = document.querySelector(".intro-container");
  const quizContainer = document.querySelector(".quiz-container");

  introContainer.hidden = true;
  quizContainer.hidden = false;
  loader.hidden = true;

  updateQuizScoreInfo();

  handleForwardButton(userData.targetQuestionNumber);

  handleBackwardButton(number);

  // Find question text at quiz box
  const questionText = document.querySelector(".question");

  userData.setCurrentQuestion(userData.currentExam[number - 1]);

  const numberOfOptions = userData.currentQuestion.options.length;
  const optionIcon = [
    `<img src="./assets/option-a-circle.svg" width="32" height="32">`,
    `<img src="./assets/option-b-circle.svg" width="32" height="32">`,
    `<img src="./assets/option-c-circle.svg" width="32" height="32">`,
    `<img src="./assets/option-d-circle.svg" width="32" height="32">`,
    `<img src="./assets/option-e-circle.svg" width="32" height="32">`,
    `<img src="./assets/option-f-circle.svg" width="32" height="32">`,
  ];
  const optionNames = ["A", "B", "C", "D", "E", "F"];
  let optTags = [];

  for (let i = 0; i < numberOfOptions && i < optionNames.length; i++) {
    optTags.push(
      `<button class="option text-start mb-2 btn btn-light" name=${optionNames[i]}>
                <span>${optionIcon[i]} ${userData.currentQuestion.options[i]}</span>
              </button>`
    );
  }
  // Change the content
  questionText.innerHTML = `<h3>${number}. ${userData.currentQuestion.text}</h3>`;
  optionsContainer.innerHTML = optTags.join("");
}

function createExam() {
  // const introContainer = document.querySelector(".intro-container");
  // const quizContainer = document.querySelector(".quiz-container");

  // introContainer.hidden = true;
  // quizContainer.hidden = false;

  // exam questions
  userData.setNumberOfQuestions(
    userData.numberOfQuestions < 0
      ? userData.questionsBank.length
      : userData.numberOfQuestions
  );

  // stores indices of bank questions ..ex:2-4-5-7-9 .. exam with 5 questions
  const examIndicesArray = createQuestionsArray(
    userData.questionsBank.length,
    userData.numberOfQuestions
  );

  //initialize array with not answered value
  userData.setUserAnswer(
    new Array(userData.numberOfQuestions).fill(NOT_ANSWERED)
  );

  userData.setCurrentQuestionNumber(1);
  userData.setTargetQuestionNumber(1);
  userData.setUserScore(0);

  for (let i = 0; i < examIndicesArray.length; i++) {
    currentExam.push(userData.questionsBank[examIndicesArray[i] - 1]);
  }
  userData.setCurrentExam(currentExam);
  // need create function Select Questions from Bank
  // loader.hidden = true;
  showQuestion(userData.targetQuestionNumber);
}

async function loadExam(examNumber) {
  const URL = examList[examNumber - 1].url;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Problems with network response...");
    }
    //examQuestionBank = await response.json();
    userData.questionsBank = await response.json();
    userData.save();
  } catch (error) {
    console.error("ERROR::: fetching data:", error);
  }

  // Create Exam

  createExam();
}

function showFinalResult() {
  const quizContainer = document.querySelector(".quiz-container");
  const introContainer = document.querySelector(".intro-container");

  quizContainer.hidden = true;
  introContainer.hidden = true;
  finalResultContainer.hidden = false;

  // Calculate Average
  const grade = (userData.userScore / userData.numberOfQuestions).toFixed(3); //ex:0.714
  const percentPoints = (grade * 100).toFixed(1); //ex:71.4
  const correctIncorrectMsg = finalResultContainer.querySelector(
    "#correct-incorrect-answers"
  );
  const finalScoreMsg = finalResultContainer.querySelector("#final-score-msg");
  const finalGreeting = finalResultContainer.querySelector("#final-greeting");

  const solvedQuestMsg =
    finalResultContainer.querySelector("#solved-quest-msg");
  const gradeImg = finalResultContainer.querySelector("#grade-img");
  const comments = finalResultContainer.querySelector("#comments");

  const examName = examList.find(({ id }) => id == userData.examID).name;
  const url = "./assets";
  let results = [
    {
      message: "¡Excelente!",
      url: "/ico-trophy.png",
      comment: "Sigue así y continúa con tu gran desempeño...",
    },
    {
      message: "¡Buen Trabajo!",
      url: "/ico-good-job.png",
      comment:
        "Has demostrado un buen conocimiento, pero aún puedes mejorar...",
    },
    {
      message: "¡Aprobado!",
      url: "/ico-pass.png",
      comment:
        "Sigue esforzándote y revisa los conceptos en los que tienes dudas...",
    },
    {
      message: "¡Rendimiento insuficiente!",
      url: "/ico-failed.png",
      comment: "Revise los materiales y busque ayuda adicional para mejorar...",
    },
  ];
  const index =
    percentPoints >= 90
      ? 0
      : percentPoints >= 70
      ? 1
      : percentPoints >= 50
      ? 2
      : 3;

  const result = results[index];

  gradeImg.setAttribute("src", url + result.url);
  finalGreeting.textContent = result.message;

  // Comments
  if (index == 3) {
    comments.classList.add("alert-danger");
  } else {
    comments.classList.add("alert-info");
  }

  comments.textContent = result.comment;

  correctIncorrectMsg.textContent = `${userData.userScore} fueron correctas y ${
    userData.numberOfQuestions - userData.userScore
  } fueron incorrectas`;

  solvedQuestMsg.textContent = `Has resuelto ${userData.numberOfQuestions} preguntas de ${examName}`;
  finalScoreMsg.textContent = `Tu puntuación final es: ${percentPoints}%`;
}

function showAlert(message) {
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;
  alertContainer.style.display = "block";
  alertContainer.classList.add("show");

  setTimeout(() => {
    alertContainer.classList.remove("show");
    alertContainer.classList.add("fade");
    setTimeout(() => {
      alertContainer.style.display = "none";
      alertContainer.classList.remove("fade");
    }, 3000);
  }, 2000);
}

// --------------------
// Listeners Functions
// --------------------

viewResultIcon.addEventListener("click", (event) => {
  userData.setHasFinished(true);
  showFinalResult();
});

forwardBtn.addEventListener("click", (event) => {
  userData.targetQuestionNumber++;
  userData.save();
  showQuestion(userData.targetQuestionNumber);

  if (userData.currentQuestionNumber < userData.targetQuestionNumber) {
    // Enter here when it is doing normal test
    userData.setCurrentQuestionNumber(userData.targetQuestionNumber);
    toggleArrowState(forwardBtn, "deactivate");
  } else {
    // User could already answer the question we must know
    const userOption = userData.userAnswers[userData.targetQuestionNumber - 1];
    if (userOption === NOT_ANSWERED) {
      toggleArrowState(forwardBtn, "deactivate");
    } else {
      const buttonPressed = getButtonByName(userOption);
      handleSelectedOption(userOption, buttonPressed, false);
    }
  }
});

backwardBtn.addEventListener("click", (event) => {
  userData.targetQuestionNumber--;
  userData.save();
  showQuestion(userData.targetQuestionNumber);
  toggleArrowState(forwardBtn, "activate");

  const userOption = userData.userAnswers[userData.targetQuestionNumber - 1];
  const buttonPressed = getButtonByName(userOption);
  handleSelectedOption(userOption, buttonPressed, false);
});

buttonGroup.forEach((item) => {
  item.addEventListener("click", (event) => {
    //prevent the default action associated with anchor element
    event.preventDefault();

    // numberOfQuestions = parseInt(event.target.getAttribute("data-value"));

    userData.setNumberOfQuestions(
      parseInt(event.target.getAttribute("data-value"))
    );
    const buttonElement = document.querySelector("#msg-total-questions");

    if (userData.numberOfQuestions < 0) {
      buttonElement.textContent = "Examen Completo";
    } else {
      buttonElement.textContent = `${userData.numberOfQuestions} preguntas`;
    }
    hasSelectedNumOfQuestion = true;
  });
});

examGroup.forEach((item) => {
  item.addEventListener("click", (event) => {
    userData.setExamID(item.getAttribute("exam-value"));

    if (hasSelectedNumOfQuestion) {
      loader.hidden = false;
      loadExam(userData.examID);
    } else {
      showAlert("Seleccione el número de preguntas del Examen");
    }

    // Add your logic to handle the exam value here
  });
});

optionsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON" || event.target.tagName == "SPAN") {
    const selectedOption = event.target.closest(".option");
    const selectedOptionName = selectedOption.getAttribute("name");

    //store user answer
    userData.userAnswers[userData.targetQuestionNumber - 1] =
      selectedOptionName;
    userData.save();

    // handle user answer .. true = user is taking test. Not navigating
    handleSelectedOption(selectedOptionName, selectedOption, true);
    if (hasUserAnsweredAllQuestions()) {
      exitBtn.style.display = "none";
      viewResultIcon.hidden = false;
    }
  }
});

reloadBtn.addEventListener("click", () => {
  sessionStorage.removeItem("userSessionData");
});

repeatBtn.addEventListener("click", () => {
  userData.setShouldRepeat(true);
  userData.setHasFinished(false);
});

exitBtn.addEventListener("click", () => {
  sessionStorage.removeItem("userSessionData");
  location.reload();
});

function handleUserOptions() {
  const userOption = userData.userAnswers[userData.targetQuestionNumber - 1];
  if (userOption !== NOT_ANSWERED) {
    const buttonPressed = getButtonByName(userOption);
    handleSelectedOption(userOption, buttonPressed, false);
  }
}

function initializeExam() {
  if (userData.shouldRepeatExam) {
    // user requested to repeat exam
    userData.setShouldRepeat(false);
    createExam();
  } else {
    // user do not requested. The page was reloaded

    if (!userData.hasFinished) {
      exitBtn.style.display = "none";
      viewResultIcon.hidden = false;
      showQuestion(userData.targetQuestionNumber);
      handleUserOptions();
    } else {
      showFinalResult();
    }
  }
}

// On load
window.addEventListener("load", () => {
  userData.load();
  if (userData.questionsBank.length > 0) {
    initializeExam();
  }
});
