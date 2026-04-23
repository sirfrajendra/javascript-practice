const config = JSON.parse(require('fs').readFileSync('./config.json', 'utf-8'));

console.log("Running on port:", config.port);