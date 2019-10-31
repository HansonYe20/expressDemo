module.exports = function (grunt) {
  // 加载插件
  [
    'grunt-contrib-less',
    'grunt-cafe-mocha',
    'grunt-contrib-jshint',
    'grunt-exec',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin',
    'grunt-hashres',
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
    less: {
      development: {
        options: {
          customFunctions: {
            static: function (lessObject, name) {
              return 'url("' +
                require('./src/project1/lib/static.js').map(name.value) +
                '")';
            }
          }
        },
        files: {
          'src/project1/public/css/main.css': 'src/project1/less/main.less',
        }
      }
    },
    uglify: {
      all: {
        files: {
          'src/project1/public/js/meadowlark.min.js': ['src/project1/public/js/**/*.js']
        }
      }
    }, 
    cssmin: {
      combine: {
        files: {
          'src/project1/public/css/meadowlark.css': ['src/project1/public/css/**/*.css',
            '!src/project1/public/css/meadowlark*.css']
        }
      },
      minify: {
        src: 'src/project1/public/css/meadowlark.css',
        dest: 'src/project1/public/css/meadowlark.min.css',
      }
    },
    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}'
      },
      all: {
        src: [
          'src/project1/public/js/meadowlark.min.js',
          'src/project1/public/css/meadowlark.min.css',
        ],
        dest: [
          'src/project1/views/layouts/main.handlebars',
        ]
      },
    }
  });
  // 注册任务
  grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']);
  grunt.registerTask('static', ['less', 'cssmin', 'uglify', 'hashres']);
};