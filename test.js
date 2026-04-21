const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data.substring(0, 200)));
});

req.on('error', e => console.error(e));
req.write(JSON.stringify({text: 'test'}));
req.end();
