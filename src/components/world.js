import {
  Body,
  Bodies,
  Composites,
  Composite,
  Engine,
  Render,
  World
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

  const scale = 1;

  const maxSpeed = 0.2
  const car = createCar(350, 100);
  document.addEventListener('keydown', function(e) {
    const carBody = car.bodies[1];
    if (e.keyCode == 39) { // Right arrow key
      let velocity = carBody.angularSpeed + 0.01;
      velocity = Math.min(velocity, maxSpeed);
      Body.setAngularVelocity(carBody, velocity);
    }
  });
  
  World.add(engine.world, car);

  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  World.add(engine.world, [ground]);
  Engine.run(engine);
  Render.run(render);

  return {
    engine,
    render
  };
};
