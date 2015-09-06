export class DOMUtil {
  constructor() {
  }

  findJsByDataUrl(url) {
    return document.querySelectorAll(`script[data-dactylographsy-url="${url}"]`);
  }

  findCssByDataUrl(url) {
    let
      styles = document.querySelectorAll(`style[data-dactylographsy-url="${url}"]`),
      links = document.querySelectorAll(`link[data-dactylographsy-url="${url}"]`)

    return [...links, ...styles];
  }

  findAllCss() {
    let
      styles = document.querySelectorAll(`style[data-dactylographsy-url]`),
      links = document.querySelectorAll(`link[data-dactylographsy-url]`)

    return [...links, ...styles];
  }

  findAllJs() {
    return document.querySelectorAll(`script[data-dactylographsy-url]`);
  }

  removeAll() {
    let
      nodes,
      scripts = this.findAllJs(),
      styles = this.findAllCss;

    nodes = [...styles, ...scripts];

    for (let node of nodes) {
      node.parentNode.removeChild(node);
    }
  }
}
