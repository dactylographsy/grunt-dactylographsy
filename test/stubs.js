import sinon from 'sinon';

export class XMLHttpRequest {
  constructor(withCredentials) {
    this.withCredentials = withCredentials
  }

  stub() {
    return new sinon.stub().returns({
      withCredentials: this.withCredentials,
      onload: undefined,
      onerror: undefined,
      open: sinon.spy(),
      resolve: () => {
        if (typeof onload === 'function') {
          onload();
        }
      },
      reject: () => {
        if (typeof onerror === 'function') {
          onerror();
        }
      }
    });
  }
}
