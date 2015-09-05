/* globals module */
module.exports = function(grunt) {
  return {
    options: {
      configFile: 'test/karma.conf.js',
      hostname: 'localhost',
      singleRun: true
    },
    local: {
      browsers: ['Chrome'],
      reporters: ['mocha']
    },
    dev: {
      browsers: ['Chrome'],
      reporters: ['mocha'],
      singleRun: false
    }
  };
};
