import {
  Bodies,
  Composites,
  Composite,
  Engine,
  Render,
  World
} from 'matter-js';
import createCar from './car';

export default (engine, level) => {
  const objects = [];
  let goal;
  let flag;
  let car;

  level.objects.forEach(function(obj) {
    switch (obj.type) {
      case 'ground':
        const ground = Bodies.rectangle(obj.x, obj.y, obj.width, obj.height, { isStatic: true });
        objects.push(ground);
        return;
      case 'goal':
        goal = Bodies.rectangle(obj.x, obj.y, 10, 60, { isStatic: true });
        flag = Bodies.rectangle(obj.x + 22, obj.y - 15, 30, 30, { isStatic: true });
        return;
      case 'start':
        car = createCar(obj.x, obj.y);
        objects.push(car);
        return;
    }
  });

  World.add(engine.world, objects);

  if (!goal) throw new Error("Invalid level, no goal");
  World.add(engine.world, [goal, flag]);

  return {
    car,
    flag,
    goal
  };
};
