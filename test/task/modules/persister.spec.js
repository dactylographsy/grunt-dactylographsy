var expect = require('chai').expect,
    fs = require('fs');

var Persister = require('../../../tasks/modules/persister'),
    persister;

var
  root = './test/task/fixtures',
  rootUrl = 'singularity',
  packageUrl = 'timelapse',
  file = 'persister.json';

describe('Persister specification', () => {
  before(() => {
  })

  beforeEach(() => {
    persister = new Persister('None', root, file, rootUrl, packageUrl);
  });

  it('creates a file as a store', () => {
    var written = JSON.parse(persister.write({}));

    expect(written).to.be.an.object;
  });

  it('reads from a file as a store', () => {
    var written = JSON.parse(persister.write({
      foo: 'bar'
    }));

    expect(written).to.be.an.object;

    var read = persister.read();

    expect(read.hashes.foo).to.equal('bar');
  });

  it('writes the rootUrl to the manifest', () => {
    var written = JSON.parse(persister.write({
      foo: 'bar'
    }));

    expect(written).to.be.an.object;
    expect(written.rootUrl).to.equal(rootUrl);

    var read = persister.read();

    expect(read.rootUrl).to.equal(rootUrl);
  });

  it('writes the packageUrl to the manifest', () => {
    var written = JSON.parse(persister.write({
      foo: 'bar'
    }));

    expect(written).to.be.an.object;
    expect(written.packageUrl).to.equal(packageUrl);

    var read = persister.read();

    expect(read.packageUrl).to.equal(packageUrl);
  });
});
