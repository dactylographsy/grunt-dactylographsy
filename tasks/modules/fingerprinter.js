'use strict';

var
  _ = require('lodash'),
  path = require('path'),
  async = require('async'),
  fs = require('fs'),
  crypto = require('crypto');

function Fingerprinter() {
}

Fingerprinter.prototype.hashFiles = function(files) {
  var
    _hash = crypto.createHash('sha1'),
    _prints = {},
    _atFile;

  _hash.setEncoding('hex');

  async.forEach(files, function(file, next) {
    _atFile = file;
    _hash.update(fs.readFileSync(file));
    next();
  }, function() {
    _prints[path.basename(_atFile)] = _hash.digest('hex');
  });

  return _prints;
};

module.exports = Fingerprinter;
