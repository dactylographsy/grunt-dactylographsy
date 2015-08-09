import Cache from './cache';
import Ajax from './ajax';

export class Js {
  constructor(injectInto, config = {}) {
    this.injectInto = injectInto;
    this.cache = new Cache({
      appPrefix: config.appPrefix
    });
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

  injectWithUrl(urls, whichUrl = 'printed') {
    return new Promise(resolve => {
      // Create script element and set its type
      let
        script = document.createElement('script'),
        url = urls[whichUrl];

      script.type = 'text/javascript';
      script.async = false;

      // Bind to readyState or register ´onload´ callback
      if (script.readyState) {
        // Callback for IE's `onreadystatechange` (I feel seesick)
        script.onreadystatechange = () => {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;

            this.ensureCache(url);
          }
        };
      } else {
        // Bind `onload` callback on script element
        script.onload = () => {
          if (whichUrl === 'printed') { this.ensureCache(url); }
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

  ensureCache(url) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (this.cache.has(url)) { resolve(); }

        return new Ajax()
          .get(url)
          .then(response => {
            let { text: responseText } = response;

            this.cache.set(responseText, 'js', url);

            resolve();
          })
          .catch(() => {
            reject();
          });
      }, 15000);
    });
  }

  inject(urls) {
    return this.cache.get(urls.printed)
      .then(text => {
        return this.injectWithText(text);
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
  }

  ensureCache(url) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(url)) { resolve(); }

      return new Ajax()
        .get(url)
        .then(response => {
          let { text: responseText } = response;

          this.cache.set(responseText, 'css', url);

          resolve();
        }).catch(() => {
          reject();
        });
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

      link.href = url;

      if (this.injectInto) { this.injectInto.appendChild(link); }

      // Fallback to unprinted assets after cache attempt
      // no callbacks for stylesheet injections (timeouts are worse...)
      if (whichUrl === 'printed') {
        this.ensureCache(url)
          .catch(() => {
            console.info(`Could not fetch CSS from ${url} - falling back to unprinted version.`);

            this.injectWithUrl(urls, 'raw');
          });
      }

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

  inject(urls) {
    return this.cache.get(urls.printed)
      .then(text => {
        return this.injectWithText(text);
      })
      .catch(() => {
        return this.injectWithUrl(urls);
      });
  }
}
