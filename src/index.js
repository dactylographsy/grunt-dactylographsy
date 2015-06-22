import Dactylographsy from './dactylographsy';

if (typeof window !== 'undefined') {
  window.dactylographsy = new Dactylographsy({
    autorun: true
  });
}
