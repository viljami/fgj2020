import EventEmiter from 'events';
import { Vector } from 'matter-js';

class InteractionEvent {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  reset(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

class ObjectPool {
  constructor(Class, size) {
    this.all = new Array(size);

    for (let i = 0; i < size; i++) {
      this.all[i] = new Class();
    }

    this.index = 0;
  }

  create(type, x, y) {
    this.index++;
    if (this.index >= this.all.size) {
      this.index = 0;
    }

    const instance = this.all[this.index];
    instance.reset(type, x, y);
    return instance;
  }
}

const pool = new ObjectPool(InteractionEvent, 30);

class Interact extends EventEmiter {
  constructor() {
    super();

    this.coordinates = {
      start: Vector.create(0, 0),
      end: Vector.create(0, 0)
    };

    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
  }

  start() {
    document.body.addEventListener('mousedown', this.onDown);
    document.body.addEventListener('mouseup', this.onUp);
  }

  stop() {
    document.body.removeEventListener('mousedown', this.onDown);
    document.body.removeEventListener('mouseup', this.onUp);
  }

  onDown({ clientX, clientY }) {
    // this.emit('start', pool.create('start', clientX, clientY));
    this.coordinates.start.x = clientX;
    this.coordinates.start.y = clientY;
  }

  onUp({ clientX, clientY }) {
    this.coordinates.end.x = clientX;
    this.coordinates.end.y = clientY;

    this.emit('end', this.coordinates);
  }
}

export default new Interact();
