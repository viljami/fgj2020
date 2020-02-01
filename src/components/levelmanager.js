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
import createCar from './car';

export default (engine, render, levels) => {
  const padding = Vector.create(400, 400);

  let car;

  let currentLevel = 0;

  let collisionGoal = [];
  let collisionWater = [];

  const reset = () => {
    World.clear(engine.world);
    Engine.clear(engine);

    const { water } = createWorld(engine);
    car = createCar(350, 100);

    const { goal } = createLevel(engine, levels[currentLevel]);

    World.add(engine.world, [car]);

    collisionGoal = car.bodies.map(body => [body, goal]);
    collisionWater = car.bodies.map(body => [body, water]);
  };
  reset();

  Events.on(engine, 'beforeUpdate', () => {
    const carBody = car.bodies[1];
    Body.setAngularVelocity(carBody, 0.1);
  });

  Events.on(engine, 'afterUpdate', () => {
    Render.lookAt(render, car.bodies, padding);

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
