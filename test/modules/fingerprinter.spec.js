var expect = require('chai').expect,
    fs = require('fs');

var Fingerprinter = require('../../tasks/modules/fingerprinter'),
    fingerprinter;

describe('Persister specification', function() {
  beforeEach(function() {
  });

  beforeEach(function() {
    fingerprinter = new Fingerprinter();
  });

  it('hases a set of files', function() {
    var
      _hashes,
      _file = './test/fixtures/persister.json',
      _hash = '92429dc13b570a63872bd1e8a1a132cfc98420d1';

    _hashes = fingerprinter.hashFiles([
      _file
    ]);

    expect(_hashes['persister.json']).to.equal(_hash);
  });
});
