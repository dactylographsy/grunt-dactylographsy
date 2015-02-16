'use strict';

var fs = require('fs');

function Persister(root, location) {
  this._root = root;
  this._location = location;
}

Persister.prototype.write = function(data) {
  var json = JSON.stringify(data, null, 2);

  fs.writeFileSync(this._root + '/' + this._location, json);

  return json;
};

Persister.prototype.read = function() {
  var json = fs.readFileSync(this._root + '/' + this._location);

  return JSON.parse(json);
};

module.exports = Persister;
