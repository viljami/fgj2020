import { World, Vector, Engine, Render } from 'matter-js';

import createGround from './components/ground.js';
import initLevelManager from './components/levelmanager.js';
import interact from './lib/interact';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  const engine = Engine.create();
  const render = Render.create({
      element: document.body,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight
      }
  });

  Engine.run(engine);
  Render.run(render);
  
  const levels = [{
    objects: [
      { type: "ground", x: 350, y: 400, width: 150, height: 20 },
      { type: "ground", x: 600, y: 400, width: 150, height: 20 },
      { type: "goal", x: 650, y: 350 }
    ]
  },
  {
    objects: [
      { type: "ground", x: 350, y: 400, width: 150, height: 20 },
      { type: "ground", x: 650, y: 400, width: 150, height: 20 },
      { type: "goal", x: 650, y: 350 }
    ]
  }];
  initLevelManager(engine, levels);

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
