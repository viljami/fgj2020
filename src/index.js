import createWorld from './components/world.js';
import createLevel from './components/level.js';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  const { engine, render } = createWorld();
  
  const level = {
    objects: [
      { type: "ground", x: 350, y: 400, width: 150, height: 20 },
      { type: "ground", x: 600, y: 400, width: 150, height: 20 },
    ]
  };
  createLevel(engine, level);
});
