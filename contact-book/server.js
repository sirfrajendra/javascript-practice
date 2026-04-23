const http = require('http'); 
// create server

const fs = require('fs'); 
// read/write JSON file

const server = http.createServer((req, res) => {

  // 1️⃣ Serve UI
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./public/index.html');
    res.end(html);
  }

  // 2️⃣ Get all contacts
  if (req.method === 'GET' && req.url === '/contacts') {

    const data = fs.existsSync('contacts.json')
      ? fs.readFileSync('contacts.json')
      : '[]'; 
    // if file missing → return empty array

    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  }

  // 3️⃣ Add contact
  if (req.method === 'POST' && req.url === '/add-contact') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const newContact = JSON.parse(body); 
      // JSON → JS

      let contacts = [];

      if (fs.existsSync('contacts.json')) {
        contacts = JSON.parse(fs.readFileSync('contacts.json'));
      }

      contacts.push(newContact); 
      // add new contact

      fs.writeFileSync(
        'contacts.json',
        JSON.stringify(contacts, null, 2)
      );

      res.end('Contact added');
    });
  }

  // 4️⃣ Search contact
  if (req.method === 'POST' && req.url === '/search') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const { name } = JSON.parse(body);

      const contacts = fs.existsSync('contacts.json')
        ? JSON.parse(fs.readFileSync('contacts.json'))
        : [];

      const result = contacts.filter(c =>
        c.name.toLowerCase().includes(name.toLowerCase())
      );

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    });
  }

});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});