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
  level.objects.forEach(function(obj) {
    if (obj.type === "ground") {
      const ground = Bodies.rectangle(obj.x, obj.y, obj.width, obj.height, { isStatic: true });
      objects.push(ground);
    }
  });
  World.add(engine.world, objects);

};
