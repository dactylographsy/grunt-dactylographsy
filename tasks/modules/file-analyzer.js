'use strict';

var
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash');

function FileAnalyzer(root) {
  this.root = root;
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

FileAnalyzer.prototype.duplicate = function(file, hash) {
  var
    _extension = path.extname(file),
    _base = path.basename(file, _extension);

  fs.writeFileSync(this.root + '/' + _base + '-' + hash + _extension, fs.readFileSync(file));
};

module.exports = FileAnalyzer;
