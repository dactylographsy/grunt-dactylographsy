/*
* grunt-dactylographsy
* https://github.com/tdeekens/grunt-dactylographsy
*
* Copyright (c) 2014 tdeekens
* Licensed under the MIT license.
*/

module.exports = function(grunt) {
  var
    Persister = require('./modules/persister'),
    Fingerprinter = require('./modules/fingerprinter'),
    FileAnalyzer = require('./modules/file-analyzer');

  grunt.registerMultiTask('dactylographsy', 'Fingerprint your assets', function() {
    var
      options = this.options({
        location: 'dactylographsy.json',
        root: 'dist',
        rootUrl: null,
        packageUrl: null,
        devPaths: [],
        package: 'None'
      });

    var
      files,
      prints,
      fileAnalyzer = new FileAnalyzer(options.root),
      fingerprinter = new Fingerprinter(options.root, options.devPaths),
      persister = new Persister(options.package, options.root, options.location, options.rootUrl, options.packageUrl);

    files = fileAnalyzer.getFiles(this.files);
    prints = fingerprinter.hashFiles(files);

    persister.write(prints);
  });
};
