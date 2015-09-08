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
    bs_desktop_ci: {
      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 1,
      browserNoActivityTimeout: 240000,
      captureTimeout: 240000,
      browsers: ['bs_win81_ie_11', 'bs_win8_ie_10', 'bs_mavericks_chrome_44', 'bs_yosemite_firefox_40'],
      reporters: ['mocha'],
      singleRun: true
    },
    bs_mobile_ci: {
      browserDisconnectTimeout: 20000,
      browserDisconnectTolerance: 1,
      browserNoActivityTimeout: 340000,
      captureTimeout: 340000,
      browsers: ['bs_ipad_mini'],
      reporters: ['mocha'],
      singleRun: true
    },
    travis_ci: {
      browsers: ['Firefox'],
      reporters: ['mocha'],
      singleRun: true
    }
  };
};
