import {
  Bodies,
  Composites,
  Composite,
  Engine,
  Render,
  World
} from 'matter-js';

export default (engine, level) => {
  const objects = [];
  let goal;
  let flag;
  level.objects.forEach(function(obj) {
    if (obj.type === "ground") {
      const ground = Bodies.rectangle(obj.x, obj.y, obj.width, obj.height, { isStatic: true });
      objects.push(ground);
    } else if (obj.type === "goal") {
      goal = Bodies.rectangle(obj.x, obj.y, 10, 60, { isStatic: true });
      flag = Bodies.rectangle(obj.x + 22, obj.y - 15, 30, 30, { isStatic: true });
   }
  });
  World.add(engine.world, objects);

  if (!goal) throw new Error("Invalid level, no goal");
  World.add(engine.world, [goal, flag]);

  return { goal };

};
