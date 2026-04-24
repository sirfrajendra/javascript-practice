async function loadNotes() {
  const res = await fetch('/notes');
  const notes = await res.json();

  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach(n => {
    const li = document.createElement('li');
    li.innerText = n.text;
    list.appendChild(li);
  });
}

async function addNote() {
  const text = document.getElementById('noteInput').value;

  await fetch('/add-note', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });

  loadNotes();
}

document.getElementById('addBtn').addEventListener('click', addNote);

loadNotes();