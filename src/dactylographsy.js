/* global window, document, XMLHttpRequest, XDomainRequest */

;(function(root, window, document, undefined) {
  'use strict';

  var
    Dactylographsy,
    initialize,
    manifests,
    config,
    previousDactylographsy = root.Dactylographsy,
    executingScript = document.getElementById('dactylographsy'),
    injectInto = document.body || document.head || document.getElementsByTagName('script')[0],
    queue = {},
    injectionOrder = [];

  Dactylographsy = function(obj) {
    // If already instance return
    if (obj instanceof Dactylographsy) { return obj; }
    // Otherwise creates new instance
    if (!(this instanceof Dactylographsy)) { return new Dactylographsy(obj); }

    // for chaining
    this._wrapped = obj;
  };

  // Create yerself
  root.Dactylographsy = Dactylographsy;
  // Version of our library
  Dactylographsy.VERSION   = '<%= pkg.version %>';

   // Tries to resolve version conflicts by restoring the previously loaded version globally
  Dactylographsy.noConflict = function() {
    // Retore the `previousScandio`
    root.Dactylographsy = previousDactylographsy;

    // Return yerself to continue
    return this;
  };

  Dactylographsy.readAttrOnScript = function(attr) {
    var
      _attr = executingScript.getAttribute('data-' + attr);

    return _attr ? JSON.parse(_attr) : undefined;
  };

  Dactylographsy.ajaxGet = function(url, success, error, options) {
    var
      xhr = new XMLHttpRequest(),
      _options = options || {};

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

    if (_options.withCredentials) {
      xhr.withCredentials = true;
    }

    if (_options.customHeaders) {
      for (var i = 0; i < _options.customHeaders.length; i++) {
        var header = _options.customHeaders[i];
        xhr.setRequestHeader(header.name, header.value);
      }
    }

    // Response handlers.
    xhr.onload = function() {
      success(xhr, xhr.responseText);
    };

    xhr.onerror = function() {
      error(xhr);
    };

    xhr.send();
  };

  Dactylographsy.js = function(url, success) {
    // Create script element and set its type
    var
      script = document.createElement('script');

    script.type = 'text/javascript';

    // Bind to readyState or register ´onload´ callback
    if (script.readyState) {
      // Callback for IE's `onreadystatechange` (I feel seesick)
      script.onreadystatechange = function() {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;

          // Invoke callback if passed and type is function
          if (typeof success === 'function') { success(); }
        }
      };
    } else {
      // Bind `onload` callback on script element
      script.onload = function() {
        // Invoke callback if passed and type is function
        if (typeof success === 'function') { success(); }
      };
    }

    script.async = false;

    // Set the url
    script.src = url;

    injectInto.appendChild(script);

    return url;
  };

  Dactylographsy.basename = function(path) {
    return path.replace(/.*\/|\.[^.]*$/g, '');
  };

  Dactylographsy.fileName = function(dependency, config) {
    var
      _path = (config.files[dependency.file]) ?
        config.files[dependency.file].path :
        dependency.path + '/',
      _prefix = (config.prefix) ?
        config.prefix : '';

    return (config.fingerprint) ? (
      _prefix +
      _path +
      Dactylographsy.basename(dependency.file) +
      '-' +
      dependency.hash +
      dependency.extension
    ) : (
      _prefix +
      _path +
      dependency.file
    );
  };

  Dactylographsy.removeInjectedFile = function(manifest, dependency) {
    delete config.manifests[manifest.package].files[dependency.file];
  };

  Dactylographsy.injectDependency = function(dependency, manifestConfig) {
    switch (dependency.extension) {
      case '.css':
        Dactylographsy.css(
          Dactylographsy.fileName(dependency, manifestConfig)
        );
        break;
      case '.js':
        Dactylographsy.js(
          Dactylographsy.fileName(dependency, manifestConfig)
        );
        break;
    }
  };

  Dactylographsy.injectManifest = function(manifest) {
    var
      _hashes = Object.keys(manifest.hashes),
      _manifestConfig = config.manifests[manifest.package];

    for (var i = 0, len = _hashes.length; i < len; i++) {
      var
        _hash = _hashes[i],
        _dependency = manifest.hashes[_hash];

      Dactylographsy.injectDependency(_dependency, _manifestConfig);
      Dactylographsy.removeInjectedFile(manifest, _dependency);
    }

    var
      _uninjectedFiles = Object.keys(_manifestConfig.files);

    for (var i = 0, len = _uninjectedFiles.length; i < len; i++) {
      var
        _fileName = _uninjectedFiles[i];

      Dactylographsy.injectDependency(_manifestConfig.files[_fileName], _manifestConfig);
    }

    Dactylographsy.remove(injectionOrder, manifest.package);
  };

  Dactylographsy.remove = function(array, key) {
    while (array.indexOf(key) !== -1) {
      array.splice(array.indexOf(key), 1);
    }
  };

  Dactylographsy.css = function(url) {
    var
      link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';

    link.href = url;

    injectInto.appendChild(link);
  };

  initialize = function() {
    var
      shouldInject = function(manifest) {
        if (injectionOrder.length === 0 || injectionOrder.indexOf(manifest.package) === 0) {
          return true;
        } else {
          return false;
        }
      },
      injectFromQueue = function() {
        var
          _nextManifest;

        if (injectionOrder.length > 0 && queue[injectionOrder[0]]) {
          _nextManifest = queue[injectionOrder[0]];
        } else {
          _nextManifest = queue[0];
        }
        if (_nextManifest) {
          Dactylographsy.injectManifest(_nextManifest);
          injectFromQueue();
        }
      },
      injectManifest = function(xhr, response) {
        var
          _manifest = JSON.parse(response);

        queue[_manifest.package] = _manifest;

        injectFromQueue();
      };

    manifests = Dactylographsy.readAttrOnScript('manifests');
    config = Dactylographsy.readAttrOnScript('config');
    injectionOrder = config.order;

    for (var i = 0, len = manifests.length; i < len; i++) {
      Dactylographsy.ajaxGet(manifests[i], injectManifest);
    }
  };

  initialize();
}(this, window, document));
