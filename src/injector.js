import {Css, Js} from './dom';
import Ajax from './ajax';

export class Manifest {
  constructor(url) {
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

        console.info(`Fetched manifest from url: ${responseUrl}.`);

        return JSON.parse(responseText);
      }, xhr => {
        console.error(`Could not fetch manifest with url: ${xhr.responseURL}!`);
      });
  }
}

export default class Injector {
  constructor(injectInto, manifests, options = {}) {
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
      let url;

      url = [manifest.rootUrl, manifest.package].filter(_url => {
        return _url !== undefined;
      }).join('/');

      this.injectDependency(
        dependency,
        url
      );

      return hash;
    });
  }

  injectDependency(dependency, url) {
    switch (dependency.extension) {
      case '.css':
        return new Css(
          this.injectInto,
          this.options
        ).inject(
          this.url(dependency, url)
        );
      case '.js':
        return new Js(
          this.injectInto,
          this.options
        ).inject(
          this.url(dependency, url)
        );
    }
  }

  basename(path) {
    return path.replace(/.*\/|\.[^.]*$/g, '');
  }

  url(dependency, rootUrl = '') {
    let
      basename = this.basename(dependency.file),
      url;

    url = [this.prefix, rootUrl, dependency.path].filter(_url => {
      return _url !== undefined;
    }).join('/');

    return `${url}/${basename}-${dependency.hash}${dependency.extension}`;
  }
}
