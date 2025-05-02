export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("notes-data") || "[]");

    return notes.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });
  }

  static saveNote(noteToSave) {
    let notes = this.getAllNotes();
    let sameNote = notes.find((note) => noteToSave.id === note.id);

    if (sameNote) {
      sameNote.title = noteToSave.title;
      sameNote.body = noteToSave.body;
      sameNote.date = new Date().toISOString();
    } else {
      noteToSave.id = Math.floor(Math.random() * 1000000);
      noteToSave.date = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("notes-data", JSON.stringify(notes));
  }

  static deleteNote(id) {
    let notes = this.getAllNotes();
    notes = notes.filter((note) => note.id !== id);
    localStorage.setItem("notes-data", JSON.stringify(notes));
  }
}
