/* globals module */
module.exports = {
  build: {
    target: 'web',
    debug: true,
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
      path: './dist/',
      filename: 'dactylographsy.js',
    },
    modulesDirectories: [
      './src'
    ],
    stats: {
      colors: false,
      modules: true,
      reasons: true
    },
    progress: true,
    failOnError: true,
    module: {
      loaders: [
        { test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional[]=runtim'}
      ]
    }
  }
};
