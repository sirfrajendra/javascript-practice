async function loadContacts() {
  const res = await fetch('/contacts');
  const contacts = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  contacts.forEach(c => {
    const li = document.createElement('li');
    li.innerText = `${c.name} - ${c.phone}`;

    // Delete button
    const del = document.createElement('button');
    del.innerText = 'Delete';
    del.onclick = async () => {
      await fetch(`/delete/${c.id}`, { method: 'DELETE' });
      loadContacts();
    };

    // Update button
    const upd = document.createElement('button');
    upd.innerText = 'Edit';
    upd.onclick = async () => {
      const name = prompt('New name:', c.name);
      const phone = prompt('New phone:', c.phone);

      await fetch(`/update/${c.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, phone }),
        headers: { 'Content-Type': 'application/json' }
      });

      loadContacts();
    };

    li.appendChild(del);
    li.appendChild(upd);
    list.appendChild(li);
  });
}

async function addContact() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  await fetch('/add', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
    headers: { 'Content-Type': 'application/json' }
  });

  loadContacts();
}

document.getElementById('addBtn').onclick = addContact;
loadContacts();