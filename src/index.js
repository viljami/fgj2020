import {
  Engine,
  Mouse,
  Render,
  Vector,
  World
} from 'matter-js';

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

  render.mouse = Mouse.create(render.canvas);

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
  initLevelManager(engine, render, levels);

  interact.start()
  interact.on('end', ({ start, end }) => {
    const { bounds, mouse } = render;
    const { scale, offset } = mouse;
    const scaleX = scale.x;
    const scaleY = scale.y;
    const sx = start.x * scaleX;
    const sy = start.y * scaleY;
    const ex = end.x * scaleX;
    const ey = end.y * scaleY;
    const dx = ex - sx;
    const dy = ey - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const startX = (sx + bounds.min.x);
    const startY = (sy + bounds.min.y);
    const angle = Math.acos(dx / dist);

    World.add(
      engine.world,
      createGround(
        startX,
        startY,
        dist,
        10,
        dy < 0 ? -angle : angle
      )
    );
  });
});
