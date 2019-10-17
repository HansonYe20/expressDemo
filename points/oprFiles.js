// snyc
const fs = require('fs');
const data = fs.readFileSync('./README.md'); // 在这里阻塞直到文件被读取
console.log(data);

fs.readFile('./package.json', (err, data) => {
  if (err) throw err;
  console.log(123);
});