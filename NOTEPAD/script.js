/* ================= SELECTING ELEMENTS ================= */
const noteTitleInput = document.getElementById('note-title');
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const paginationControls = document.getElementById('pagination-controls');

let notes = JSON.parse(localStorage.getItem('myNotes')) || [];
let currentPage = 1;
const notesPerPage = 5;

// 1. Add a new note
function addNote() {
    const title = noteTitleInput.value.trim();
    const text = noteInput.value.trim();
    
    // Note content is required, title is optional
    if (text === '') {
        alert("Note content is required to save a note.");
        return;
    }

    // Generate accurate Date & Time stamp
    const timestamp = new Date().toLocaleString(); 

    notes.unshift({
        id: Date.now(),
        title: title, // This will just be an empty string if left blank
        text: text,
        date: timestamp
    });

    saveNotes();
    
    // Clear inputs and reset to page 1
    noteTitleInput.value = '';
    noteInput.value = '';
    currentPage = 1;
    renderApp();
}

// 2. Save to LocalStorage
function saveNotes() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
}

// 3. Render the current view
function renderApp() {
    renderNotes();
    updatePaginationControls();
}

// 4. Render only the notes for the current page
function renderNotes() {
    notesList.innerHTML = ''; 
    
    // CONDITION: Handle "No notes available" empty state
    if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">No notes available. Create one above!</div>';
        paginationControls.style.display = 'none'; // Hide pagination when empty
        return;
    }

    paginationControls.style.display = 'flex'; // Ensure pagination is visible
    
    // Calculate start and end indexes for the slice
    const startIndex = (currentPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    const paginatedNotes = notes.slice(startIndex, endIndex);

    // Fallback if user is left on an empty page after deletions (future-proofing)
    if (paginatedNotes.length === 0 && currentPage > 1) {
        currentPage--;
        renderApp();
        return;
    }

    // CONDITION: Display Note Title, Content, Date/Time
    paginatedNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        
        // Only generate HTML for the title if the user provided one
        const titleHTML = note.title ? `<h3>${note.title}</h3>` : '';

        noteElement.innerHTML = `
            ${titleHTML}
            <p>${note.text}</p>
            <small style="color: #666;">🕒 ${note.date}</small>
        `;
        notesList.appendChild(noteElement);
    });
}

// 5. Update Pagination Buttons
function updatePaginationControls() {
    if (notes.length === 0) return; // Skip if no notes

    const totalPages = Math.ceil(notes.length / notesPerPage) || 1;
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

/* ================= EVENT LISTENERS ================= */

addNoteBtn.addEventListener('click', addNote);

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderApp();
    }
});

nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(notes.length / notesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderApp();
    }
});

/* ================= INITIALIZATION ================= */
renderApp();