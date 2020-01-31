import {
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
      engine
  });

  const scale = 1;
  
  const car = createCar(350, 100);
  document.addEventListener('keydown', function(e) {
    const carBody = car.bodies[1];
    if (e.keyCode == 39) { // Right arrow key
      carBody.torque = 0.5;
    }
  });
  
  World.add(engine.world, car);

  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const boxB = Bodies.rectangle(450, 300, 80, 80);
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  World.add(engine.world, [boxA, boxB, ground]);
  Engine.run(engine);
  Render.run(render);

  setTimeout(() => {
    Composite.remove(engine.world, boxA);
  }, 2000);

  return {
    engine,
    render
  };
};
