export default class Cache {
  constructor(options = {}) {
    let defaultPrefix = '__dactylographsy';

    this.options = options;
    this.cachePrefix = this.options.cachePrefix || defaultPrefix;
    this.isSupported = this.supported();

    if (this.options.appPrefix) {
      this.cachePrefix = `${this.cachePrefix}--${this.options.appPrefix}__`;
    } else {
      this.cachePrefix += '__';
    }
  }

  get(key, defaultValue) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) { reject(); }

      let _item = JSON.parse(
        localStorage.getItem(`${this.cachePrefix}-${key}`)
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
    if (!this.isSupported) { return false; }

    return localStorage.getItem(key) !== null;
  }

  set(code, type, url, singularBy = false) {
    if (!this.isSupported) { return false; }
    if (singularBy) { this.dedupe(singularBy); }

    let cached = {
      now: +new Date(),
      url: url,
      code: code,
      type: type
    };

    localStorage.setItem(
      `${this.cachePrefix}-${url}`,
      JSON.stringify(cached)
    );

    return true;
  }

  flush() {
    if (!this.isSupported) { return false; }

    for (let key in localStorage) {
      if (key.indexOf(this.cachePrefix) >= 0) {
        console.log(`Removing item ${key} requested by flush.`);

        localStorage.removeItem(key);
      }
    }

    return true;
  }

  supported() {
    let
      item = '__dactylographsy__feature-detection';

    try {
      localStorage.setItem(item, item);
      localStorage.removeItem(item);

      return true;
    } catch(e) {
      console.warn(`Localstorage not supported in browser - no caching!`);

      return false;
    }
  }

  dedupe(singularBy) {
    for (let key in localStorage) {
      if (
        key.indexOf(this.cachePrefix) >= 0 &&
        key.indexOf(singularBy) >= 0
      ) {
        console.log(`Deduping by ${singularBy} before adding dupe in ${key}.`);

        localStorage.removeItem(key);
      }
    }
  }
}
