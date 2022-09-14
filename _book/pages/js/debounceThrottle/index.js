const debounce = (fn, time) => {
  return function () {
    if (fn.timer) clearTimeout(fn.timer)
    fn.timer = setTimeout(() => {
      fn.call(this, ...arguments)
    }, time)
  }
}

const throttle = (fn, time) => {
  let timer = null
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.call(this, ...arguments)
        timer = null
      }, time)
    }
  }
}

const fn = () => {
  console.log(Date.now())
}

setInterval(throttle(fn, 1000), 300)