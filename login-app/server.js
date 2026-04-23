const http = require('http'); 
// create server

const fs = require('fs'); 
// read JSON file

const server = http.createServer((req, res) => {

  // 1️⃣ Serve UI
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync('./public/index.html');
    res.end(html);
  }

  // 2️⃣ Handle login
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    // receive data from frontend
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body); 
        // convert JSON → JS

        const users = JSON.parse(fs.readFileSync('users.json')); 
        // read users from file

        // 🔥 core login logic
        const user = users.find(
          u => u.username === username && u.password === password
        );

        res.setHeader('Content-Type', 'application/json');

        if (user) {
          res.end(JSON.stringify({ success: true, message: "Login successful" }));
        } else {
          res.end(JSON.stringify({ success: false, message: "Invalid credentials" }));
        }

      } catch (err) {
        res.end(JSON.stringify({ success: false, message: "Invalid request" }));
      }
    });
  }

});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});