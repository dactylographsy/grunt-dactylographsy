export default class Cache {
  constructor(options = {}) {
    this.options = options;

    this.cachePrefix = this.options.cachePrefix || '__dactylographsy__';
  }

  get(key, defaultValue) {
    return new Promise((resolve, reject) => {
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
      `${this.cachePrefix}-${url}`,
      JSON.stringify(cached)
    );
  }

  flush() {
    for (let key in localStorage) {
      if (key.indexOf(this.cachePrefix) >= 0) {
        console.log(`Removing item ${key} requested by flush.`);

        localStorage.removeItem(key);
      }
    }
  }
}
