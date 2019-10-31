var fortune = require('../lib/fortune.js');

exports.home = function (req, res) {
  res.render('home');
};
exports.about = function (req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
};
// todo 路由功能改造
// 请求参数报错机制
// ...