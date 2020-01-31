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

  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  World.add(engine.world, [ground]);
  Engine.run(engine);
  Render.run(render);

  return {
    engine,
    render
  };
};
