import Cache from './cache';
import Ajax from './ajax';

export class Js {
  constructor(injectInto, config = {}) {
    this.injectInto = injectInto;

    this.cache = new Cache({
      appPrefix: config.appPrefix
    });

    this.cacheDelay = config.cacheDelay || 5000;
  }

  injectWithText(text, url) {
    return new Promise(resolve => {
      let script = document.createElement('script');

      script.defer = true;

      script.setAttribute('data-dactylographsy-url', url);

      script.text = text;

      if (this.injectInto) { this.injectInto.appendChild(script); }

      resolve(script);
    });
  }

  injectWithUrl(urls, whichUrl = 'printed') {
    return new Promise(resolve => {
      // Create script element and set its type
      let
        script = document.createElement('script'),
        url = urls[whichUrl];

      script.type = 'text/javascript';
      script.async = false;

      script.setAttribute('data-dactylographsy-url', url);

      // Bind to readyState or register ´onload´ callback
      if (script.readyState) {
        // Callback for IE's `onreadystatechange` (I feel seesick)
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;

            this.ensureCache(url, urls.singularBy, this.cacheDelay);
          }
        };
      } else {
        // Bind `onload` callback on script element
        script.onload = () => {
          if (whichUrl === 'printed') { this.ensureCache(url, urls.singularBy, this.cacheDelay); }
        };

        // Inject unprinted without caching in case of error
        script.onerror = () => {
          console.info(`Could not fetch JavaScript from ${url} - falling back to unprinted version.`);

          if (whichUrl === 'printed') { this.injectWithUrl(urls, 'raw'); }
        };
      }

      script.src = url;

      if (this.injectInto) { this.injectInto.appendChild(script); }

      resolve(script);
    });
  }

  ensureCache(url, singularBy = false, delay = 0) {
    return new Promise((resolve, reject) => {
        if (this.cache.has(url)) { resolve(); }

        console.info(`Loading CSS from ${url} for cache in ${delay}.`);

        window.setTimeout(() => {
          return new Ajax()
            .get(url)
            .then(response => {
              let { text: responseText } = response;

              this.cache.set(responseText, 'js', url, singularBy);

              console.info(`Loaded CSS from ${url} now cached.`);

              resolve();
            })
            .catch(() => {
              reject();
            });
        }, delay);
    });
  }

  inject(urls) {
    return this.cache.get(urls.printed)
      .then(text => {
        return this.injectWithText(text, urls.printed);
      })
      .catch(() => {
        return this.injectWithUrl(urls);
      });
  }
}

export class Css {
  constructor(injectInto, config = {}) {
    this.injectInto = injectInto;

    this.cache = new Cache({
      appPrefix: config.appPrefix
    });

    this.cacheDelay = config.cacheDelay || 5000;
  }

  ensureCache(url, singularBy = false, delay = 0) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(url)) { resolve(); }

      console.info(`Loading CSS from ${url} for cache in ${delay}.`);

      window.setTimeout(() => {
        return new Ajax()
          .get(url)
          .then(response => {
            let { text: responseText } = response;

            this.cache.set(responseText, 'css', url, singularBy);

            console.info(`Loaded CSS from ${url} now cached.`);

            resolve();
          }).catch(() => {
            reject();
          });
      }, delay);
    });
  }

  injectWithUrl(urls, whichUrl = 'printed') {
    return new Promise(resolve => {
      let
        link = document.createElement('link'),
        url = urls[whichUrl];

      link = document.createElement('link');

      link.type = 'text/css';
      link.rel = 'stylesheet';

      link.setAttribute('data-dactylographsy-url', url);

      link.href = url;

      if (this.injectInto) { this.injectInto.appendChild(link); }

      // Fallback to unprinted assets after cache attempt
      // no callbacks for stylesheet injections (timeouts are worse...)
      if (whichUrl === 'printed') {
        this.ensureCache(url, urls.singularBy, this.cacheDelay)
          .catch(() => {
            console.info(`Could not fetch CSS from ${url} - falling back to unprinted version.`);

            this.injectWithUrl(urls, 'raw');
          });
      }

      resolve(link);
    });
  }

  injectWithText(text, url) {
    return new Promise(resolve => {
      let
        link = document.createElement('link');

      link = document.createElement('style');

      link.setAttribute('data-dactylographsy-url', url);

      link.textContent = text;

      if (this.injectInto) { this.injectInto.appendChild(link); }

      resolve(link);
    });
  }

  inject(urls) {
    return this.cache.get(urls.printed)
      .then(text => {
        return this.injectWithText(text, urls.printed);
      })
      .catch(() => {
        return this.injectWithUrl(urls);
      });
  }
}
