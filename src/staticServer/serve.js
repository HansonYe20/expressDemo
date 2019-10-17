const http = require('http');
const fs = require('fs');
const port = 3000;
const hostname = '127.0.0.1';

function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, function (err, data) {
    console.log(__dirname);
    console.log(path);
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Internal Error');
    } else {
      res.writeHead(responseCode,
        { 'Content-Type': contentType });
      res.end(data);
    }
  });
}


const server = http.createServer(function (req, res) {
  // 规范化 url，去掉查询字符串、可选的反斜杠，并把它变成小写 
  var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
  console.log(path);
  switch (path) {
    case '/home':
      serveStaticFile(res, '/public/home.html', 'text/html'); break;
    case '/about':
      serveStaticFile(res, '/public/about.html', 'text/html'); break;
    case '/img/logo.jpg':
      serveStaticFile(res, '/public/img/logo.jpg', 'image/jpeg'); break;
    default:
      serveStaticFile(res, '/public/404.html', 'text/html', 404); break;
  }
});
// console.log(`Server running at 3000/`);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});