'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function FileAnalyzer(exclusions) {
  this._exclusions = exclusions;
}

FileAnalyzer.prototype.getFiles = function(globbedFiles) {
  var files = [];

  globbedFiles.forEach(function(file) {
    files = file.src.filter(function(filepath) {
      return fs.lstatSync(filepath).isFile();
    }).map(function(filepath) {
      return filepath;
    });
  });

  return files;
};

module.exports = FileAnalyzer;
