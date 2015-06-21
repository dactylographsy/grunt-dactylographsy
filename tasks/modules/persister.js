var
  fs = require('fs');

function Persister(packageMeta, root, location, rootUrl) {
  this._packageMeta = packageMeta;
  this._root = root;
  this._location = location;
  this._rootUrl = rootUrl;
}

Persister.prototype.write = function(hashes) {
  var data = {};

  data.package = this._packageMeta;
  data.hashes = hashes;
  data.rootUrl = this._rootUrl;

  var json = JSON.stringify(data, null, 2);

  fs.writeFileSync(this._root + '/' + this._location, json);

  return json;
};

Persister.prototype.read = function() {
  var json = fs.readFileSync(this._root + '/' + this._location);

  return JSON.parse(json);
};

module.exports = Persister;
