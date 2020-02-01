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
import levels from './components/levels.js';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  const navigation = document.getElementById('nav');
  const main = document.getElementById('main');
  const startView = document.getElementById('start-view');
  const levelsView = document.getElementById('levels-view');

  const resetButton = document.getElementById('reset');
  const levelsButton = document.getElementById('levels');

  const hideView = view => () => view.className = 'hide';
  const showView = view => {
    view.className = view.className
      .split('hide')
      .join('');
  };

  const showOnce = () => {
    levelsButton.removeEventListener('click', showOnce);

    const unlockedLevels = getUnlockedLevels();

    levelsView.innerHTML = `
      <h2>Levels</h2>
      <div>
        ${levels.map((_, i) => `<a class="level${~unlockedLevels.indexOf(i) ? '' : ' locked'}">${i + 1}</a>`).join('')}
      </div>
    `;

    showView(levelsView);
  };

  document.body.addEventListener('click', hideView(startView));
  levelsButton.addEventListener('click', showOnce);

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

  const {
    getCurrentLevel,
    setCurrentLevel,
    getUnlockedLevels,
    reset
  } = initLevelManager(engine, render, levels);

  resetButton.addEventListener('click', reset);

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

  interact.on('out', () => {
     if (originalTimeScale > 0) {
       engine.timing.timeScale = originalTimeScale;
     }
  });

  levelsView.addEventListener('click', ({ target }) => {
    const level = +target.innerText;

    if (target.className.includes('locked')) {
      return;
    }

    if (isNaN(level)) {
      hideView(levelsView)();
      return;
    }

    setCurrentLevel(level - 1);
    hideView(levelsView)();

    setTimeout(() => {
      levelsButton.addEventListener('click', showOnce);
    }, 100);

    reset();
  });

  interact.start()
});
