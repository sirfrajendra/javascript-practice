async function loadProducts() {
  const res = await fetch('/products');
  const products = await res.json();

  const list = document.getElementById('list');
  list.innerHTML = '';

  products.forEach(p => {
    const li = document.createElement('li');
    li.innerText = `${p.name} - $${p.price}`;

    const del = document.createElement('button');
    del.innerText = 'Delete';
    del.onclick = async () => {
      await fetch(`/delete/${p.id}`, { method: 'DELETE' });
      loadProducts();
    };

    const upd = document.createElement('button');
    upd.innerText = 'Edit';
    upd.onclick = async () => {
      const name = prompt('New name:', p.name);
      const price = prompt('New price:', p.price);

      await fetch(`/update/${p.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, price }),
        headers: { 'Content-Type': 'application/json' }
      });

      loadProducts();
    };

    li.appendChild(del);
    li.appendChild(upd);
    list.appendChild(li);
  });
}

async function addProduct() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;

  await fetch('/add', {
    method: 'POST',
    body: JSON.stringify({ 
        name: name,
        price: price 
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  loadProducts();
}

document.getElementById('addBtn').onclick = addProduct;
loadProducts();