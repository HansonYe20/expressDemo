const express = require('express');
const app = express();
// const path = require('path');
// const fortune = require('./lib/fortune.js');
// const weatherData = require('./lib/weatherData.js');
// const formidable = require('formidable');
const credentials = require('./lib/credentials.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');

app.set('port', process.env.PORT || 4000);

// Nodemailer, 提供了多数大厂的MSA, 也可以自行扩展:
// 你的 MSA 没有出现在这个列表上，或者你需要直接连接一个 SMTP 服务器
var mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: credentials.gmail.user,
      pass: credentials.gmail.password,
    }),
  },
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: 'SSLv3'
  },
  requireTLS: true,//this parameter solved problem for me
});

mailTransport.sendMail({
  from: '"Meadowlark Travel" <handsomeye20@gmail.com>',
  to: '986626421@qq.com',
  subject: 'Your Meadowlark Travel Tour',
  text: 'Thank you for booking your trip with Meadowlark Travel.'
}, function (err) {
  if (err) console.error('Unable to send email: ' + err);
});

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});