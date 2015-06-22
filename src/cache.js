export default class Cache {
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
