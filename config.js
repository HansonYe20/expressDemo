module.exports = {
  bundles: {
    clientJavaScript: {
      main: {
        file: 'src/project1/public/js/meadowlark.min.js',
        location: 'head',
        contents: [
          'src/project1/public/js/contact.js',
          'src/project1/public/js/cart.js',
        ]
      }
    },
    clientCss: {
      main: {
        file: 'src/project1/public/css/meadowlark.min.css',
        contents: [
          'src/project1/public/css/main.css',
        ]
      }
    }
  }
}