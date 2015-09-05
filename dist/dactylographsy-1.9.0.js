/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

        'use strict';

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        var _dactylographsy = __webpack_require__(1);

        var _dactylographsy2 = _interopRequireDefault(_dactylographsy);

        if (typeof window !== 'undefined') {
          window.dactylographsy = new _dactylographsy2['default']({
            autorun: true
          });
        }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }

        var _cache = __webpack_require__(2);

        var _cache2 = _interopRequireDefault(_cache);

        var _injector = __webpack_require__(4);

        var _injector2 = _interopRequireDefault(_injector);

        var _log = __webpack_require__(3);

        var _log2 = _interopRequireDefault(_log);

        var Dactylographsy = (function () {
          function Dactylographsy() {
            var options = arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, Dactylographsy);

            var _options$autorun = options.autorun;

            var autorun = _options$autorun === undefined ? false : _options$autorun;
            var _options$enableLogging = options.enableLogging;
            var enableLogging = _options$enableLogging === undefined ? false : _options$enableLogging;

            this.log = new _log2['default'](enableLogging);
            this.hookIntoDom();
            this.readConfiguration();
            this.cache = new _cache2['default']({
              appPrefix: this.config.appPrefix
            });

            if (autorun) {
              this.run();
            }
          }

          _createClass(Dactylographsy, [{
            key: 'hookIntoDom',
            value: function hookIntoDom() {
              if (typeof document === 'undefined') {
                return;
              }

              this.executingScript = document.getElementById('dactylographsy');
              this.injectInto = document.body || document.head || document.getElementsByTagName('script')[0];
            }
          }, {
            key: 'readConfiguration',
            value: function readConfiguration() {
              this.manifestUrls = this.readAttrOnScript('manifests');
              this.config = this.readAttrOnScript('config');
            }
          }, {
            key: 'refresh',
            value: function refresh() {
              var _this = this;

              var inject = arguments[0] === undefined ? true : arguments[0];

              return Promise.all(this.manifestUrls.map(function (url) {
                return new _injector.Manifest(url, _this.config).get();
              })).then(function (manifests) {
                _this.log.info('Fetched all manifests, ' + manifests.length + ' in total.');

                _this.cache.set(manifests, 'manifests', 'manifests');

                return new _injector2['default'](inject ? _this.injectInto : undefined, manifests, _this.config).inject();
              });
            }
          }, {
            key: 'restore',
            value: function restore() {
              var _this2 = this;

              return this.cache.get('manifests').then(function (manifests) {
                _this2.log.info('Resotring with manifests in cache later refreshing via network (delayed).');

                new _injector2['default'](_this2.injectInto, manifests, _this2.config).inject();

                return false;
              });
            }
          }, {
            key: 'readAttrOnScript',
            value: function readAttrOnScript(attr) {
              if (!this.executingScript) {
                return false;
              }

              var _attr = this.executingScript.getAttribute('data-' + attr);

              return _attr ? JSON.parse(_attr) : undefined;
            }
          }, {
            key: 'run',
            value: function run() {
              var _this3 = this;

              if (this.config.ttl) {
                this.cache.get('clt', 0).then(function (clt) {
                  if (clt >= _this3.config.ttl) {
                    _this3.log.info('Flushing cache due to exeeding TTL of ' + _this3.config.ttl + '.');

                    _this3.cache.flush();
                  } else {
                    _this3.cache.set(++clt, 'plain', 'clt');
                  }
                });
              }

              return this.config.cacheManifests === false ? this.refresh() : this.restore().then(function (injectedFromCache) {
                var _config$refreshDelay = _this3.config.refreshDelay;
                var refreshDelay = _config$refreshDelay === undefined ? 5000 : _config$refreshDelay;

                return new Promise(function (resolve, reject) {
                  window.setTimeout(function () {
                    _this3.refresh(injectedFromCache).then(resolve, reject);
                  }, refreshDelay);
                });
              })['catch'](function () {
                _this3.log.info('No manifests in cache, refreshing via network.');

                return _this3.refresh();
              });
            }
          }]);

          return Dactylographsy;
        })();

        exports['default'] = Dactylographsy;
        module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }

        var _log = __webpack_require__(3);

        var _log2 = _interopRequireDefault(_log);

        var Cache = (function () {
          function Cache() {
            var options = arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, Cache);

            var defaultPrefix = '__dactylographsy';
            var _options$enableLogging = options.enableLogging;
            var enableLogging = _options$enableLogging === undefined ? false : _options$enableLogging;

            this.log = new _log2['default'](enableLogging);
            this.options = options;
            this.cachePrefix = this.options.cachePrefix || defaultPrefix;
            this.isSupported = this.supported();

            if (this.options.appPrefix) {
              this.cachePrefix = '' + this.cachePrefix + '--' + this.options.appPrefix + '__';
            } else {
              this.cachePrefix += '__';
            }
          }

          _createClass(Cache, [{
            key: 'get',
            value: function get(key, defaultValue) {
              var _this = this;

              return new Promise(function (resolve, reject) {
                if (!_this.isSupported) {
                  reject();
                }

                var _item = JSON.parse(localStorage.getItem('' + _this.cachePrefix + '-' + key));

                if (_item === null && defaultValue !== undefined) {
                  _this.set(defaultValue, 'plain', key);

                  resolve(defaultValue);

                  return;
                }

                if (_item) {
                  _this.log.info('Found item with key: ' + key + ' in cache.');

                  resolve(_item.code);
                } else {
                  _this.log.info('Couldn\'t find item with key: ' + key + ' in cache.');

                  reject();
                }
              });
            }
          }, {
            key: 'has',
            value: function has(key) {
              if (!this.isSupported) {
                return false;
              }

              return localStorage.getItem(key) !== null;
            }
          }, {
            key: 'set',
            value: function set(code, type, url) {
              var singularBy = arguments[3] === undefined ? false : arguments[3];

              if (!this.isSupported) {
                return false;
              }
              if (singularBy) {
                this.dedupe(singularBy);
              }

              var cached = {
                now: +new Date(),
                url: url,
                code: code,
                type: type
              };

              localStorage.setItem('' + this.cachePrefix + '-' + url, JSON.stringify(cached));

              return true;
            }
          }, {
            key: 'flush',
            value: function flush() {
              if (!this.isSupported) {
                return false;
              }

              for (var key in localStorage) {
                if (key.indexOf(this.cachePrefix) >= 0) {
                  this.log.log('Removing item ' + key + ' requested by flush.');

                  localStorage.removeItem(key);
                }
              }

              return true;
            }
          }, {
            key: 'supported',
            value: function supported() {
              var item = '__dactylographsy__feature-detection';

              try {
                localStorage.setItem(item, item);
                localStorage.removeItem(item);

                return true;
              } catch (e) {
                this.log.warn('Localstorage not supported in browser - no caching!');

                return false;
              }
            }
          }, {
            key: 'dedupe',
            value: function dedupe(singularBy) {
              for (var key in localStorage) {
                if (key.indexOf(this.cachePrefix) >= 0 && key.indexOf(singularBy) >= 0) {
                  this.log.log('Deduping by ' + singularBy + ' before adding dupe in ' + key + '.');

                  localStorage.removeItem(key);
                }
              }
            }
          }]);

          return Cache;
        })();

        exports['default'] = Cache;
        module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        var Log = (function () {

          // Not level bound logging needed yet

          function Log() {
            var enabled = arguments[0] === undefined ? true : arguments[0];

            _classCallCheck(this, Log);

            this.enabled = enabled;

            if (this.enabled) {
              this.console = window.console;
            }
          }

          _createClass(Log, [{
            key: "log",
            value: function log() {
              if (this.enabled) {
                var _console;

                (_console = this.console).log.apply(_console, arguments);
              }
            }
          }, {
            key: "info",
            value: function info() {
              if (this.enabled) {
                var _console2;

                (_console2 = this.console).info.apply(_console2, arguments);
              }
            }
          }, {
            key: "warn",
            value: function warn() {
              if (this.enabled) {
                var _console3;

                (_console3 = this.console).warn.apply(_console3, arguments);
              }
            }
          }, {
            key: "debug",
            value: function debug() {
              if (this.enabled) {
                var _console4;

                (_console4 = this.console).debug.apply(_console4, arguments);
              }
            }
          }, {
            key: "error",
            value: function error() {
              if (this.enabled) {
                var _console5;

                (_console5 = this.console).error.apply(_console5, arguments);
              }
            }
          }]);

          return Log;
        })();

        exports["default"] = Log;
        module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }

        var _dom = __webpack_require__(5);

        var _ajax = __webpack_require__(6);

        var _ajax2 = _interopRequireDefault(_ajax);

        var _log = __webpack_require__(3);

        var _log2 = _interopRequireDefault(_log);

        var Manifest = (function () {
          function Manifest(url, config) {
            _classCallCheck(this, Manifest);

            var _config$enableLogging = config.enableLogging;
            var enableLogging = _config$enableLogging === undefined ? false : _config$enableLogging;

            this.log = new _log2['default'](enableLogging);
            this.url = url;
          }

          _createClass(Manifest, [{
            key: 'get',
            value: function get() {
              var _this = this;

              return new _ajax2['default']().get(this.url).then(function (response) {
                var responseText = response.text;
                var responseUrl = response.url;

                _this.log.info('Fetched manifest from url: ' + responseUrl + '.');

                return JSON.parse(responseText);
              }, function (xhr) {
                _this.log.error('Could not fetch manifest with url: ' + xhr.responseURL + '!');
              });
            }
          }]);

          return Manifest;
        })();

        exports.Manifest = Manifest;

        var Injector = (function () {
          function Injector(injectInto, manifests) {
            var _this2 = this;

            var options = arguments[2] === undefined ? {} : arguments[2];

            _classCallCheck(this, Injector);

            var _options$enableLogging = options.enableLogging;
            var enableLogging = _options$enableLogging === undefined ? false : _options$enableLogging;

            this.log = new _log2['default'](enableLogging);
            this.manifests = {};
            this.injectInto = injectInto;

            manifests.forEach(function (manifest) {
              _this2.manifests[manifest['package']] = manifest;
            });

            this.options = options;
            this.prefix = options.prefix;
            this.order = options.order;
          }

          _createClass(Injector, [{
            key: 'inject',
            value: function inject() {
              var _this3 = this;

              this.order.map(function (_package) {
                if (!_this3.manifests[_package]) {
                  _this3.log.error('Couldn\'t find package ' + _package + ' from injection order.');
                } else {
                  _this3.injectManifest(_this3.manifests[_package]);
                }
              });
            }
          }, {
            key: 'injectManifest',
            value: function injectManifest(manifest) {
              var _this4 = this;

              var hashes = Object.keys(manifest.hashes);

              return hashes.map(function (hash) {
                var dependency = manifest.hashes[hash],
                    rootUrl = undefined;

                rootUrl = [manifest.rootUrl, manifest.packageUrl].filter(function (_url) {
                  return _url !== undefined && _url !== null;
                }).join('/');

                _this4.injectDependency(dependency, rootUrl);

                return hash;
              });
            }
          }, {
            key: 'injectDependency',
            value: function injectDependency(dependency, rootUrl) {
              switch (dependency.extension) {
                case '.css':
                  return new _dom.Css(this.injectInto, this.options).inject(this.urls(dependency, rootUrl));
                case '.js':
                  return new _dom.Js(this.injectInto, this.options).inject(this.urls(dependency, rootUrl));
              }
            }
          }, {
            key: 'basename',
            value: function basename(path) {
              return path.replace(/.*\/|\.[^.]*$/g, '');
            }
          }, {
            key: 'urls',
            value: function urls(dependency) {
              var rootUrl = arguments[1] === undefined ? '' : arguments[1];

              var basename = this.basename(dependency.file),
                  url = undefined;

              url = [this.prefix, rootUrl, dependency.path].filter(function (_url) {
                return _url !== undefined && _url !== null;
              }).join('/');

              return {
                printed: '/' + url + '/' + basename + '-' + dependency.hash + '' + dependency.extension,
                raw: '/' + url + '/' + basename + '' + dependency.extension,
                singularBy: '/' + url + '/' + basename + '' + dependency.extension
              };
            }
          }]);

          return Injector;
        })();

        exports['default'] = Injector;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { 'default': obj };
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }

        var _cache = __webpack_require__(2);

        var _cache2 = _interopRequireDefault(_cache);

        var _ajax = __webpack_require__(6);

        var _ajax2 = _interopRequireDefault(_ajax);

        var _log = __webpack_require__(3);

        var _log2 = _interopRequireDefault(_log);

        var Js = (function () {
          function Js(injectInto) {
            var config = arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, Js);

            var _config$enableLogging = config.enableLogging;
            var enableLogging = _config$enableLogging === undefined ? false : _config$enableLogging;

            this.injectInto = injectInto;

            this.cache = new _cache2['default']({
              appPrefix: config.appPrefix,
              enableLogging: enableLogging
            });

            this.cacheDelay = config.cacheDelay || 5000;

            this.log = new _log2['default'](enableLogging);
          }

          _createClass(Js, [{
            key: 'injectWithText',
            value: function injectWithText(text, url) {
              var _this = this;

              return new Promise(function (resolve) {
                var script = document.createElement('script');

                script.defer = true;

                script.setAttribute('data-dactylographsy-url', url);

                script.text = text;

                if (_this.injectInto) {
                  _this.injectInto.appendChild(script);
                }

                resolve(script);
              });
            }
          }, {
            key: 'injectWithUrl',
            value: function injectWithUrl(urls) {
              var _this2 = this;

              var whichUrl = arguments[1] === undefined ? 'printed' : arguments[1];

              return new Promise(function (resolve) {
                // Create script element and set its type
                var script = document.createElement('script'),
                    url = urls[whichUrl];

                script.type = 'text/javascript';
                script.async = false;

                script.setAttribute('data-dactylographsy-url', url);

                // Bind to readyState or register ´onload´ callback
                if (script.readyState) {
                  // Callback for IE's `onreadystatechange` (I feel seesick)
                  script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                      script.onreadystatechange = null;

                      _this2.ensureCache(url, urls.singularBy, _this2.cacheDelay);
                    }
                  };
                } else {
                  // Bind `onload` callback on script element
                  script.onload = function () {
                    if (whichUrl === 'printed') {
                      _this2.ensureCache(url, urls.singularBy, _this2.cacheDelay);
                    }
                  };

                  // Inject unprinted without caching in case of error
                  script.onerror = function () {
                    _this2.log.info('Could not fetch JavaScript from ' + url + ' - falling back to unprinted version.');

                    if (whichUrl === 'printed') {
                      _this2.injectWithUrl(urls, 'raw');
                    }
                  };
                }

                script.src = url;

                if (_this2.injectInto) {
                  _this2.injectInto.appendChild(script);
                }

                resolve(script);
              });
            }
          }, {
            key: 'ensureCache',
            value: function ensureCache(url) {
              var _this3 = this;

              var singularBy = arguments[1] === undefined ? false : arguments[1];
              var delay = arguments[2] === undefined ? 0 : arguments[2];

              return new Promise(function (resolve, reject) {
                if (_this3.cache.has(url)) {
                  resolve();
                }

                _this3.log.info('Loading CSS from ' + url + ' for cache in ' + delay + '.');

                window.setTimeout(function () {
                  return new _ajax2['default']().get(url).then(function (response) {
                    var responseText = response.text;

                    _this3.cache.set(responseText, 'js', url, singularBy);

                    _this3.log.info('Loaded CSS from ' + url + ' now cached.');

                    resolve();
                  })['catch'](function () {
                    reject();
                  });
                }, delay);
              });
            }
          }, {
            key: 'inject',
            value: function inject(urls) {
              var _this4 = this;

              return this.cache.get(urls.printed).then(function (text) {
                return _this4.injectWithText(text, urls.printed);
              })['catch'](function () {
                return _this4.injectWithUrl(urls);
              });
            }
          }]);

          return Js;
        })();

        exports.Js = Js;

        var Css = (function () {
          function Css(injectInto) {
            var config = arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, Css);

            var _config$enableLogging2 = config.enableLogging;
            var enableLogging = _config$enableLogging2 === undefined ? false : _config$enableLogging2;

            this.injectInto = injectInto;

            this.cache = new _cache2['default']({
              appPrefix: config.appPrefix
            });

            this.cacheDelay = config.cacheDelay || 5000;

            this.log = new _log2['default'](enableLogging);
          }

          _createClass(Css, [{
            key: 'ensureCache',
            value: function ensureCache(url) {
              var _this5 = this;

              var singularBy = arguments[1] === undefined ? false : arguments[1];
              var delay = arguments[2] === undefined ? 0 : arguments[2];

              return new Promise(function (resolve, reject) {
                if (_this5.cache.has(url)) {
                  resolve();
                }

                _this5.log.info('Loading CSS from ' + url + ' for cache in ' + delay + '.');

                window.setTimeout(function () {
                  return new _ajax2['default']().get(url).then(function (response) {
                    var responseText = response.text;

                    _this5.cache.set(responseText, 'css', url, singularBy);

                    _this5.log.info('Loaded CSS from ' + url + ' now cached.');

                    resolve();
                  })['catch'](function () {
                    reject();
                  });
                }, delay);
              });
            }
          }, {
            key: 'injectWithUrl',
            value: function injectWithUrl(urls) {
              var _this6 = this;

              var whichUrl = arguments[1] === undefined ? 'printed' : arguments[1];

              return new Promise(function (resolve) {
                var link = document.createElement('link'),
                    url = urls[whichUrl];

                link = document.createElement('link');

                link.type = 'text/css';
                link.rel = 'stylesheet';

                link.setAttribute('data-dactylographsy-url', url);

                link.href = url;

                if (_this6.injectInto) {
                  _this6.injectInto.appendChild(link);
                }

                // Fallback to unprinted assets after cache attempt
                // no callbacks for stylesheet injections (timeouts are worse...)
                if (whichUrl === 'printed') {
                  _this6.ensureCache(url, urls.singularBy, _this6.cacheDelay)['catch'](function () {
                    _this6.log.info('Could not fetch CSS from ' + url + ' - falling back to unprinted version.');

                    _this6.injectWithUrl(urls, 'raw');
                  });
                }

                resolve(link);
              });
            }
          }, {
            key: 'injectWithText',
            value: function injectWithText(text, url) {
              var _this7 = this;

              return new Promise(function (resolve) {
                var link = document.createElement('link');

                link = document.createElement('style');

                link.setAttribute('data-dactylographsy-url', url);

                link.textContent = text;

                if (_this7.injectInto) {
                  _this7.injectInto.appendChild(link);
                }

                resolve(link);
              });
            }
          }, {
            key: 'inject',
            value: function inject(urls) {
              var _this8 = this;

              return this.cache.get(urls.printed).then(function (text) {
                return _this8.injectWithText(text, urls.printed);
              })['catch'](function () {
                return _this8.injectWithUrl(urls);
              });
            }
          }]);

          return Css;
        })();

        exports.Css = Css;

/***/ },
/* 6 */
/***/ function(module, exports) {

        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true
        });

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
          }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
          };
        })();

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
          }
        }

        var Ajax = (function () {
          function Ajax() {
            _classCallCheck(this, Ajax);
          }

          _createClass(Ajax, [{
            key: 'get',
            value: function get(url) {
              var options = arguments[1] === undefined ? {} : arguments[1];

              return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                if ('withCredentials' in xhr) {
                  // XHR for Chrome/Firefox/Opera/Safari.
                  xhr.open('GET', url, true);
                } else if (typeof XDomainRequest !== 'undefined') {
                  // XDomainRequest for IE.
                  xhr = new XDomainRequest();
                  xhr.open('GET', url);
                } else {
                  // CORS not supported.
                  xhr = null;
                }

                if (options.withCredentials) {
                  xhr.withCredentials = true;
                }

                if (options.customHeaders) {
                  options.customHeaders.forEach(function (header) {
                    xhr.setRequestHeader(header.name, header.value);
                  });
                }

                // Response handlers.
                xhr.onload = function () {
                  if (xhr.status >= 400) {
                    reject(xhr);
                  } else {
                    resolve({
                      xhr: xhr,
                      text: xhr.responseText,
                      url: xhr.responseURL
                    });
                  }
                };

                xhr.onerror = function () {
                  reject(xhr);
                };

                xhr.send();
              });
            }
          }]);

          return Ajax;
        })();

        exports['default'] = Ajax;
        module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=dactylographsy.js.map