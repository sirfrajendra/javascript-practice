const http = require('http'); 
// built-in module to create a web server

const fs = require('fs'); 
// used to read/write JSON file (our "database")

const server = http.createServer((req, res) => {

  // 1️⃣ Serve UI (index.html)
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./public/index.html'); 
    // read HTML file

    res.end(html); 
    // send it to browser
  }

  // 2️⃣ Get all todos
  if (req.method === 'GET' && req.url === '/todos') {

    const data = fs.existsSync('todos.json')
      ? fs.readFileSync('todos.json') 
      : '[]'; 
    // if file exists → read it, else return empty array

    res.setHeader('Content-Type', 'application/json'); 
    // tell browser it's JSON

    res.end(data); 
    // send JSON data
  }

  // 3️⃣ Add new todo
  if (req.method === 'POST' && req.url === '/add') {
    let body = '';

    // collect incoming data
    req.on('data', chunk => {
      body += chunk;
    });

    // when data fully received
    req.on('end', () => {
      const newTodo = JSON.parse(body); 
      // convert JSON → JS object

      let todos = [];

      if (fs.existsSync('todos.json')) {
        todos = JSON.parse(fs.readFileSync('todos.json'));
        // read existing todos
      }

      newTodo.id = Date.now(); 
      // unique ID using timestamp

      newTodo.done = false; 
      // default status

      todos.push(newTodo); 
      // add new todo

      fs.writeFileSync(
        'todos.json',
        JSON.stringify(todos, null, 2)
      ); 
      // save updated list

      res.end('Added');
    });
  }

  // 4️⃣ Toggle (mark complete/incomplete)
  if (req.method === 'POST' && req.url === '/toggle') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const { id } = JSON.parse(body);

      let todos = JSON.parse(fs.readFileSync('todos.json'));

      todos = todos.map(t => {
        if (t.id === id) {
          t.done = !t.done; 
          // flip true/false
        }
        return t;
      });

      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

      res.end('Updated');
    });
  }

  // 5️⃣ Delete todo
  if (req.method === 'POST' && req.url === '/delete') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const { id } = JSON.parse(body);

      let todos = JSON.parse(fs.readFileSync('todos.json'));

      todos = todos.filter(t => t.id !== id);
      // remove matching id

      fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));

      res.end('Deleted');
    });
  }

});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});