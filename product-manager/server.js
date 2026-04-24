const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    return res.end(fs.readFileSync('./public/index.html'));
  }

  else if (req.url === '/app.js') {
    res.setHeader('Content-Type', 'application/javascript');
    return res.end(fs.readFileSync('./public/app.js'));
  }

  else if (req.url === '/products' && req.method === 'GET') {
    const data = fs.existsSync('products.json')
      ? fs.readFileSync('products.json', 'utf-8')
      : '[]';

    res.setHeader('Content-Type', 'application/json');
    return res.end(data);
  }

  else if (req.url === '/add' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {

      console.log("BODY:", body); // 🔍 debug

      if (!body) {
        res.end('Empty body');
        return;
      }

      let product;
      try {
        product = JSON.parse(body);
      } catch {
        res.end('Invalid JSON');
        return;
      }

      let products = fs.existsSync('products.json')
        ? JSON.parse(fs.readFileSync('products.json', 'utf-8'))
        : [];

      product.id = Date.now();
      products.push(product);

      fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

      res.end('Added');
    });
  }

  else if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
    const id = parseInt(req.url.split('/')[2]);

    let products = fs.existsSync('products.json')
      ? JSON.parse(fs.readFileSync('products.json', 'utf-8'))
      : [];

    products = products.filter(p => p.id !== id);

    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    return res.end('Deleted');
  }

  else if (req.url.startsWith('/update/') && req.method === 'PUT') {
    const id = parseInt(req.url.split('/')[2]);

    let body = '';
    req.on('data', c => body += c);

    req.on('end', () => {

      if (!body) {
        res.end('Empty body');
        return;
      }

      let updated;
      try {
        updated = JSON.parse(body);
      } catch {
        res.end('Invalid JSON');
        return;
      }

      let products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

      products = products.map(p =>
        p.id === id ? { ...p, ...updated } : p
      );

      fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
      res.end('Updated');
    });
  }

  else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Running on 3000'));