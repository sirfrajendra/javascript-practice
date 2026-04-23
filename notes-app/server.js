const http = require('http'); 
// built-in module to create server

const fs = require('fs'); 
// file system module to read/write JSON file

const server = http.createServer((req, res) => {

  // 1️⃣ Serve UI
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./public/index.html');
    res.end(html);
  }

  // 2️⃣ Get all notes
  if (req.method === 'GET' && req.url === '/notes') {

    // if file exists → read, else empty array
    const data = fs.existsSync('notes.json')
      ? fs.readFileSync('notes.json')
      : '[]';

    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  }

  // 3️⃣ Add note
  if (req.method === 'POST' && req.url === '/add') {
    let body = '';

    // collect incoming data chunks
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const newNote = JSON.parse(body); // JSON → JS object

      let notes = [];

      if (fs.existsSync('notes.json')) {
        notes = JSON.parse(fs.readFileSync('notes.json'));
      }

      newNote.id = Date.now(); // unique id
      notes.push(newNote);

      fs.writeFileSync(
        'notes.json',
        JSON.stringify(notes, null, 2) // JS → JSON
      );

      res.end('Saved');
    });
  }

  // 4️⃣ Delete note
  if (req.method === 'POST' && req.url === '/delete') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const { id } = JSON.parse(body);

      let notes = JSON.parse(fs.readFileSync('notes.json'));

      notes = notes.filter(n => n.id !== id);

      fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));

      res.end('Deleted');
    });
  }
});

server.listen(3000, () => console.log("Server running on 3000"));