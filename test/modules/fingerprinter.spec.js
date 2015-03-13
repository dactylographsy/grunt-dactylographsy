var expect = require('chai').expect,
    fs = require('fs');

var Fingerprinter = require('../../tasks/modules/fingerprinter'),
    fingerprinter;

describe('Fingerprinter specification', function() {
  beforeEach(function() {
  });

  beforeEach(function() {
    fingerprinter = new Fingerprinter('./test/fixtures');
  });

  it('hashes a set of files', function() {
    var
      _hashes,
      _file = './test/fixtures/persister.json',
      _hash = '6bc61871aef6caed535a487b79e5c76506413ae1';

    _hashes = fingerprinter.hashFiles([
      _file
    ]);

    expect(_hashes[_hash].hash).to.equal(_hash);
    expect(_hashes[_hash].extension).to.equal('.json');
    expect(_hashes[_hash].file).to.equal('persister.json');
    expect(_hashes[_hash].path).to.equal('./test/fixtures');
  });
});
