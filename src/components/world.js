import {
  Bodies,
  Composites,
  Engine,
  Render,
  World
} from 'matter-js';

export default () => {
  // create an engine
  const engine = Engine.create();

  // create a renderer
  const render = Render.create({
      element: document.body,
      engine
  });

  const scale = 1;
  World.add(engine.world, Composites.car(350, 100, 150 * scale, 30 * scale, 30 * scale));

  // create two boxes and a ground
  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const boxB = Bodies.rectangle(450, 300, 80, 80);
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground]);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
};
