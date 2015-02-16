'use strict';

var
  _ = require('lodash'),
  path = require('path'),
  async = require('async'),
  fs = require('fs'),
  crypto = require('crypto'),
  FileAnalyzer = require('../modules/file-analyzer');

function Fingerprinter(root) {
  this.fileAnalyzer = new FileAnalyzer(root);
}

Fingerprinter.prototype.hashFiles = function(files) {
  var
    _that = this,
    _hash = crypto.createHash('sha1'),
    _prints = {},
    _atFile;

  _hash.setEncoding('hex');

  async.forEach(files, function(file, next) {
    _atFile = file;
    _hash.update(fs.readFileSync(file));
    next();
  }, function() {
    var _digest = _hash.digest('hex');

    _prints[path.basename(_atFile)] = _digest;
    _that.fileAnalyzer.duplicate(_atFile, _digest);
  });

  return _prints;
};

module.exports = Fingerprinter;
