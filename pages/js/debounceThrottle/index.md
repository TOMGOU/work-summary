# Debounce(防抖)

* 定义：`在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。`
* 应用场景：输入框，不输了再执行函数
* 代码：

```js
const debounce = (fn, wait) => {
  return function () {
    clearTimeout(fun.id)
    fun.id = setTimeout(() => {
      fun.call(this, arguments)
    }, delay)
  }
}
```

# Throttle(节流)

* 定义：`规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。`
* 应用场景：监听滚动事件，滑到底部自动加载更多
* 代码：

```js
// 时间戳写法（第一次一定执行）
const throttle1 = (fn, wait) => {
  let last = 0
  return function () {
    let now = Date.now()
    if (now - last >= wait) {
      last = now
      fn.apply(this, arguments)
    }
  }
}

// 定时器写法（第一次也要延迟执行）
const throttle2 = (fn, wait) => {
  let timer = null
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
        timer = null
      }, wait)
    }
  }
}

// 结合写法（第一次要延迟执行，最后一次不延迟要立即执行）
const throttle = (func, wait, options) => {
  var context, args, result
  var timeout = null
  var previous = 0
  if (!options) options = {}
  var later = function() {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function() {
    var now = Date.now()
    if (!previous && options.leading === false) previous = now
    // 计算剩余时间
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

const test = () => {
  console.log(Math.random())
}

setInterval(throttle(test, 3000), 100)
```