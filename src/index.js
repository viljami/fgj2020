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

  const drawStartEnd = false;
  const drawContinuous = true;
  const navigation = document.getElementById('nav');
  const main = document.getElementById('main');
  const startView = document.getElementById('start-view');
  const levelsView = document.getElementById('levels-view');

  const resetButton = document.getElementById('reset');
  const levelsButton = document.getElementById('levels');
  let mouseCoordinates = {};
  let startCoordinates;
  let prevBounds = {};

  const hideView = view => view.className = 'hide';
  const showView = view => {
    view.className = view.className
      .split('hide')
      .join('');
  };

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

  Render.run(render);

  const {
    getCurrentLevel,
    setCurrentLevel,
    getUnlockedLevels,
    reset
  } = initLevelManager(engine, render, levels);

  (function run() {
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);

    if (placing && startCoordinates) {
      const newCoordinates = render.mouse.position;
    const { bounds, mouse } = render;
    const boundDeltaX = bounds.min.x - prevBounds.x;
    const boundDeltaY = bounds.min.y - prevBounds.y;
      var diff = Math.sqrt(Math.pow(startCoordinates.x - mouseCoordinates.x + boundDeltaX, 2) + Math.pow(startCoordinates.y - mouseCoordinates.y + boundDeltaY, 2));
      if (diff > 5 && drawContinuous) {
        const { scale, offset } = mouse;
        const scaleX = scale.x;
        const scaleY = scale.y;
        const sc = { x: startCoordinates.x + boundDeltaX, y: startCoordinates.y + boundDeltaY }
        const nc = { x: mouseCoordinates.x, y: mouseCoordinates.y };
        createGroundPath(sc, nc);
        startCoordinates = { x: mouseCoordinates.x, y: mouseCoordinates.y };
        prevBounds = { x: bounds.min.x, y: bounds.min.y };
      }
    }
  })();
  resetButton.addEventListener('click', reset);

  const handleStartViewOnce = () => {
    document.body.removeEventListener('click', handleStartViewOnce);
    hideView(startView);
    showView(navigation);
  };
  document.body.addEventListener('click', handleStartViewOnce);

  const showOnceLevels = () => {
    levelsButton.removeEventListener('click', showOnceLevels);
    const unlockedLevels = getUnlockedLevels();

    showView(levelsView);

    levelsView.innerHTML = `
      <h2>Levels</h2>
      <div>
        ${levels.map((_, i) => `<a class="level${~unlockedLevels.indexOf(i) ? '' : ' locked'}">${i + 1}</a>`).join('')}
      </div>
    `;
  };

  levelsButton.addEventListener('click', showOnceLevels);

  let originalTimeScale = 0.0;
  let placing = false;
  interact.on('start', ({ start, end }) => {
    startCoordinates = { x: mouseCoordinates.x, y: mouseCoordinates.y };
    const { bounds } = render;
    prevBounds = { x: bounds.min.x, y: bounds.min.y };
    originalTimeScale = engine.timing.timeScale;
    engine.timing.timeScale /= 2;
    placing = true;
  });
  
  interact.on('end', ({ start, end }) => {
    if (drawStartEnd) {
      createGroundPath(start, end);
    }
    engine.timing.timeScale = originalTimeScale;
    startCoordinates = null;
    placing = false;
  });
  
  interact.on('move', ({ clientX, clientY }) => {
    if (!startCoordinates && placing) {
      startCoordinates = { x: clientX, y: clientY };
      const { bounds } = render;
      prevBounds = { x: bounds.min.x, y: bounds.min.y };
    }
    mouseCoordinates = { x: clientX, y: clientY };
  });
  
  function createGroundPath(start, end) {
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
  }

  interact.on('out', () => {
     if (originalTimeScale > 0) {
       engine.timing.timeScale = originalTimeScale;
     }
     placing = false;
  });

  levelsView.addEventListener('click', ({ target }) => {
    const level = +target.innerText;

    if (target.className.includes('locked')) {
      return;
    }

    if (isNaN(level)) {
      hideView(levelsView);
      return;
    }

    setCurrentLevel(level - 1);
    hideView(levelsView);

    setTimeout(() => {
      levelsButton.addEventListener('click', showOnceLevels);
    }, 100);

    reset();
  });

  interact.start()
});
