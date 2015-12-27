/*
* grunt-dactylographsy
* https://github.com/dactylographsy/grunt-dactylographsy
*
* Copyright (c) 2016 tdeekens
* Licensed under the MIT license.
*/

module.exports = function(grunt) {
  var
    Persister = require('node-dactylographsy').Persister,
    Fingerprinter = require('node-dactylographsy').Fingerprinter,
    FileAnalyzer = require('node-dactylographsy').FileAnalyzer;

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
      fileAnalyzer = new FileAnalyzer(
        options.root
      ),
      fingerprinter = new Fingerprinter(
        options.root,
        options.devPaths
      ),
      persister = new Persister(
        options.package,
        options.root,
        options.location,
        options.rootUrl,
        options.packageUrl
      );

    files = fileAnalyzer.getFiles(this.files);
    prints = fingerprinter.hashFiles(files);

    persister.write(prints);
  });
};
