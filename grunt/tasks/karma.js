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
    },
    bs_ci: {
      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 1,
      browserNoActivityTimeout: 240000,
      captureTimeout: 240000,
      browsers: ['bs_win81_ie_11', 'bs_win8_ie_10', 'bs_mavericks_chrome_44', 'bs_yosemite_firefox_40'],
      reporters: ['mocha'],
      singleRun: true
    },
    travis_ci: {
      browsers: ['firefox'],
      reporters: ['mocha'],
      singleRun: true
    }
  };
};
