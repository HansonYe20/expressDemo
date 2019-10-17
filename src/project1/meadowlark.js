const express = require('express');
const app = express();
const path = require('path');
app.set('port', process.env.PORT || 3000);

// 设置 handlebars 视图引擎
const exphbs = require('express3-handlebars').create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'), // 由于本地的代码修改位置了, 所以要手动指定模板路劲
});

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); 

app.get('/', function (req, res) {
  console.log('this is home page');
  console.log(viewsPath);
  res.render('home');
});
app.get('/about', function (req, res) {
  res.render('about');
});
// 404 catch-all 处理器(中间件) 
app.use(function (req, res, next) {
  res.status(404);
  res.render('404');
});
// 500 错误处理器(中间件) 
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

// app.get('/', function (req, res) {
//   res.type('text/plain');
//   res.send('Meadowlark Travel');
// });
// app.get('/about', function (req, res) {
//   res.type('text/plain');
//   res.send('About Meadowlark Travel');
// });

// 定制404页面
// app.use(function (req, res) {
//   res.type('text/plain');
//   res.status(404);
//   res.send('404 - Not Found');
// });

// 定制 500 页面
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.type('text/plain');
//   res.status(500);
//   res.send('500 - Server Error');
// });

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});