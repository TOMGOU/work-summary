// Promise.all
const PromiseAll = (arr) => {
  const promises = Array.from(arr)
  const data = []
  let i = 0
  return new Promise((resolve, reject) => {
    for(let [index, item] of promises.entries()) {
      Promise.resolve(item).then(res => {
        data[index] = res
        i++
        if (i === arr.length) resolve(data)
      }).catch(err => reject(err))
    }
  })
}

const promise1 = Promise.resolve('promise1');
const promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 2000, 'promise2');
});
const promise3 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 3000, 'promise3');
});

PromiseAll([11, promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});

// Promise.race
const promiseRace = (arr) => {
  const promises = Array.from(arr)
  return new Promise((resolve, reject) => {
    for(let item of promises) {
      Promise.resolve(item).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    }
  })
}