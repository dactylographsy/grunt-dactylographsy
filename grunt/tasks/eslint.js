/* globals module */
module.exports = {
  options: {
    configFile: 'eslint.json'
  },
  target: [
    '<%= paths.src.js %>**/*.js',
    '<%= paths.src.lint %>'
  ]
};
