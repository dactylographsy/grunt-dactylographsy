var expect = require('chai').expect,
    fs = require('fs');

var Persister = require('../../tasks/modules/persister'),
    persister;

var
  root = './test/fixtures',
  rootUrl = 'singularity',
  file = 'persister.json';

describe('Persister specification', function() {
  before(function() {
  })

  beforeEach(function() {
    persister = new Persister('None', root, file, rootUrl);
  });

  it('creates a file as a store', function() {
    var written = JSON.parse(persister.write({}));

    expect(written).to.be.an.object;
  });

  it('reads from a file as a store', function() {
    var written = JSON.parse(persister.write({
      foo: 'bar'
    }));

    expect(written).to.be.an.object;

    var read = persister.read();

    expect(read.hashes.foo).to.equal('bar');
  });

  it('writes the rootUrl to the manifest', function() {
    var written = JSON.parse(persister.write({
      foo: 'bar'
    }));

    expect(written).to.be.an.object;
    expect(written.rootUrl).to.equal(rootUrl);

    var read = persister.read();

    expect(read.rootUrl).to.equal(rootUrl);
  });
});
