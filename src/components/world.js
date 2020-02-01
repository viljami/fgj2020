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
  let car = createCar(350, 100);
  
  const water = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  World.add(engine.world, [water]);

  return {
    water
  };
};
