var Browser = require('zombie'),
  assert = require('chai').assert;
var browser;
suite('Cross-Page Tests', function () {
  setup(function () { // 测试框架运行每个测试之前都会执行它，为每个测试创建一个新的浏览器实例
    browser = new Browser();
  });

  test('requesting a group rate quote from the hood river tour page' + 'should populate the referrer field', function (done) {
    var referrer = 'http://localhost:3000/tours/hood-river';
    browser.visit(referrer, function () { // browser.visit 会真正加载页面，页面加载完成后，就会调用回调函数。
      browser.clickLink('.requestGroupRate', function () { // browser.clickLink 找到 class 为 requestGroupRate 的链接，并访问它
        assert(browser.field('referrer').value
          === referrer);
        done();
      });
    });
  });

  test('requesting a group rate from the oregon coast tour page should ' + 'populate the referrer field', function (done) {
    var referrer = 'http://localhost:3000/tours/oregon-coast';
    browser.visit(referrer, function () {
      browser.clickLink('.requestGroupRate', function () {
        assert(browser.field('referrer').value === referrer);
        done();
      });
    });
  });

  test('visiting the "request group rate" page dirctly should result ' + 'in an empty referrer field', function (done) {
    browser.visit('http://localhost:3000/tours/request-group-rate', function () {
      assert(browser.field('referrer').value === '');
      done();
    });
  });
});