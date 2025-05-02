import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

// Auto height for textareas
document.querySelectorAll("textarea").forEach((el) => {
  el.addEventListener("input", () => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
});

// Hamburger Menu logic
const hamMenu = document.querySelector(".notes__hamburger-btn");
const sidebar = document.querySelector(".notes__sidebar");
const bodyTextArea = document.querySelector("body");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  sidebar.classList.toggle("active");
  bodyTextArea.classList.toggle("active");
});

// console.log(NotesAPI.getAllNotes());

// Start of app
const notesList = document.querySelector(".notes__list");
const app = new NotesView(notesList);
