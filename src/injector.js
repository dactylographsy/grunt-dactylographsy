import {Css, Js} from './dom';
import Ajax from './ajax';
import Cache from './cache';

export class Manifest {
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

export default class Injector {
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
