var expect = require('chai').expect,
    fs = require('fs');

var Fingerprinter = require('../../../tasks/modules/fingerprinter'),
    fingerprinter;

describe('Fingerprinter', () => {
  beforeEach(() => {
    fingerprinter = new Fingerprinter('./test/task/fixtures', []);
  });

  it('hashes a set of files', () => {
    var
      _hashes,
      _file = './test/task/fixtures/persister.json',
      _hash = '3a90e37bec40e44950bedfa81318520c7af53568';

    _hashes = fingerprinter.hashFiles([
      _file
    ]);

    expect(_hashes[_hash].hash).to.equal(_hash);
    expect(_hashes[_hash].extension).to.equal('.json');
    expect(_hashes[_hash].file).to.equal('persister.json');
    expect(_hashes[_hash].path).to.equal('./test/task/fixtures');
  });
});
