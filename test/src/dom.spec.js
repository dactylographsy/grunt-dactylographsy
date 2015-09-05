import {Css, Js} from '../../src/dom';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('DOM', () => {
  before(() => {
  });

  describe('Css', () => {
    describe('API', () => {
      let
        css;

      beforeEach(() => {
        css = new Css(null, {
          enableLogging: false
        });
      })

      it('should have a function to inject by src or text', () => {
        css.inject.should.be.a('function');
      });

      it('should have a function to inject with src (by url)', () => {
        css.injectWithUrl.should.be.a('function');
      });

      it('should have a function to inject with text', () => {
        css.injectWithText.should.be.a('function');
      });

      it('should have a function to cache an url', () => {
        css.ensureCache.should.be.a('function');
      });
    })
  });

  describe('Js', () => {
    describe('API', () => {
      let
        js;

      beforeEach(() => {
        js = new Js(null, {
          enableLogging: false
        });
      })

      it('should have a function to inject by src or text', () => {
        js.inject.should.be.a('function');
      });

      it('should have a function to inject with src (by url)', () => {
        js.injectWithUrl.should.be.a('function');
      });

      it('should have a function to inject with text', () => {
        js.injectWithText.should.be.a('function');
      });

      it('should have a function to cache an url', () => {
        js.ensureCache.should.be.a('function');
      });
    })
  });
});
