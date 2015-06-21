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
      _hash = '921830d2672cd407a8589aa7995a82ea9a193f48';

    _hashes = fingerprinter.hashFiles([
      _file
    ]);

    expect(_hashes[_hash].hash).to.equal(_hash);
    expect(_hashes[_hash].extension).to.equal('.json');
    expect(_hashes[_hash].file).to.equal('persister.json');
    expect(_hashes[_hash].path).to.equal('./test/fixtures');
  });
});
