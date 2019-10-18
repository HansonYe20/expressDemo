module.exports = function (grunt) {
  // 加载插件
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint',
    'grunt-exec',
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });
  // 配置插件
  grunt.initConfig({
    cafemocha: {
      all: { src: 'project1/qa/tests-*.js', options: { ui: 'tdd' }, }
    },
    jshint: {
      app: ['meadowlark.js', 'project1/public/js/**/*.js', 'lib/**/*.js'],
      qa: ['Gruntfile.js', 'project1/public/qa/**/*.js', 'qa/**/*.js'],
    },
    exec: {
      linkchecker:
        { cmd: 'blc http://localhost:3000' }
    },
  });
  // 注册任务
  grunt.registerTask('default', ['cafemocha','jshint','exec']);
};