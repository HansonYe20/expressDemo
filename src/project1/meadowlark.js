const express = require('express');
const app = express();
const path = require('path');
const fortune = require('./lib/fortune.js');
const weatherData = require('./lib/weatherData.js');
const formidable = require('formidable');
const credentials = require('./lib/credentials.js');
// const connect = require('connect');
const nodemailer = require('nodemailer');

app.set('port', process.env.PORT || 3000);

console.log(`__dirname: ${__dirname}`)

app.use(function (req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});


app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.use(require('body-parser')());

app.use(require('cookie-parser')(credentials.cookieSecret));

// app.use(require('./lib/requiresWaiver.js'));
var cartValidation = require('./lib/cartValidation.js');
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);

app.use(express.static(__dirname + '/public')); // static中间件, 1.放在所有路由之前 2. public在链接上直接访问, 无需加/public这一层

// 设置 handlebars 视图引擎
const exphbs = require('express3-handlebars').create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'), // 由于本地的代码修改位置了, 所以要手动指定模板路劲
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    section: function (name, options) {
      console.log(name);
      console.log(JSON.stringify(options));
      if (!this._sections) {
        this._sections = {}
      };
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(function (req, res, next) {
  res.cookie('monster', Math.random());
  res.cookie('signed_monster', 'nom nom', { signed: true });

  req.session.userName = 'hanson';
  req.session.flash = 'Ye';

  if (!res.locals.partials) { // locals 上下文环境
    res.locals.partials = {};
  }
  res.locals.partials.weather = weatherData.getWeatherData();
  next();
});

// app.use(connect.basicAuth)();

app.use(function (req, res, next) {
  // 如果有即显消息，把它传到上下文中，然后清除它 
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.get('/', function (req, res) {
  console.log(req.session.userName);
  console.log(res.locals.flash);
  res.render('home');
});

app.get('/contest/vacation-photo', function (req, res) {
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});
app.post('/contest/vacation-photo/:year/:month', function (req, res) {
  var monster = req.cookies.monster;
  var signedMonster = req.signedCookies.monster;

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    if (err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('received files:');
    console.log(files);
    res.redirect(303, '/thanks');
  });
});

app.get('/newsletter', function (req, res) {
  // 我们会在后面学到 CSRF......目前，只提供一个虚拟值
  res.render('newsletter', { csrf: 'CSRF token goes here' });
});

// app.post('/newsletterSubmit', function (req, res) {
//   var name = req.body.name || '', email = req.body.email || ''; // 输入验证
//   if (!email.match(VALID_EMAIL_REGEX)) {
//     if (req.xhr) return res.json({ error: 'Invalid name email address.' });
//     req.session.flash = {
//       type: 'danger',
//       intro: 'Validation error!',
//       message: 'The email address you entered was not valid.',
//     };
//     return res.redirect(303, '/newsletter/archive');
//   }
//   new NewsletterSignup({ name: name, email: email }).save(function (err) {
//     if (err) {
//       if (req.xhr) return res.json({ error: 'Database error.' });
//       req.session.flash = {
//         type: 'danger',
//         intro: 'Database error!',
//         message: 'There was a database error; please try again later.',
//       }
//       return res.redirect(303, '/newsletter/archive');
//     }
//     if (req.xhr) return res.json({ success: true });
//     req.session.flash = {
//       type: 'success',
//       intro: 'Thank you!',
//       message: 'You have now been signed up for the newsletter.',
//     };
//     return res.redirect(303, '/newsletter/archive');
//   });
// });

app.post('/process', function (req, res) {
  if (req.xhr || req.accepts('json,html') === 'json') {
    // 如果发生错误，应该发送 { error: 'error description' }
    res.send({ success: true });
  } else {
    // 如果发生错误，应该重定向到错误页面
    res.redirect(303, '/thanks');
  }
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

app.get('/thanks', function (req, res) {
  res.render('thanks');
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