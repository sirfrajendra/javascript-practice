const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync('./public/index.html'));
  }

  if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.end(fs.readFileSync('./public/app.js'));
  }

  if (req.url === '/todos' && req.method === 'GET') {
    const data = fs.existsSync('todos.json')
      ? fs.readFileSync('todos.json', 'utf-8')
      : '[]';

    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  }

  if (req.url === '/add' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);

    req.on('end', () => {
      const todo = JSON.parse(body);

      let todos = fs.existsSync('todos.json')
        ? JSON.parse(fs.readFileSync('todos.json', 'utf-8'))
        : [];

      todo.id = Date.now();
      todos.push(todo);

      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

      res.end('Added');
    });
  }

  if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
    const id = parseInt(req.url.split('/')[2]);

    let todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));

    todos = todos.filter(t => t.id !== id);

    fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

    res.end('Deleted');
  }
});

server.listen(3000, () => console.log('Running on 3000'));