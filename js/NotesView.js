import NotesAPI from "./NotesAPI.js";

export default class NotesView {
  constructor(notesList) {
    // onNoteSave, onNoteCancel, onNoteDelete, onNoteSelect
    this.notesList = notesList;

    // Generates HTML for the sidebar
    const notesFromAPI = NotesAPI.getAllNotes();

    notesFromAPI.forEach((note) => {
      notesList.innerHTML += this.generateHTML(note);
    });

    // Select nurrent note
    const notesHTML = document.querySelectorAll(".notes__item");

    this.notesHTML = notesHTML;
    this.titleInput = document.querySelector(".notes__preview-title");
    this.bodyInput = document.querySelector(".notes__preview-body");
    this.refreshNotes();

    // Button functions
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const addNoteBtn = document.getElementById("addNoteBtn");

    saveBtn.addEventListener("click", () => {
      this.onNoteSave(this.titleInput, this.bodyInput);
    });

    addNoteBtn.addEventListener("click", () => {
      this.onNoteAdd(this.titleInput, this.bodyInput);
    });

    cancelBtn.addEventListener("click", () => {
      this.onNoteCancel(this.titleInput, this.bodyInput);
    });
  }

  refreshNotes() {
    const notesFromAPI = NotesAPI.getAllNotes();
    this.notesList.innerHTML = "";

    notesFromAPI.forEach((note) => {
      this.notesList.innerHTML += this.generateHTML(note);
    });

    // Add event listeners
    this.notesHTML = document.querySelectorAll(".notes__item");

    this.notesHTML.forEach((noteSelected) => {
      noteSelected.addEventListener("click", () => {
        this.onNoteSelect(noteSelected, this.titleInput, this.bodyInput);
      });

      noteSelected.addEventListener("mouseenter", () => {
        noteSelected.classList.add("active");
      });
      noteSelected.addEventListener("mouseleave", () => {
        noteSelected.classList.remove("active");
      });
    });

    // added deletBTn
    const deleteBtns = document.querySelectorAll(".notes__item-delete");
    deleteBtns.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const noteItem = button.closest(".notes__item");
        const noteId = parseInt(noteItem.dataset.id);
        NotesAPI.deleteNote(noteId);
        this.refreshNotes();
        const notesPreview = document.querySelector(".notes__preview");
        notesPreview.style.visibility = "hidden";
      });
    });
  }

  generateHTML(note) {
    const formattedDate = new Date(note.date).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });

    return `
        <div class="notes__item" data-id=${note.id}>
            <div class="notes__item-title">${note.title == "" ? "Enter a title": note.title}</div>
            <div class="notes__item-body">${note.body == "" ? "Write your notes..." : note.body}</div>
            <div class="notes__item-date">${formattedDate}</div>
            <button class="notes__item-delete" title="Delete Note"><img src="/images/delete.png"></button>
        </div>
    `;
  }

  onNoteSelect(noteSelected, titleInput, bodyInput) {
    this.notesHTML.forEach((note) => {
      note.classList.remove("notes__item--selected");
    });

    noteSelected.classList.add("notes__item--selected");
    const noteId = parseInt(noteSelected.dataset.id);
    const noteData = NotesAPI.getAllNotes().find(note => note.id === noteId);
    
    titleInput.value = noteData.title;
    bodyInput.value = noteData.body;

    this.showNotes();
  }

  onNoteSave(titleInput, bodyInput) {
    const selectedNote = document.querySelector(".notes__item--selected");
    if (!selectedNote) return;

    const noteId = parseInt(selectedNote.dataset.id);
    const newTitle = titleInput.value;
    const newBody = bodyInput.value;

    const oldTitle = selectedNote.querySelector(".notes__item-title").innerText;
    const oldBody = selectedNote.querySelector(".notes__item-body").innerText;
    if (newTitle === oldTitle && newBody === oldBody) {
      return;
    }

    NotesAPI.saveNote({
      id: noteId,
      title: newTitle,
      body: newBody,
    });

    this.refreshNotes();

    // Reselect the updated note in the new DOM
    const reselectedNote = document.querySelector(`[data-id="${noteId}"]`);
    if (reselectedNote) {
      this.onNoteSelect(reselectedNote, this.titleInput, this.bodyInput);
    }
  }

  onNoteCancel(titleInput, bodyInput) {
    const selectedNote = document.querySelector(".notes__item--selected");
    if (!selectedNote) return;
    const noteId = parseInt(selectedNote.dataset.id);
    const noteData = NotesAPI.getAllNotes().find(note => note.id === noteId);

    titleInput.value = noteData.title;
    bodyInput.value = noteData.body;
  }

  onNoteAdd(titleInput, bodyInput) {
    const newNote = {
      title: "",
      body: ""
    };

    NotesAPI.saveNote(newNote);

    this.refreshNotes();

    // Get the latest note (first due to sorting)
    const latestNote = NotesAPI.getAllNotes()[0];

    const newNoteElement = document.querySelector(
      `[data-id="${latestNote.id}"]`
    );
    if (newNoteElement) {
      this.onNoteSelect(newNoteElement, titleInput, bodyInput);
    }
  }

  showNotes() {
    const notesPreview = document.querySelector(".notes__preview");
    notesPreview.style.visibility = "visible";
  }
}
