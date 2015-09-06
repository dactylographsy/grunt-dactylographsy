module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: '../',
    frameworks: ['mocha'],
    files: [
      'test/src/**/*.spec.js', {
        pattern: 'test/src/fixtures/**/*.json',
        watched: true,
        served: true,
        included: false
      }
    ],

    preprocessors: {
      'test/src/**/*.js': ['webpack', 'sourcemap']
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    webpack: {
      plugins: [],
      devtool: 'inline-source-map',
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
      externals: {},
      module: {
        preLoaders: [{
          test: /(\.jsx)|(\.js)$/,
          exclude: /(node_modules|bower_components|test)/,
          loader: 'isparta-instrumenter'
        }],
        loaders: [{
          test: /\.json/,
          loader: 'json-loader'
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
    port: 9876,
    customLaunchers: {},

    browsers: [
      'Chrome'
    ],

    plugins: [
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha-reporter',
      'karma-mocha',
    ],

    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO
  });
};
