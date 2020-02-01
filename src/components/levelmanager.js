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
  let collisionGround = [];

  let goal;
  let objects = [];
  const reset = () => {
    World.clear(engine.world);
    Engine.clear(engine);

    const { water } = createWorld(engine);

    const { car, flag, goal, objects } = createLevel(engine, levels[currentLevel]);

    currentGoal = goal;
    currentCar = car;
    collisionGoal = currentCar.bodies.map(body => [body, goal]);
    collisionGoal = collisionGoal.concat(
      currentCar.bodies.map(body => [body, flag])
    );
    collisionWater = currentCar.bodies.map(body => [body, water]);
    collisionGround = [];

    // Back wheel collision for slowing rotation when in air
    for (var key in objects) {
      collisionGround = collisionGround.concat([[car.bodies[1], objects[key]]]);
    }
  };
  reset();

  const maxSpeed = 0.5;
  const gear1Acceleration = 0.004;
  const gear2Acceleration = 0.01;
  Events.on(engine, 'beforeUpdate', () => {
    const carBody = currentCar.bodies[1];
    const carBody2 = currentCar.bodies[2];
    let velocity;
    if (carBody.angularSpeed < 0.2) {
        velocity = carBody.angularSpeed + gear1Acceleration;
    } else {
        velocity = carBody.angularSpeed + gear2Acceleration;
    }
    velocity = Math.min(velocity, maxSpeed);
    Body.setAngularVelocity(carBody, velocity);
    Body.setAngularVelocity(carBody2, velocity);
  });

  let collisionOccurrences = 0;
  Events.on(engine, 'afterUpdate', () => {
    Render.lookAt(render, currentCar.bodies, padding);

    let collisions = Detector.collisions(collisionGoal, engine)

    if (collisions.length) {
      if (currentLevel < levels.length - 1) {
         currentLevel++;
      } else {
         currentLevel = 0;
      }
      reset();
    }

    // Test for backwheel collision with ground, slow down if not touching ground
    collisions = Detector.collisions(collisionGround, engine)
    if (!collisions.length) {
      collisionOccurrences++;

      if (collisionOccurrences > 1) {
        const carBody = car.bodies[1];
        const carBody2 = car.bodies[2];
        let velocity;
        if (carBody.angularSpeed > 0 && carBody.angularSpeed < 0.2) {
          velocity = carBody.angularSpeed - gear1Acceleration;
        } else if (carBody.angularSpeed > 0.2) {
          velocity = carBody.angularSpeed - gear2Acceleration;
        }
        if (!isNaN(velocity)) {
            velocity = Math.min(Math.max(velocity, 0), maxSpeed);
            Body.setAngularVelocity(carBody, velocity);
            Body.setAngularVelocity(carBody2, velocity);
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

  Events.on(render, 'afterRender', () => {
    const angle = Vector.angle(
      currentCar.bodies[0].position,
      currentGoal.position
    );

    const dx = Math.cos(angle) * 150;
    const dy = Math.sin(angle) * 150;
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;

    context.fillStyle = '#f00';

    context.moveTo(w + dx, h + dy);
    context.beginPath();
    context.arc(w + dx, h + dy, 10, 0, Math.PI * 2);
    context.closePath();
    context.fill();

  });
};
