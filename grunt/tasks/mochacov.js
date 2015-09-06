/* globals module */
module.exports = {
  ci: {
    options: {
      coveralls: true
    }
  },
  html: {
    options: {
      reporter: 'html-cov',
      quiet: true,
      output: 'test/coverage/task.html'
    }
  },
  spec: {
    options: {
      reporter: 'spec'
    }
  },
  options: {
    files: [
      'test/task/**/*.js'
    ],
    compilers: [
      'js:babel/register'
    ]
  }
};
