import Injector from '../../src/injector';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiString);

var
  fixtureManifests = [{
    package: 'vertical-1',
    packageUrl: 'vertical-1',
    rootUrl: 'example',
    hashes: {
      hash1: {
        hash: 'hash1',
        file: '1.js',
        extension: '.js'
      },
      hash2: {
        hash: 'hash2',
        file: '2.js',
        extension: '.js'
      },
      hash3: {
        hash: 'hash3',
        file: '1.css',
        extension: '.css'
      }
    }
  }, {
    package: 'vertical-2',
    packageUrl: 'vertical-2',
    rootUrl: 'example',
    hashes: {
      hash1: {
        hash: 'hash4',
        file: '4.js',
        extension: '.js'
      },
      hash2: {
        hash: 'hash5',
        file: '5.css',
        extension: '.css'
      }
    }
  }, {
    package: 'vertical-3',
    packageUrl: 'vertical-3',
    rootUrl: 'example',
    hashes: {}
  }];

describe('Injector', () => {
  describe('inject', () => {
    it('should inject all packages from the configured order', () => {
      let
        injections;
      const
        injector = new Injector(document.querySelector('body'), fixtureManifests, {
          enableLogging: false,
          order: ['vertical-2', 'vertical-1']
        });

      injections = injector.inject();

      injections.should.have.length(2);
      injections.should.include('vertical-1');
      injections.should.include('vertical-2');
    });
  });

  describe('injectManifest', () => {
    it('should inject all dependencies from a manifest', () => {
      let
        dependencies;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      dependencies = injector.injectManifest(fixtureManifests[0]);

      dependencies.filter(entry => entry.hash === 'hash1').should.have.length(1);
      dependencies.filter(entry => entry.hash === 'hash2').should.have.length(1);
      dependencies.filter(entry => entry.hash === 'hash3').should.have.length(1);
    });

    it('should extract all dependencies from a manifest', () => {
      let
        dependencies;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      dependencies = injector.injectManifest(fixtureManifests[0]);

      dependencies.filter(entry => entry.dependency.file === '1.js').should.have.length(1);
      dependencies.filter(entry => entry.dependency.file === '2.js').should.have.length(1);
      dependencies.filter(entry => entry.dependency.file === '1.css').should.have.length(1);
    });

    it('should generate a url from package- and root url', () => {
      let
        dependencies;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      dependencies = injector.injectManifest(fixtureManifests[0]);

      dependencies[0].rootUrl.should.be.equal(`${fixtureManifests[0].rootUrl}/${fixtureManifests[0].packageUrl}`)
    });
  });

  describe('injectDependency', () => {

  });

  describe('urls', () => {
    it('should generate a raw (unprinted) url', () => {
      let
        urls;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      urls = injector.urls(fixtureManifests[0].hashes.hash1, 'root');

      urls.raw.should.equal('/root/1.js');
    });

    it('should generate a printed url', () => {
      let
        urls;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      urls = injector.urls(fixtureManifests[0].hashes.hash1, 'root');

      urls.printed.should.equal('/root/1-hash1.js');
    });

    it('should generate a singlarBy (file) url', () => {
      let
        urls;
      const
        injector = new Injector(document.querySelector('body'), [], {
          enableLogging: false,
          order: []
        });

      urls = injector.urls(fixtureManifests[0].hashes.hash1, 'root');

      urls.singularBy.should.equal('/root/1.js');
    });
  });
});
