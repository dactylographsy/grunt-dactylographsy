/* global window, document, XMLHttpRequest, XDomainRequest */

;(function(root, window, document, undefined) {
  "use strict";

  var
    Dactylographsy,
    previousDactylographsy = root.Dactylographsy,
    injected = {
      css: {},
      js: {}
    };

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

  Dactylographsy.ajaxGet = function(url, success, error, options) {
    var
      xhr = new XMLHttpRequest(),
      _options = options || options;

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
      script = document.createElement('script'),
      injectInto = document.body || document.head || document.getElementsByTagName('script')[0];

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

    // Set the url
    script.src = url;

    // Append it to the head
    // *Note:* Binding it to body not possible cause it may not be parsed if `Scandio.libs` is
    // called in html's head-section
    injectInto.appendChild(script);

    return url;
  };

  Dactylographsy.css = function(url) {
    var
      link = document.createElement('link'),
      injectInto = document.body || document.head || document.getElementsByTagName('script')[0];

    link.type = 'text/css';
    link.rel = 'stylesheet';

    link.href = url;

    injectInto.appendChild(link);
  };
}(this, window, document));
