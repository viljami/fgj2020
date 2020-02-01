import { Bodies, Body, Vector } from 'matter-js';

export default (x, y, width, height, rotation) => {
  const halfWidth = width / 2;
  const dx = halfWidth * Math.cos(rotation);
  const dy = halfWidth * Math.sin(rotation);
  const body = Bodies.rectangle(x, y, width, height);

  Body.rotate(body, rotation);
  Body.translate(body, Vector.create(dx, dy));
  Body.setStatic(body, true);

  return body;
};
