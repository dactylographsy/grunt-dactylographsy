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
	
	var _injector = __webpack_require__(3);
	
	var _injector2 = _interopRequireDefault(_injector);
	
	var Dactylographsy = (function () {
	  function Dactylographsy() {
	    var options = arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Dactylographsy);
	
	    var _options$autorun = options.autorun;
	    var autorun = _options$autorun === undefined ? false : _options$autorun;
	
	    this.hookIntoDom();
	    this.readConfiguration();
	    this.cache = new _cache2['default']();
	
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
	        return new _injector.Manifest(url).get();
	      })).then(function (manifests) {
	        console.info('Fetched all manifests, ' + manifests.length + ' in total.');
	
	        _this.cache.set(manifests, 'manifests', 'manifests');
	
	        return new _injector2['default'](inject ? _this.injectInto : undefined, manifests, _this.config).inject();
	      });
	    }
	  }, {
	    key: 'restore',
	    value: function restore() {
	      var _this2 = this;
	
	      return this.cache.get('manifests').then(function (manifests) {
	        console.info('Resotring with manifests in cache later refreshing via network.');
	
	        new _injector2['default'](_this2.injectInto, manifests, _this2.config).inject();
	
	        return false;
	      })['catch'](function () {
	        console.info('No manifests in cache, refreshing via network.');
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
	            console.info('Flushing cache due to exeeding TTL of ' + _this3.config.ttl + '.');
	
	            _this3.cache.flush();
	          } else {
	            _this3.cache.set(++clt, 'plain', 'clt');
	          }
	        });
	      }
	
	      return this.restore().then(function (injectedFromCache) {
	        return _this3.refresh(injectedFromCache);
	      });
	    }
	  }]);
	
	  return Dactylographsy;
	})();
	
	exports['default'] = Dactylographsy;
	module.exports = exports['default'];

/***/ },
/* 2 */
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
	
	var Cache = (function () {
	  function Cache() {
	    var options = arguments[0] === undefined ? {} : arguments[0];
	
	    _classCallCheck(this, Cache);
	
	    this.options = options;
	
	    this.cachePrefix = this.options.cachePrefix || '__dactylographsy__';
	  }
	
	  _createClass(Cache, [{
	    key: 'get',
	    value: function get(key, defaultValue) {
	      var _this = this;
	
	      return new Promise(function (resolve, reject) {
	        var _item = JSON.parse(localStorage.getItem('' + _this.cachePrefix + '-' + key));
	
	        if (_item === null && defaultValue !== undefined) {
	          _this.set(defaultValue, 'plain', key);
	
	          resolve(defaultValue);
	
	          return;
	        }
	
	        if (_item) {
	          console.info('Found item with key: ' + key + ' in cache.');
	
	          resolve(_item.code);
	        } else {
	          console.info('Couldn\'t find item with key: ' + key + ' in cache.');
	
	          reject();
	        }
	      });
	    }
	  }, {
	    key: 'has',
	    value: function has(key) {
	      return localStorage.getItem(key) !== null;
	    }
	  }, {
	    key: 'set',
	    value: function set(code, type, url) {
	      var cached = {
	        now: +new Date(),
	        url: url,
	        code: code,
	        type: type
	      };
	
	      localStorage.setItem('' + this.cachePrefix + '-' + url, JSON.stringify(cached));
	    }
	  }, {
	    key: 'flush',
	    value: function flush() {
	      for (var key in localStorage) {
	        if (key.indexOf(this.cachePrefix) >= 0) {
	          console.log('Removing item ' + key + ' requested by flush.');
	
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
	
	var _dom = __webpack_require__(4);
	
	var _ajax = __webpack_require__(5);
	
	var _ajax2 = _interopRequireDefault(_ajax);
	
	var _cache = __webpack_require__(2);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var Manifest = (function () {
	  function Manifest(url) {
	    _classCallCheck(this, Manifest);
	
	    this.url = url;
	    this.cache = new _cache2['default']();
	  }
	
	  _createClass(Manifest, [{
	    key: 'get',
	    value: function get() {
	      return new _ajax2['default']().get(this.url).then(function (response) {
	        var responseText = response.text;
	        var responseUrl = response.url;
	
	        console.info('Fetched manifest from url: ' + responseUrl + '.');
	
	        return JSON.parse(responseText);
	      }, function (xhr) {
	        console.error('Could not fetch manifest with url: ' + xhr.responseURL + '!');
	      });
	    }
	  }]);
	
	  return Manifest;
	})();
	
	exports.Manifest = Manifest;
	
	var Injector = (function () {
	  function Injector(injectInto, manifests) {
	    var _this = this;
	
	    var options = arguments[2] === undefined ? {} : arguments[2];
	
	    _classCallCheck(this, Injector);
	
	    this.manifests = {};
	    this.injectInto = injectInto;
	
	    manifests.forEach(function (manifest) {
	      _this.manifests[manifest['package']] = manifest;
	    });
	
	    this.prefix = options.prefix || '';
	    this.order = options.order;
	  }
	
	  _createClass(Injector, [{
	    key: 'inject',
	    value: function inject() {
	      var _this2 = this;
	
	      this.order.map(function (_package) {
	        if (!_this2.manifests[_package]) {
	          console.error('Couldn\'t find package ' + _package + ' from injection order.');
	        } else {
	          _this2.injectManifest(_this2.manifests[_package]);
	        }
	      });
	    }
	  }, {
	    key: 'injectManifest',
	    value: function injectManifest(manifest) {
	      var _this3 = this;
	
	      var hashes = Object.keys(manifest.hashes);
	
	      return hashes.map(function (hash) {
	        var dependency = manifest.hashes[hash];
	
	        _this3.injectDependency(dependency, manifest.rootUrl || manifest['package']);
	
	        return hash;
	      });
	    }
	  }, {
	    key: 'injectDependency',
	    value: function injectDependency(dependency, rootUrl) {
	      switch (dependency.extension) {
	        case '.css':
	          return new _dom.Css(this.injectInto).inject(this.url(dependency, rootUrl));
	        case '.js':
	          return new _dom.Js(this.injectInto).inject(this.url(dependency, rootUrl));
	      }
	    }
	  }, {
	    key: 'basename',
	    value: function basename(path) {
	      return path.replace(/.*\/|\.[^.]*$/g, '');
	    }
	  }, {
	    key: 'url',
	    value: function url(dependency) {
	      var rootUrl = arguments[1] === undefined ? '' : arguments[1];
	
	      var basename = this.basename(dependency.file);
	
	      return '' + this.prefix + '/' + dependency.path + '/' + rootUrl + '/' + basename + '-' + dependency.hash + '' + dependency.extension;
	    }
	  }]);
	
	  return Injector;
	})();
	
	exports['default'] = Injector;

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
	
	var _cache = __webpack_require__(2);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var _ajax = __webpack_require__(5);
	
	var _ajax2 = _interopRequireDefault(_ajax);
	
	var Js = (function () {
	  function Js(injectInto) {
	    _classCallCheck(this, Js);
	
	    this.injectInto = injectInto;
	    this.cache = new _cache2['default']();
	  }
	
	  _createClass(Js, [{
	    key: 'injectWithText',
	    value: function injectWithText(text) {
	      var _this = this;
	
	      return new Promise(function (resolve) {
	        var script = document.createElement('script');
	
	        script.defer = true;
	
	        script.text = text;
	
	        if (_this.injectInto) {
	          _this.injectInto.appendChild(script);
	        }
	
	        resolve(script);
	      });
	    }
	  }, {
	    key: 'injectWithUrl',
	    value: function injectWithUrl(url) {
	      var _this2 = this;
	
	      return new Promise(function (resolve) {
	        // Create script element and set its type
	        var script = document.createElement('script');
	
	        script.type = 'text/javascript';
	        script.async = false;
	
	        // Bind to readyState or register ´onload´ callback
	        if (script.readyState) {
	          // Callback for IE's `onreadystatechange` (I feel seesick)
	          script.onreadystatechange = function () {
	            if (script.readyState === 'loaded' || script.readyState === 'complete') {
	              script.onreadystatechange = null;
	
	              _this2.cache(url);
	            }
	          };
	        } else {
	          // Bind `onload` callback on script element
	          script.onload = function () {
	            _this2.ensureCache(url);
	          };
	        }
	
	        // Set the url
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
	
	      return new Promise(function (resolve) {
	        if (_this3.cache.has(url)) {
	          resolve();
	        }
	
	        return new _ajax2['default']().get(url).then(function (response) {
	          var responseText = response.text;
	
	          _this3.cache.set(responseText, 'js', url);
	
	          resolve();
	        });
	      });
	    }
	  }, {
	    key: 'inject',
	    value: function inject(url) {
	      var _this4 = this;
	
	      return this.cache.get(url).then(function (text) {
	        return _this4.injectWithText(text);
	      })['catch'](function () {
	        return _this4.injectWithUrl(url);
	      });
	    }
	  }]);
	
	  return Js;
	})();
	
	exports.Js = Js;
	
	var Css = (function () {
	  function Css(injectInto) {
	    _classCallCheck(this, Css);
	
	    this.injectInto = injectInto;
	    this.cache = new _cache2['default']();
	  }
	
	  _createClass(Css, [{
	    key: 'ensureCache',
	    value: function ensureCache(url) {
	      var _this5 = this;
	
	      return new Promise(function (resolve) {
	        if (_this5.cache.has(url)) {
	          resolve();
	        }
	
	        return new _ajax2['default']().get(url).then(function (response) {
	          var responseText = response.text;
	
	          _this5.cache.set(responseText, 'css', url);
	
	          resolve();
	        });
	      });
	    }
	  }, {
	    key: 'injectWithUrl',
	    value: function injectWithUrl(url) {
	      var _this6 = this;
	
	      return new Promise(function (resolve) {
	        var link = document.createElement('link');
	
	        link = document.createElement('link');
	
	        link.type = 'text/css';
	        link.rel = 'stylesheet';
	
	        link.href = url;
	
	        if (_this6.injectInto) {
	          _this6.injectInto.appendChild(link);
	        }
	
	        _this6.ensureCache(url);
	
	        resolve(link);
	      });
	    }
	  }, {
	    key: 'injectWithText',
	    value: function injectWithText(text) {
	      var _this7 = this;
	
	      return new Promise(function (resolve) {
	        var style = document.createElement('link');
	
	        style = document.createElement('style');
	
	        style.textContent = text;
	
	        if (_this7.injectInto) {
	          _this7.injectInto.appendChild(style);
	        }
	
	        resolve(style);
	      });
	    }
	  }, {
	    key: 'inject',
	    value: function inject(url) {
	      var _this8 = this;
	
	      return this.cache.get(url).then(function (text) {
	        return _this8.injectWithText(text);
	      })['catch'](function () {
	        return _this8.injectWithUrl(url);
	      });
	    }
	  }]);
	
	  return Css;
	})();
	
	exports.Css = Css;

/***/ },
/* 5 */
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
	          resolve({
	            xhr: xhr,
	            text: xhr.responseText,
	            url: xhr.responseURL
	          });
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