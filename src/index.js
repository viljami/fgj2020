import createWorld from './components/world.js';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  createWorld();
});
