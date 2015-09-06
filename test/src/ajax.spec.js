import Ajax from '../../src/ajax';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiString);

var fixtureUrl = 'base/test/src/fixtures/response.json';

describe('Ajax', () => {
  describe('get', () => {
    it('should resolve the promise when fetching a file', () => {
      let request = new Ajax().get(fixtureUrl);

      request.should.be.fulfilled;
    });

    it('should resolve the promise with properties xhr url and text', () => {
      let request = new Ajax().get(fixtureUrl);

      request.should.to.eventually.have.property('xhr');
      request.should.to.eventually.have.property('url');
      request.should.to.eventually.have.property('text');
    });

    it('should expose the url on resolving the promise', () => {
      let request = new Ajax().get(fixtureUrl);

      request.then(result => {
        chai.expect(result.url).to.endsWith(fixtureUrl);
      });
    });

    it('should expose the data on resolving the promise', () => {
      let request = new Ajax().get(fixtureUrl);

      request.then(result => {
        chai.expect(result.text.indexOf('Bob')).to.be.at.least(1);
      });
    });

    it('should reject then promise when not finding a file', () => {
      let request = new Ajax().get(fixtureUrl + '--');

      request.should.be.rejected;
    });

    it('should set the withCredentials flag on the xhr', () => {
      let request = new Ajax().get(fixtureUrl, {
        withCredentials: true
      });

      request.then(result => {
        result.xhr.withCredentials.should.be.true;
      });
    });
  });
});
