const obj = {
  count: 0,
  [Symbol.iterator]: () => {
    return {
      next: () => {
        if (obj.count < 20) {
          obj.count++
          return {
            value: obj.count,
            done: false
          }
        } else {
          obj.count = 0
          return {
            value: 0,
            done: false
          }
        }
      }
    }
  }
}

for (let item of obj) {
  console.log({ item })
}

// function * generator () {
//   const arr = [1, 2, 3, 4]
//   for (item of arr) {
//     yield console.log(item)
//   }
// }

// const g = generator()
// g.next()
// g.next()
// g.next()
// g.next()
// g.next()
// g.next()
// g.next()
