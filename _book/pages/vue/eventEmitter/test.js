class EventBus {
  constructor () {
    this.events = new Map()
  }

  on(event, cbFn) {
    if (!this.events.has(event)) this.events.set(event, new Set())
    this.events.get(event).add(cbFn)
    return this
  }

  off(event, cbFn) {
    if (!cbFn) {
      this.events.delete(event)
      return this
    }
    if (this.events.has(event)) {
      this.events.get(event).delete(cbFn)
    }
    return this
  }

  once(event, cbFn) {
    const onceFn = () => {
      cbFn.call(this)
      this.off(event, onceFn)
    }
    this.on(event, onceFn)
    return this
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(item => {
        item.apply(this, args)
      });
    }
  }
}

const bus = new EventBus()
const fn = (...args) => console.log('t1', ...args)
const fn2 = (...args) => console.log('t2', ...args)
bus.on('t1', fn).once('t2', fn2)
bus.off('t1', fn)
bus.emit('t1', 1, 2)
bus.emit('t2')
bus.emit('t2')