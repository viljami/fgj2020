import EventEmiter from 'events';
import { Vector } from 'matter-js';

import isTouchDevice from './isTouchDevice.js';

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
    if (this.index >= this.all.length - 1) {
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

    this.isStartCalled = false;
    this.coordinates = {
      start: Vector.create(0, 0),
      end: Vector.create(0, 0)
    };

    this.isTouch = isTouchDevice();

    this.events = {
      start: this.isTouch ? 'touchstart' : 'mousedown',
      end: this.isTouch ? 'touchend' : 'mouseup',
      move: this.isTouch ? 'touchmove' : 'mousemove',
      out: 'mouseout'
    };

    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onOut = this.onOut.bind(this);
  }

  start() {
    document.body.addEventListener(this.events.start, this.onDown);
    document.body.addEventListener(this.events.end, this.onUp);
    document.body.addEventListener(this.events.move, this.onMove);
    document.body.addEventListener(this.events.out, this.onOut);
  }

  stop() {
    document.body.removeEventListener(this.events.start, this.onDown);
    document.body.removeEventListener(this.events.end, this.onUp);
    document.body.removeEventListener(this.events.move, this.onMove);
    document.body.removeEventListener(this.events.out, this.onOut);
  }

  onDown(event) {
    this.isStartCalled = true;

    if (this.isTouch) {
      event = event.touches[0];
    }

    const { clientX, clientY } = event;
    this.coordinates.start.x = clientX;
    this.coordinates.start.y = clientY;

    this.emit('start', pool.create('start', clientX, clientY));
  }

  onUp(event) {
    if (this.isTouch) {
      event = event.changedTouches[0];
    }

    const { clientX, clientY } = event;
    this.coordinates.end.x = clientX;
    this.coordinates.end.y = clientY;

    this.emit('end', this.coordinates);
  }

  onMove(event) {
    if (!this.isStartCalled) {
      return;
    }

    if (this.isTouch) {
      event = event.touches[0];
    }

    const { clientX, clientY } = event;
    this.emit('move', pool.create('move', clientX, clientY));
  }

  onOut(event) {
    this.emit('out');
  }
}

export default new Interact();
