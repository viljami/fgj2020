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

export default (engine, render, levels) => {
  const padding = Vector.create(400, 400);
  const { context } = render;

  let currentCar;
  let currentGoal;

  let currentLevel = 0;

  let collisionGoal = [];
  let collisionWater = [];

  const reset = () => {
    World.clear(engine.world);
    Engine.clear(engine);

    const { water } = createWorld(engine);

    const { car, flag, goal } = createLevel(engine, levels[currentLevel]);

    currentGoal = goal;
    currentCar = car;
    collisionGoal = currentCar.bodies.map(body => [body, goal]);
    collisionGoal = collisionGoal.concat(
      currentCar.bodies.map(body => [body, flag])
    );
    collisionWater = currentCar.bodies.map(body => [body, water]);
  };
  reset();

  Events.on(engine, 'beforeUpdate', () => {
    const carBody = currentCar.bodies[1];
    Body.setAngularVelocity(carBody, 0.1);
  });

  Events.on(engine, 'afterUpdate', () => {
    Render.lookAt(render, currentCar.bodies, padding);

    let collisions = Detector.collisions(collisionGoal, engine)

    if (collisions.length) {
      if (currentLevel < levels.length - 1) {
         currentLevel++;
      } else {
         alert('WIN.')
      }
      reset();
    }

    collisions = Detector.collisions(collisionWater, engine)

    if (collisions.length) {
      reset();
    }
  });
};
