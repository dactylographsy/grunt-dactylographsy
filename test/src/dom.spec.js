import {Css, Js} from '../../src/dom';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {DOMUtil} from '../utils';

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

var
  domUtils,
  expect;

describe('DOM', () => {
  before(() => {
    expect = chai.expect;
    domUtils = new DOMUtil();
  });

  describe('Css', () => {
    describe('API', () => {
      let
        css;

      beforeEach(() => {
        domUtils.removeAll();

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
    });

    describe('injectWithText', () => {
      var
        css,
        code = '.foo {color: red}';

      beforeEach(() => {
        domUtils.removeAll();

        css = new Css(document.querySelector('body'), {
          enableLogging: false
        });
      });

      it('should resolve the promise when injecting', () => {
        let injection = css.injectWithText(code, 'css-promise-check.js');

        injection.should.be.fulfilled;
      });

      it('should create a style-tag when injecting', () => {
        let
          url = 'css-tag-check.css',
          injection = css.injectWithText(code, url);

        expect(domUtils.findCssByDataUrl(url)).to.have.length.above(0);
      });

      it('should should flag the injection with a data-url', () => {
        let
          url = 'css-data-url-check.css',
          injection = css.injectWithText(code, url);

        expect(domUtils.findCssByDataUrl(url)).to.have.length.above(0);
      });

      it('should should inject the code into the script-tag', () => {
        let
          url = 'css-code-check.css',
          injection = css.injectWithText(code, url);

        expect(domUtils.findCssByDataUrl(url)[0].innerText).to.equal(code);
      });
    });

    describe('injectWithUrl', () => {
      var
        css;

      beforeEach(() => {
        domUtils.removeAll();

        css = new Css(document.querySelector('body'), {
          enableLogging: false
        });
      });

      it('should resolve the promise when injecting straight away', () => {
        let
          urls = {raw: 'promise-check.css'},
          injection = css.injectWithUrl(urls, 'raw');

        injection.should.be.fulfilled;
      });

      it('should create a style-tag when injecting', () => {
        let
          urls = {raw: 'css-tag-check.css'},
          injection = css.injectWithUrl(urls, 'raw');

        expect(domUtils.findCssByDataUrl(urls.raw)).to.have.length.above(0);
      });

      it('should should flag the injection with a data-url', () => {
        let
          urls = {raw: 'css-data-url-check.css'},
          injection = css.injectWithUrl(urls, 'raw');

        expect(domUtils.findCssByDataUrl(urls.raw)).to.have.length.above(0);
      });

      it('should should set the href on the script-tag', () => {
        let
          urls = {raw: 'js-src-check.css'},
          injection = css.injectWithUrl(urls, 'raw');

        expect(domUtils.findCssByDataUrl(urls.raw)[0]).to.have.property('href');
      });
    });
  });

  describe('Js', () => {
    describe('API', () => {
      let
        js;

      beforeEach(() => {
        domUtils.removeAll();

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
    });

    describe('injectWithText', () => {
      var
        js,
        code = 'var a="b";';

      beforeEach(() => {
        domUtils.removeAll();

        js = new Js(document.querySelector('body'), {
          enableLogging: false
        });
      });

      it('should resolve the promise when injecting', () => {
        let
          url = 'promise-check.js',
          injection = js.injectWithText(code, url);

        injection.should.be.fulfilled;
      });

      it('should create a script-tag when injecting', () => {
        let
          url = 'js-tag-check.js',
          injection = js.injectWithText(code, url);

        expect(domUtils.findJsByDataUrl(url)).to.have.length.above(0);
      });

      it('should should flag the injection with a data-url', () => {
        let
          url = 'js-data-url-check.js',
          injection = js.injectWithText(code, url);

        expect(domUtils.findJsByDataUrl(url)).to.have.length.above(0);
      });

      it('should should inject the code into the script-tag', () => {
        let
          url = 'js-code-check.js',
          injection = js.injectWithText(code, url);

        expect(domUtils.findJsByDataUrl(url)[0].innerText).to.equal(code);
      });
    });

    describe('injectWithUrl', () => {
      var
        js;

      beforeEach(() => {
        domUtils.removeAll();

        js = new Js(document.querySelector('body'), {
          enableLogging: false
        });
      });

      it('should resolve the promise when injecting straight away', () => {
        let
          urls = {raw: 'promise-check.js'},
          injection = js.injectWithUrl(urls, 'raw');

        injection.should.be.fulfilled;
      });

      it('should create a script-tag when injecting', () => {
        let
          urls = {raw: 'js-tag-check.js'},
          injection = js.injectWithUrl(urls, 'raw');

        expect(domUtils.findJsByDataUrl(urls.raw)).to.have.length.above(0);
      });

      it('should should flag the injection with a data-url', () => {
        let
          urls = {raw: 'js-data-url-check.js'},
          injection = js.injectWithUrl(urls, 'raw');

        expect(domUtils.findJsByDataUrl(urls.raw)).to.have.length.above(0);
      });

      it('should should set the src on the script-tag', () => {
        let
          urls = {raw: 'js-src-check.js'},
          injection = js.injectWithUrl(urls, 'raw');

        expect(domUtils.findJsByDataUrl(urls.raw)[0]).to.have.property('src');
      });

      it('should should flag the script not being async', () => {
        let
          urls = {raw: 'js-async-check.js'},
          injection = js.injectWithUrl(urls, 'raw');

        expect(domUtils.findJsByDataUrl(urls.raw)[0].async).to.be.false;
      });
    });
  });
});
