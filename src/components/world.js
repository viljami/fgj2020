import {
  Body,
  Bodies,
  Composites,
  Composite,
  Detector,
  Engine,
  Events,
  Render,
  World,
  Vector
} from 'matter-js';
import createCar from './car';

export default () => {
  const engine = Engine.create();
  const render = Render.create({
      element: document.body,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight
      }
  });

  const maxSpeed = 0.2
  let car = createCar(350, 100);
  let collisionGoal = [];
  let collisionWater = [];
  const water = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  const goal = Bodies.rectangle(650, 350, 10, 60, { isStatic: true });
  const flag = Bodies.rectangle(672, 335, 30, 30, { isStatic: true });

  document.addEventListener('keydown', function(e) {
    const carBody = car.bodies[1];
    if (e.keyCode == 39) { // Right arrow key
      let velocity = carBody.angularSpeed + 0.01;
      velocity = Math.min(velocity, maxSpeed);
      Body.setAngularVelocity(carBody, velocity);
    }
  });

  const reset = () => {
    World.clear(engine.world);
    Engine.clear(engine);

    World.remove(engine.world, car, true);
    car = createCar(350, 100);
    World.add(engine.world, [car, water, goal, flag]);

    collisionGoal = car.bodies.map(body => [body, goal]);
    collisionWater = car.bodies.map(body => [body, water]);
  };
  reset();

  Events.on(engine, 'beforeUpdate', () => {
    const carBody = car.bodies[1];
    Body.setAngularVelocity(carBody, 0.1);
  });

  Events.on(engine, 'afterUpdate', () => {
    let collisions = Detector.collisions(collisionGoal, engine)

    if (collisions.length) {
      alert('WIN.')
      reset();
    }

    collisions = Detector.collisions(collisionWater, engine)

    if (collisions.length) {
      reset();
    }
  });

  Engine.run(engine);
  Render.run(render);

  return {
    engine,
    render,
    water,
    goal
  };
};
