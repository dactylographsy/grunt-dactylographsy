/*
* grunt-dactylographsy
* https://github.com/tdeekens/grunt-dactylographsy
*
* Copyright (c) 2014 tdeekens
* Licensed under the MIT license.
*/

'use strict';

var
  fs = require('fs'),
  _ = require('lodash'),
  Persister = require('./modules/persister'),
  Fingerprinter = require('./modules/fingerprinter'),
  FileAnalyzer = require('./modules/file-analyzer');

module.exports = function(grunt) {
  grunt.registerMultiTask('dactylographsy', 'Fingerprint your assets', function() {
    var
      options = this.options({
        location: 'dactylographsy.json',
        root: 'dist'
      });

    var
      files,
      prints,
      fileAnalyzer = new FileAnalyzer(options.root),
      fingerprinter = new Fingerprinter(options.root),
      persister = new Persister(options.root, options.location);

    files = fileAnalyzer.getFiles(this.files);
    prints = fingerprinter.hashFiles(files);

    persister.write(prints);
  });
};
