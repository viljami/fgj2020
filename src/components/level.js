import {
  Bodies,
  Composites,
  Composite,
  Engine,
  Render,
  World
} from 'matter-js';
import createCar from './car';
import createGround from './ground.js';

export default (engine, level) => {
  const objects = [];
  const groundObjects = [];
  const texts = [];

  let goal;
  let flag;
  let car;

  level.objects.forEach(function(obj) {
    switch (obj.type) {
      case 'ground':
        const angle = obj.angle ? obj.angle : 0;
        const dx = obj.width/2 * Math.cos(angle);
        const dy = obj.width/2 * Math.sin(angle);
        const ground = createGround(obj.x  - dx, obj.y - dy, obj.width, obj.height, angle);
        objects.push(ground);
        groundObjects.push(ground);
        return;
      case 'goal':
        goal = Bodies.rectangle(obj.x, obj.y, 10, 60, { isStatic: true });
        flag = Bodies.rectangle(obj.x + 22, obj.y - 15, 30, 30, { isStatic: true });
        return;
      case 'start':
        car = createCar(obj.x, obj.y);
        objects.push(car);
        return;
      case 'text':
        texts.push(obj);
        return;
    }
  });

  World.add(engine.world, objects);

  if (!goal) throw new Error("Invalid level, no goal");
  World.add(engine.world, [goal, flag]);

  return {
    car,
    flag,
    goal,
    groundObjects,
    texts
  };
};
