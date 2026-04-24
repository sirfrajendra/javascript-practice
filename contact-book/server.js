const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  // Serve HTML
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    return res.end(fs.readFileSync('./public/index.html'));
  }

  // Serve JS
  if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(fs.readFileSync('./public/app.js'));
  }

  // GET contacts
  if (req.url === '/contacts' && req.method === 'GET') {
    const data = fs.existsSync('contacts.json')
      ? fs.readFileSync('contacts.json', 'utf-8')
      : '[]';

    res.setHeader('Content-Type', 'application/json');
    return res.end(data);
  }

  // ADD contact
  if (req.url === '/add' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);

    req.on('end', () => {
      const contact = JSON.parse(body);

      let contacts = fs.existsSync('contacts.json')
        ? JSON.parse(fs.readFileSync('contacts.json', 'utf-8'))
        : [];

      contact.id = Date.now();
      contacts.push(contact);

      fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2));
      res.end('Added');
    });
  }

  // DELETE contact
  if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
    const id = parseInt(req.url.split('/')[2]);

    let contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));
    contacts = contacts.filter(c => c.id !== id);

    fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2));
    return res.end('Deleted');
  }

  // UPDATE contact
  if (req.url.startsWith('/update/') && req.method === 'PUT') {
    const id = parseInt(req.url.split('/')[2]);

    let body = '';
    req.on('data', c => body += c);

    req.on('end', () => {
      const updated = JSON.parse(body);

      let contacts = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

      contacts = contacts.map(c => 
        c.id === id ? { ...c, ...updated } : c
      );

      fs.writeFileSync('contacts.json', JSON.stringify(contacts, null, 2));
      res.end('Updated');
    });
  }
});

server.listen(3000, () => console.log('Running on 3000'));