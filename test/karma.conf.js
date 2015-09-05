module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: '../',
    frameworks: ['mocha'],
    files: [
      'test/src/**/*.spec.js'
    ],

    preprocessors: {
      'test/src/**/*.js': ['webpack']
    },

    webpack: {
      plugins: [],
      resolve: {
        alias: {},
        modulesDirectories: [
          'src',
          'bower_modules',
          'node_modules',
          'test'
        ],
        extensions: ['', '.js']
      },
      externals: {
        fs: 'null'
      },
      module: {
        loaders: [{
          // A stupid hack required for sinon so that it knows it is not running in AMD
          test: /sinon\.js$/,
          loader: "imports?define=>false"
        }, {
          test: /\.json/,
          loader: 'json-loader'
        }, {
          test: /\.js?$/,
          loaders: ['babel'],
          exclude: /node_modules/
        }, {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader?optional[]=runtime'
        }, {
          test: /\.css/,
          loader: 'style-loader!css-loader'
        }]
      }
    },

    webpackMiddleware: {
      noInfo: true,
      quiet: true
    },

    exclude: [],
    port: 8080,
    customLaunchers: {},

    browsers: [
      'Chrome'
    ],

    plugins: [
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-mocha',
    ],

    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO
  });
};
