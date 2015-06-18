/* globals module */
module.exports = {
  options: {
    sourceMap: true
  },
  dist: {
    files: {
      '<%= paths.dist.js %>dactylographsy.js': '<%= paths.src.js %>dactylographsy.js'
    }
  }
};
