import Cache from './cache';
import Injector, {Manifest} from './injector';

export default class Dactylographsy {
  constructor(options = {}) {
    let { autorun = false } = options;

    this.hookIntoDom();
    this.readConfiguration();
    this.cache = new Cache({
      appPrefix: this.config.appPrefix
    });

    if (autorun) { this.run(); }
  }

  hookIntoDom() {
    if (typeof document === 'undefined') { return; }

    this.executingScript = document.getElementById('dactylographsy');
    this.injectInto = document.body || document.head || document.getElementsByTagName('script')[0];
  }

  readConfiguration() {
    this.manifestUrls = this.readAttrOnScript('manifests');
    this.config = this.readAttrOnScript('config');
  }

  refresh(inject = true) {
    return Promise.all(this.manifestUrls.map(url => {
      return new Manifest(url).get();
    })).then(manifests => {
      console.info(`Fetched all manifests, ${manifests.length} in total.`);

      this.cache.set(manifests, 'manifests', 'manifests');

      return new Injector(inject ? this.injectInto : undefined, manifests, this.config).inject();
    });
  }

  restore() {
    return this.cache.get('manifests')
      .then(manifests => {
        console.info(`Resotring with manifests in cache later refreshing via network (delayed).`);

        new Injector(
          this.injectInto,
          manifests,
          this.config
        ).inject();

        return false;
      });
  }

  readAttrOnScript(attr) {
    if (!this.executingScript) { return false; }

    let _attr = this.executingScript.getAttribute('data-' + attr);

    return _attr ? JSON.parse(_attr) : undefined;
  }

  run() {
    if (this.config.ttl) {
      this.cache.get('clt', 0)
        .then(clt => {
          if (clt >= this.config.ttl) {
            console.info(`Flushing cache due to exeeding TTL of ${this.config.ttl}.`);

            this.cache.flush();
          } else {
            this.cache.set(++clt, 'plain', 'clt');
          }
        });
    }

    return this.restore()
      .then(injectedFromCache => {
        let { refreshDelay = 5000 } = this.config;

        return new Promise((resolve, reject) => {
          window.setTimeout(() => {
            this.refresh(injectedFromCache)
              .then(resolve, reject);
          }, refreshDelay );
        });
      }).catch(() => {
        console.info(`No manifests in cache, refreshing via network.`);

        return this.refresh();
      });
  }
}
