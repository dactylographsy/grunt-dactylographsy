export default class Log {

  // Not level bound logging needed yet
  constructor(enabled = true) {
    this.enabled = enabled;

    if (this.enabled) {
      this.console = window.console;
    }
  }

  log() {
    if (this.enabled) { this.console.log(...arguments); }
  }

  info() {
    if (this.enabled) { this.console.info(...arguments); }
  }

  warn() {
    if (this.enabled) { this.console.warn(...arguments); }
  }

  debug() {
    if (this.enabled) { this.console.debug(...arguments); }
  }

  error() {
    if (this.enabled) { this.console.error(...arguments); }
  }
}
