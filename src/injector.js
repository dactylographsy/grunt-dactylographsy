import {Css, Js} from './dom';
import Ajax from './ajax';
import Log from './log';

export class Manifest {
  constructor(url, config) {
    const { enableLogging = false } = config;

    this.log = new Log(enableLogging);
    this.url = url;
  }

  get() {
    return new Ajax()
      .get(this.url)
      .then(response => {
        let {
          text: responseText,
          url: responseUrl
        } = response;

        this.log.info(`Fetched manifest from url: ${responseUrl}.`);

        return JSON.parse(responseText);
      }, xhr => {
        this.log.error(`Could not fetch manifest with url: ${xhr.responseURL}!`);
      });
  }
}

export default class Injector {
  constructor(injectInto, manifests, options = {}) {
    const { enableLogging = false } = options;

    this.log = new Log(enableLogging);
    this.manifests = {};
    this.injectInto = injectInto;

    manifests.forEach(manifest => {
      this.manifests[manifest.package] = manifest;
    });

    this.options = options;
    this.prefix = options.prefix;
    this.order = options.order;
  }

  inject() {
    let
      injections = [];

    this.order.forEach(_package => {
      if (!this.manifests[_package]) {
        this.log.error(`Couldn\'t find package ${_package} from injection order.`);
      } else {
        this.injectManifest(this.manifests[_package]);

        injections.push(_package);
      }
    });

    return injections;
  }

  injectManifest(manifest) {
    let
      hashes = Object.keys(manifest.hashes);

    return hashes.map(hash => {
      let
        dependency = manifest.hashes[hash],
        rootUrl;

      rootUrl = [manifest.rootUrl, manifest.packageUrl].filter(_url => {
        return (
          _url !== undefined &&
          _url !== null
        );
      }).join('/');

      this.injectDependency(
        dependency,
        rootUrl
      );

      return {hash, dependency, rootUrl};
    });
  }

  injectDependency(dependency, rootUrl) {
    switch (dependency.extension) {
      case '.css':
        return new Css(
          this.injectInto,
          this.options
        ).inject(
          this.urls(dependency, rootUrl)
        );
      case '.js':
        return new Js(
          this.injectInto,
          this.options
        ).inject(
          this.urls(dependency, rootUrl)
        );
    }
  }

  basename(path) {
    return path.replace(/.*\/|\.[^.]*$/g, '');
  }

  urls(dependency, rootUrl = '') {
    let
      basename = this.basename(dependency.file),
      url;

    url = [this.prefix, rootUrl, dependency.path].filter(_url => {
      return (
        _url !== undefined &&
        _url !== null
      );
    }).join('/');

    return {
      printed: `/${url}/${basename}-${dependency.hash}${dependency.extension}`,
      raw: `/${url}/${basename}${dependency.extension}`,
      singularBy: `/${url}/${basename}${dependency.extension}`
    };
  }
}
