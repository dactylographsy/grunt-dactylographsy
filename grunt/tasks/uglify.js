module.exports = {
  js: {
    src: [
      '<%= paths.src.js %>**/*.js'
    ],
    dest: '<%= paths.dist.js %>/dactylographsy.min.js'
  },
  options: {
    mangle: true,
    beautify: false
  }
};
