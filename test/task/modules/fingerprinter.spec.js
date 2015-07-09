var expect = require('chai').expect,
    fs = require('fs');

var Fingerprinter = require('../../../tasks/modules/fingerprinter'),
    fingerprinter;

describe('Fingerprinter specification', () => {
  beforeEach(() => {
  });

  beforeEach(() => {
    fingerprinter = new Fingerprinter('./test/task/fixtures', []);
  });

  it('hashes a set of files', () => {
    var
      _hashes,
      _file = './test/task/fixtures/persister.json',
      _hash = '921830d2672cd407a8589aa7995a82ea9a193f48';

    _hashes = fingerprinter.hashFiles([
      _file
    ]);

    expect(_hashes[_hash].hash).to.equal(_hash);
    expect(_hashes[_hash].extension).to.equal('.json');
    expect(_hashes[_hash].file).to.equal('persister.json');
    expect(_hashes[_hash].path).to.equal('./test/task/fixtures');
  });
});
