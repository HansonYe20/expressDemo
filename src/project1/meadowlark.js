const express = require('express');
const app = express();
const path = require('path');
const fortune = require('./lib/fortune.js');
const weatherData = require('./lib/weatherData.js');


app.set('port', process.env.PORT || 3000);

console.log(`__dirname: ${__dirname}`)

app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

app.use(express.static(__dirname + '/public')); // static中间件, 1.放在所有路由之前 2. public在链接上直接访问, 无需加/public这一层

// 设置 handlebars 视图引擎
const exphbs = require('express3-handlebars').create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'), // 由于本地的代码修改位置了, 所以要手动指定模板路劲
  partialsDir: // path.join(__dirname, 'views/partials'),
   [
    //  path to your partials
    path.join(__dirname, 'views/partials'),
  ],
});

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(function (req, res, next) {
  if (!res.locals.partials) { // locals 上下文环境
    res.locals.partials = {};
  }
  res.locals.partials.weather = weatherData.getWeatherData();
  next();
});


app.get('/', function (req, res) {
  res.render('home');
});

app.get('/tours/hood-river', function (req, res) {
  res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function (req, res) {
  res.render('tours/request-group-rate');
});

app.get('/about', function (req, res) {
  res.render('about', {
    fortune: fortune.getFortune(), // 传递参数
    pageTestScript: '/qa/tests-about.js'
  });
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
  res.render('500'); //  , { layout: null } 或者指定其他布局
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});