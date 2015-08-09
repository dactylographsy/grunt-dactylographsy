export default class Ajax {
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
      xhr.onload = () => {
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

      xhr.onerror = () => {
        reject(xhr);
      };

      xhr.send();
    });
  }
}
