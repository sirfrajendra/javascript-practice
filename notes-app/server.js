const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  // Serve HTML
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./public/index.html');
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  }

  // Serve JS file
  if (req.method === 'GET' && req.url === '/app.js') {
    const js = fs.readFileSync('./public/app.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.end(js);
  }

  // Get notes
  if (req.method === 'GET' && req.url === '/notes') {
    const data = fs.existsSync('notes.json')
      ? fs.readFileSync('notes.json', 'utf-8')
      : '[]';

    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  }

  // Add note
  if (req.method === 'POST' && req.url === '/add-note') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const newNote = JSON.parse(body);

      let notes = fs.existsSync('notes.json')
        ? JSON.parse(fs.readFileSync('notes.json', 'utf-8'))
        : [];

      notes.push(newNote);

      fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2));

      res.end('Saved');
    });
  }
});

server.listen(3000, () => console.log('Server running'));