import {
  Engine,
  Mouse,
  Render,
  Vector,
  World
} from 'matter-js';

import createGround from './components/ground.js';
import initLevelManager from './components/levelmanager.js';
import SoundManager from './components/soundmanager.js'
import interact from './lib/interact';
import levels from './components/levels.js';

window.addEventListener('load', function load() {
  window.removeEventListener('load', load);

  const drawStartEnd = false;
  const drawContinuous = true;
  const soundsEnabled = true;
  const navigation = document.getElementById('nav');
  const main = document.getElementById('main');
  const startView = document.getElementById('start-view');
  const levelsView = document.getElementById('levels-view');

  const resetButton = document.getElementById('reset');
  const levelsButton = document.getElementById('levels');
  let mouseCoordinates = Vector.create(0, 0);
  let startCoordinates = Vector.create(0, 0);
  let prevBounds = Vector.create(0, 0);

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

  window.addEventListener('resize', () => {
    window.location.reload();
  });

  render.mouse = Mouse.create(render.canvas);

  Render.run(render);

  const {
    getCurrentLevel,
    setCurrentLevel,
    getUnlockedLevels,
    reset,
    emitter
  } = initLevelManager(engine, render, levels);

  const sc = Vector.create(0, 0);
  (function run() {
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);

    if (placing && startCoordinates.x && mouseCoordinates.x) {
      const newCoordinates = render.mouse.position;
      const { bounds, mouse } = render;
      const boundDeltaX = bounds.min.x - prevBounds.x;
      const boundDeltaY = bounds.min.y - prevBounds.y;
      const diff = Math.sqrt(Math.pow(startCoordinates.x - mouseCoordinates.x + boundDeltaX, 2) + Math.pow(startCoordinates.y - mouseCoordinates.y + boundDeltaY, 2));

      if (diff > 5 && drawContinuous) {
        const { scale, offset } = mouse;
        const scaleX = scale.x;
        const scaleY = scale.y;
        sc.x = startCoordinates.x + boundDeltaX;
        sc.y = startCoordinates.y + boundDeltaY;
        createGroundPath(sc, mouseCoordinates);

        startCoordinates.x = mouseCoordinates.x;
        startCoordinates.y = mouseCoordinates.y;
        prevBounds.x = bounds.min.x;
        prevBounds.y = bounds.min.y;
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

  emitter.on('win', () => {
    SoundManager.playWin();
  });

  emitter.on('reset', () => {
    SoundManager.playStart();
  });

  let originalTimeScale = 0.0;
  let placing = false;
  interact.on('start', ({ x, y }) => {
    startCoordinates.x = x;
    startCoordinates.y = y;
    mouseCoordinates.x = x;
    mouseCoordinates.y = y;
    prevBounds.x = render.bounds.min.x;
    prevBounds.y = render.bounds.min.y;

    if (soundsEnabled) {
      SoundManager.start();
    }
    originalTimeScale = engine.timing.timeScale;
    engine.timing.timeScale /= 2;
    placing = true;
  });

  interact.on('end', ({ start, end }) => {
    if (drawStartEnd) {
      createGroundPath(start, end);
    }
    SoundManager.stopSweep();
    engine.timing.timeScale = originalTimeScale;
    startCoordinates.x = 0;
    startCoordinates.y = 0;
    placing = false;
  });

  interact.on('move', ({ x, y }) => {
    if (!startCoordinates.x && placing) {
      startCoordinates.x = x;
      startCoordinates.y = y;
      prevBounds.x = render.bounds.min.x;
      prevBounds.y = render.bounds.min.y;
    }

    mouseCoordinates.x = x;
    mouseCoordinates.y = y;
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

    SoundManager.playSweep();

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
     SoundManager.stopSweep();
     placing = false;
  });

  levelsView.addEventListener('click', ({ target }) => {
    const level = +target.innerText;
    const isLocked = target.className.includes('locked');

    if (!isLocked) {
      hideView(levelsView);

      if (!isNaN(level)) {
        setCurrentLevel(level - 1);
      }
    }

    setTimeout(() => {
      levelsButton.addEventListener('click', showOnceLevels);
    }, 100);

    reset();
  });

  interact.start()
});
