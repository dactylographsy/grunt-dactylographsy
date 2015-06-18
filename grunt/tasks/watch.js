/* globals module */
module.exports = {
  dev: {
    files: '<%= paths.src.js %>*',
    tasks: ['default'],
    options: {
      interrupt: true,
    }
  }
};
