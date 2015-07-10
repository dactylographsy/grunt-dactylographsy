/* globals module */
module.exports = {
  js: {
    src: '<%= paths.dist.js %>/dactylographsy.min.js',
    dest: '<%= paths.dist.js %>/dactylographsy.min-<%= bower_version %>.js'
  },
  min: {
    src: '<%= paths.dist.js %>/dactylographsy.js',
    dest: '<%= paths.dist.js %>/dactylographsy-<%= bower_version %>.js'
  }
};
