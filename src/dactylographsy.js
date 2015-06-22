class Ajax {
  constructor() {

  }

  get(url, options = {}) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

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
        options.customHeaders.forEach(header => {
          xhr.setRequestHeader(header.name, header.value);
        });
      }

      // Response handlers.
      xhr.onload = function() {
        resolve({
          xhr: xhr,
          text: xhr.responseText,
          url: xhr.responseURL
        });
      };

      xhr.onerror = function() {
        reject(xhr);
      };

      xhr.send();
    });
  }
}

class Cache {
  constructor(options = {}) {
    this.options = options;
  }

  get(key, defaultValue) {
    return new Promise((resolve, reject) => {
      let _item = JSON.parse(
        localStorage.getItem(key)
      );

      if (_item === null && defaultValue !== undefined) {
        this.set(defaultValue, 'plain', key);

        resolve(defaultValue);

        return;
      }

      if (_item) {
        console.info(`Found item with key: ${key} in cache.`);

        resolve(_item.code);
      } else {
        console.info(`Couldn\'t find item with key: ${key} in cache.`);

        reject();
      }
    });
  }

  has(key) {
    return localStorage.getItem(key) !== null;
  }

  set(code, type, url) {
    let cached = {
      now: +new Date(),
      url: url,
      code: code,
      type: type
    };

    localStorage.setItem(
      url,
      JSON.stringify(cached)
    );
  }

  flush() {
    localStorage.clear();
  }
}

class Js {
  constructor(injectInto) {
    this.injectInto = injectInto;
    this.cache = new Cache();
  }

  injectWithText(text) {
    return new Promise((resolve) => {
      let script = document.createElement('script');

      script.defer = true;

      script.text = text;

      if (this.injectInto) { this.injectInto.appendChild(script); }

      resolve(script);
    });
  }

  injectWithUrl(url) {
    return new Promise(resolve => {
      // Create script element and set its type
      let script = document.createElement('script');

      script.type = 'text/javascript';
      script.async = false;

      // Bind to readyState or register ´onload´ callback
      if (script.readyState) {
        // Callback for IE's `onreadystatechange` (I feel seesick)
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;

            this.cache(url);
          }
        };
      } else {
        // Bind `onload` callback on script element
        script.onload = () => {
          this.ensureCache(url);
        };
      }

      // Set the url
      script.src = url;

      if (this.injectInto) { this.injectInto.appendChild(script); }

      resolve(script);
    });
  }

  ensureCache(url) {
    return new Promise(resolve => {
      if (this.cache.has(url)) { resolve(); }

      return new Ajax()
        .get(url)
        .then(response => {
          let { text: responseText } = response;

          this.cache.set(responseText, 'js', url);

          resolve();
        });
    });
  }

  inject(url) {
    return this.cache.get(url)
      .then(text => {
        return this.injectWithText(text);
      })
      .catch(() => {
        return this.injectWithUrl(url);
      });
  }
}

class Css {
  constructor(injectInto) {
    this.injectInto = injectInto;
    this.cache = new Cache();
  }

  ensureCache(url) {
    return new Promise(resolve => {
      if (this.cache.has(url)) { resolve(); }

      return new Ajax()
        .get(url)
        .then(response => {
          let { text: responseText } = response;

          this.cache.set(responseText, 'css', url);

          resolve();
        });
    });
  }

  injectWithUrl(url) {
    return new Promise(resolve => {
      let link = document.createElement('link');

      link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';

      link.href = url;

      if (this.injectInto) { this.injectInto.appendChild(link); }

      this.ensureCache(url);

      resolve(link);
    });
  }

  injectWithText(text) {
    return new Promise(resolve => {
      let style = document.createElement('link');

      style = document.createElement('style');

      style.textContent = text;

      if (this.injectInto) { this.injectInto.appendChild(style); }

      resolve(style);
    });
  }

  inject(url) {
    return this.cache.get(url)
      .then(text => {
        return this.injectWithText(text);
      })
      .catch(() => {
        return this.injectWithUrl(url);
      });
  }
}

class Manifest {
  constructor(url) {
    this.url = url;
    this.cache = new Cache();
  }

  get() {
    return new Ajax()
      .get(this.url)
      .then(response => {
        let {
          text: responseText,
          url: responseUrl
        } = response;

        console.info(`Fetched manifest from url: ${responseUrl}.`);

        return JSON.parse(responseText);
      }, xhr => {
        console.error(`Could not fetch manifest with url: ${xhr.responseURL}!`);
      });
  }
}

class Injector {
  constructor(injectInto, manifests, options = {}) {
    this.manifests = {};
    this.injectInto = injectInto;

    manifests.forEach(manifest => {
      this.manifests[manifest.package] = manifest;
    });

    this.prefix = options.prefix || '';
    this.order = options.order;
  }

  inject() {
    this.order.map(_package => {
      if (!this.manifests[_package]) {
        console.error(`Couldn\'t find package ${_package} from injection order.`);
      } else {
        this.injectManifest(this.manifests[_package]);
      }
    });
  }

  injectManifest(manifest) {
    let
      hashes = Object.keys(manifest.hashes);

    return hashes.map(hash => {
      let dependency = manifest.hashes[hash];

      this.injectDependency(dependency, manifest.rootUrl || manifest.package);

      return hash;
    });
  }

  injectDependency(dependency, rootUrl) {
    switch (dependency.extension) {
      case '.css':
        return new Css(
          this.injectInto
        ).inject(
          this.url(dependency, rootUrl)
        );
      case '.js':
        return new Js(
          this.injectInto
        ).inject(
          this.url(dependency, rootUrl)
        );
    }
  }

  basename(path) {
    return path.replace(/.*\/|\.[^.]*$/g, '');
  }

  url(dependency, rootUrl = '') {
    let basename = this.basename(dependency.file);

    return `${this.prefix}/${dependency.path}/${rootUrl}/${basename}-${dependency.hash}${dependency.extension}`;
  }
}

export default class Dactylographsy {
  constructor(options) {
    let { autorun = false } = options;

    this.hookIntoDom();
    this.readConfiguration();
    this.cache = new Cache();

    if (autorun) { this.run(); }
  }

  hookIntoDom() {
    this.executingScript = document.getElementById('dactylographsy');
    this.injectInto = document.body || document.head || document.getElementsByTagName('script')[0];
  }

  readConfiguration() {
    this.manifestUrls = this.readAttrOnScript('manifests');
    this.config = this.readAttrOnScript('config');
  }

  refresh(inject = true) {
    return Promise.all(this.manifestUrls.map(url => {
      return new Manifest(url).get();
    })).then(manifests => {
      console.info(`Fetched all manifests, ${manifests.length} in total.`);

      this.cache.set(manifests, 'manifests', 'manifests');

      return new Injector(inject ? this.injectInto : undefined, manifests, this.config).inject();
    });
  }

  restore() {
    return this.cache.get('manifests')
      .then(manifests => {
        console.info(`Resotring with manifests in cache later refreshing via network.`);

        new Injector(this.injectInto, manifests, this.config).inject();

        return false;
      })
      .catch(() => {
        console.info(`No manifests in cache, refreshing via network.`);
      });
  }

  readAttrOnScript(attr) {
    let _attr = this.executingScript.getAttribute('data-' + attr);

    return _attr ? JSON.parse(_attr) : undefined;
  }

  run() {
    if (this.config.ttl) {
      this.cache.get('clt', 0)
        .then(clt => {
          if (clt >= this.config.ttl) {
            console.info(`Flushing cache due to exeeding TTL of ${this.config.ttl}.`);

            this.cache.flush();
          } else {
            this.cache.set(++clt, 'plain', 'clt');
          }
        });
    }

    return this.restore()
      .then(injectedFromCache => {
        return this.refresh(injectedFromCache);
      });
  }
}

if (typeof window !== 'undefined') {
  window.dactylographsy = new Dactylographsy({
    autorun: true
  });
}
