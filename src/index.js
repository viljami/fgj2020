import { World, Vector } from 'matter-js';

import createWorld from './components/world.js';
import createLevel from './components/level.js';
import createGround from './components/ground.js';
import interact from './lib/interact';

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

  interact.start()
  interact.on('end', ({ start, end }) => {
    const line = Vector.sub(end, start);
    const dist = Vector.magnitude(line);

    let angle = Math.acos(line.x / dist);

    if (line.y < 0) {
      angle = -angle;
    }

    const ground = createGround(start.x, start.y, dist, 10, angle);
    World.add(engine.world, ground);
  })
});
