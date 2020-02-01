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

  const navigation = document.getElementById('nav');
  const main = document.getElementById('main');
  const resetButton = document.getElementById('reset');

  const engine = Engine.create();
  const render = Render.create({
      element: main,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight
      }
  });

  render.mouse = Mouse.create(render.canvas);

  Engine.run(engine);
  Render.run(render);

  const levels = [
  {
    objects: [
      { type: "start", x: 50, y: 50 },
      { type: "ground", x: 160, y: 400, width: 400, height: 20 },
      { type: "ground", x: 700, y: 400, width: 350, height: 20 },
      { type: "goal", x: 650, y: 350 },
      { type: 'text', x: 390, y: 500, text: '- Draw here ^ -'}
    ]
  },
  {
    objects: [
      { type: "start", x: 50, y: 50 },
      { type: "ground", x: 160, y: 100, width: 300, height: 20 },
      { type: "ground", x: 650, y: 400, width: 150, height: 20 },
      { type: "goal", x: 650, y: 350 },
      { type: 'text', x: 300, y: 250, text: '- And here ^ -'}
    ]
  },
  {
    objects: [
      { type: "start", x: 50, y: 0 },
      { type: "ground", x: 160, y: 100, width: 300, height: 20 },
      { type: "ground", x: 160, y: 600, width: 100, height: 20 },
      { type: "goal", x: 160, y: 550 },
    ]
  },
  {
    objects: [
      { type: "start", x: 350, y: 100 },
      { type: "ground", x: 450, y: 300, width: 550, height: 20, angle: Math.PI/4 },
      { type: "ground", x: 700, y: 510, width: 150, height: 20, angle: Math.PI/8 },
      { type: "ground", x: 950, y: 540, width: 450, height: 20, angle: Math.PI },
      { type: "ground", x: 1200, y: 510, width: 150, height: 20, angle: Math.PI*0.75 },
      { type: "ground", x: 1260, y: 430, width: 100, height: 20, angle: Math.PI*0.65 },
      { type: "ground", x: 1280, y: 400, width: 100, height: 20, angle: Math.PI*0.55 },
      { type: "ground", x: 1290, y: 300, width: 300, height: 20, angle: Math.PI*0.5 },
      { type: "ground", x: 1200, y: 100, width: 150, height: 20, angle: Math.PI*0.2 },
      { type: "ground", x: 1260, y: 150, width: 100, height: 20, angle: Math.PI*0.25 },
      { type: "ground", x: 1270, y: 155, width: 100, height: 20, angle: Math.PI*0.35 },
      { type: "goal", x: 650, y: 350 }
    ]
  }];

  const { reset } = initLevelManager(engine, render, levels);
  resetButton.addEventListener('click', reset);

  interact.start()

  let originalTimeScale = 0.0;
  interact.on('start', ({ start, end }) => {
    originalTimeScale = engine.timing.timeScale;
    engine.timing.timeScale /= 2;
  });

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

    engine.timing.timeScale = originalTimeScale;
  });
});
