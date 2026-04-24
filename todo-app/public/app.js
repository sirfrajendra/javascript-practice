async function loadTodos() {
  const res = await fetch('/todos');
  const todos = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  todos.forEach(t => {
    const li = document.createElement('li');
    li.innerText = t.text;

    const btn = document.createElement('button');
    btn.innerText = 'Delete';

    btn.onclick = async () => {
      await fetch(`/delete/${t.id}`, { method: 'DELETE' });
      loadTodos();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

async function addTodo() {
  const text = document.getElementById('todoInput').value;

  await fetch('/add', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });

  loadTodos();
}

document.getElementById('addBtn').addEventListener('click', addTodo);

loadTodos();