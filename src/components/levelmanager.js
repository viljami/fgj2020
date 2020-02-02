import {
  Bodies,
  Body,
  Composite,
  Composites,
  Detector,
  Engine,
  Events,
  Render,
  Vector,
  World
} from 'matter-js';
import createWorld from './world.js';
import createLevel from './level.js';
const toInt = n => +n;
const getStoredLevels = () => {
  const defaultResult = [0];

  if (!window.localStorage) {
    return defaultResult;
  }

  const item = window.localStorage
    .getItem('unlocked');

  return item ? item.split(',').map(toInt) : defaultResult;
};

const setStoredLevels = (levels) => {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem('unlocked', levels.join(','))
};

const getStoredCurrentLevel = () => {
  const defaultResult = 0;

  if (!window.localStorage) {
    return defaultResult;
  }

  const item = window.localStorage
    .getItem('current');

  return item ? toInt(item) : defaultResult;
}

const setStoredCurrentLevel = (level) => {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem('current', level)
}

export default (engine, render, levels) => {
  const padding = Vector.create(400, 400);
  const { context } = render;
  const unlockedLevels = getStoredLevels();

  let currentCar;
  let currentGoal;
  let currentTexts;

  let currentLevel = getStoredCurrentLevel();

  if (currentLevel >= levels.length) {
    currentLevel = 0;
  }

  let collisionGoal = [];
  let collisionWater = [];
  let collisionGround = [];

  let goal;
  let objects = [];
  const reset = () => {
    World.clear(engine.world);
    Engine.clear(engine);

    const { water } = createWorld(engine);

    const {
      car,
      flag,
      goal,
      groundObjects,
      texts
    } = createLevel(engine, levels[currentLevel]);

    currentTexts = texts;
    currentGoal = goal;
    currentCar = car;
    collisionGoal = currentCar.bodies.map(body => [body, goal]);
    collisionGoal = collisionGoal.concat(
      currentCar.bodies.map(body => [body, flag])
    );
    collisionWater = currentCar.bodies.map(body => [body, water]);
    collisionGround = [];

    // Back wheel collision for slowing rotation when in air
    for (var key in groundObjects) {
      collisionGround = collisionGround.concat([
        [currentCar.bodies[1], groundObjects[key]]
      ]);
    }
  };
  reset();

  const maxSpeed = 0.5;
  const gear1Acceleration = 0.1;
  const gear2Acceleration = 0.14;
  Events.on(engine, 'beforeUpdate', () => {
    const carBody = currentCar.bodies[1];
    const carBody2 = currentCar.bodies[2];
    let velocity;
    if (carBody.angularSpeed < 0.2) {
        velocity =  gear1Acceleration;
    } else {
        velocity =  gear2Acceleration;
    }
    carBody.torque = velocity;
    carBody2.torque = velocity;
  });

  let collisionOccurrences = 0;
  Events.on(engine, 'afterUpdate', () => {
    Render.lookAt(render, currentCar.bodies, padding);

    let collisions = Detector.collisions(collisionGoal, engine)

    if (collisions.length) {
      if (currentLevel < levels.length - 1) {
        currentLevel++;
        if (!unlockedLevels.includes(currentLevel)) {
          unlockedLevels.push(currentLevel);
        }
        setStoredLevels(unlockedLevels);
      } else {
         currentLevel = 0;
      }

      setStoredCurrentLevel(currentLevel);
      reset();
    }

    // Test for backwheel collision with ground, slow down if not touching ground
    collisions = Detector.collisions(collisionGround, engine)
    if (!collisions.length) {
      collisionOccurrences++;

      if (collisionOccurrences > 2) {
        const carBody = currentCar.bodies[1];
        const carBody2 = currentCar.bodies[2];
        let velocity;
        if (carBody.angularSpeed > 0 && carBody.angularSpeed < 0.2) {
          velocity = carBody.angularSpeed - gear1Acceleration;
        } else if (carBody.angularSpeed > 0.2) {
          velocity = carBody.angularSpeed - gear2Acceleration;
        }
        if (!isNaN(velocity)) {
            velocity = Math.min(Math.max(velocity, 0), maxSpeed);
            carBody.torque = 0;
            carBody2.torque = 0;

            collisionOccurrences = 0;
        }
      }
    } else {
      collisionOccurrences = 0;
    }

    collisions = Detector.collisions(collisionWater, engine)

    if (collisions.length) {
      reset();
    }
  });

  const fillText = ({
    text,
    x,
    y,
    font = '28px arial',
    color = '#fff'
  }) => {
    const { offset } = render.mouse;
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, -offset.x + x, -offset.y + y);
  };

  Events.on(render, 'afterRender', () => {
    const angle = Vector.angle(
      currentCar.bodies[0].position,
      currentGoal.position
    );

    const dx = Math.cos(angle) * 150;
    const dy = Math.sin(angle) * 150;
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;

    context.fillStyle = '#fff';

    context.save();
    context.translate(w + dx, h + dy);
    context.rotate(angle + Math.PI / 4);
    context.moveTo(0, 0);
    context.beginPath();
    context.lineTo(-17, 0);
    context.lineTo(0, 0);
    context.lineTo(0, 17);
    context.closePath();
    context.fill();
    context.rotate(Math.PI / 4);
    context.fillRect(-5, 11, 9, 9)
    context.restore();

    currentTexts.forEach(fillText);
  });

  return {
    getCurrentLevel: () => currentLevel,

    setCurrentLevel: (levelIndex) => {
      currentLevel = levelIndex;
    },

    getUnlockedLevels: () => unlockedLevels.slice(),

    reset
  };
};
