module.exports = {
  js: {
    src: [
      'node_modules/babel-core/browser-polyfill.js',
      '<%= paths.dist.js %>dactylographsy.js'
    ],
    dest: '<%= paths.dist.js %>/dactylographsy.min.js'
  },
  options: {
    sourceMap: false,
    mangle: true,
    beautify: false,
    drop_console: true
  }
};
