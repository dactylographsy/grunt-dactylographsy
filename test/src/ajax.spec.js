import Ajax from '../../src/ajax';
import {XMLHttpRequest} from '../stubs';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('Ajax specification', () => {
  beforeEach(function() {
    global.XMLHttpRequest = new XMLHttpRequest().stub();
  });

  it('should create an XMLHttpRequest', () => {
    let
      request = new Ajax().get('random/url');

    global.XMLHttpRequest.should.have.been.called;
  });
});
