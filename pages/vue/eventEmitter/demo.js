class EventBus {
  constructor() {
    this.events = {}
  }

  on (event, Fn) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(Fn)
    return this
  }

  off (event, Fn) {
    if (!Fn) {
      this.events[event] = []
    }
    if (this.events[event]) {
      // this.events[event] = []
      this.events[event] = this.events[event].filter(fn => fn !== Fn)
    }
    return this
  }

  once (event, Fn) {
    const onceFn = () => {
      Fn.call(this)
      console.log('before', this.events[event])
      this.off(event, onceFn)
      console.log('after', this.events[event])
    }
    this.on(event, onceFn)
    return this
  }

  emit (event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn.call(this, ...args))
    }
  }
}

const eventBus = new EventBus()
eventBus.on('t1', (arg) => {
  console.log('t1-1', arg)
})
eventBus.on('t1', (arg) => {
  console.log('t1-2', arg)
})
const cbFn = () => {
  console.log('t2-2')
}
// eventBus.once('t2', () => {
//   console.log('t2-1')
// })
eventBus.once('t2', cbFn)

// eventBus.emit('t1', 'test1')
// eventBus.emit('t1', 'test1')
eventBus.emit('t2')
eventBus.off('t2', cbFn)
eventBus.emit('t2')
