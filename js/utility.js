import { examsData } from "../db/db.js";

export function displayElement(element) {
  element.style.display = "";
}

export function hideElement(element) {
  element.style.display = "none";
}

export function disableElement(element) {
  element.disabled = true;
}

export function enableElement(element) {
  element.disabled = false;
}

export function getQuestionById(arr, id) {
  return arr.find((question) => question.id === id);
}

export function formatCorrectAnswer(element) {
  element.classList.remove("btn-outline-secondary");
  element.classList.add("btn", "btn-success");
}

export function formatIncorrectAnswer(element) {
  element.classList.remove("btn-outline-secondary");
  element.classList.add("btn", "btn-danger");
}

export function setCircleProgress(percent) {
  const progressCircle = document.querySelector(".progress-circle");
  progressCircle.style.setProperty("--percent", percent);
  document.querySelector(
    ".progress-circle .percentage-value"
  ).textContent = `${percent}%`;
}
