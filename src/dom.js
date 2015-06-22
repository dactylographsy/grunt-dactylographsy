import Cache from './cache';
import Ajax from './ajax';

export class Js {
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

export class Css {
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
