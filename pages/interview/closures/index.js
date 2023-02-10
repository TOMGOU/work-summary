const compose = (...args) => num => args.reverse().reduce((pre, cur) => cur(pre), num)

const fun1 = x => x * 2
const fun2 = x => x * 3
const fun3 = x => x * 4

const res = compose(fun1, fun2, fun3)(1)

// console.log({ res })

const cache = () => {
  const arr = []

  return (i) => {
    arr.push(i)
    console.log({ arr })
  }
}

const cacheNum = cache()
cacheNum(1)
cacheNum(2)