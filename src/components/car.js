import { Composites } from 'matter-js';

const scale = 1;

export default (x, y) => Composites.car(
  x,
  y,
  150 * scale,
  30 * scale,
  30 * scale
);
