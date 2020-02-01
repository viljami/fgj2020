import {
  Body,
  Bodies,
  Composites,
  Composite,
  Detector,
  Events,
  Render,
  World,
  Vector
} from 'matter-js';
import createCar from './car';

export default (engine) => {
  const maxSpeed = 0.2
  const water = Bodies.rectangle(1000, 1000, 3000, 20, {
    isStatic: true,
    render: {
      visible: false
    }
  });

  World.add(engine.world, [water]);

  return {
    water
  };
};
