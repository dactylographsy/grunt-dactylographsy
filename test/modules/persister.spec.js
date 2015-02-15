var expect = require('chai').expect,
    fs = require('fs');

var Persister = require('../../tasks/modules/persister'),
    persister;

var file = './test/fixtures/persister.json';

describe('Persister specification', function() {
  before(function() {
  })

  beforeEach(function() {
    persister = new Persister(file);
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

    expect(read.foo).to.equal('bar');
  });
});
