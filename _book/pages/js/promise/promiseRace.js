const urls = [
  {
    info: 'img-1',
    time: 1000
  },
  {
    info: 'img-2',
    time: 2000
  },
  {
    info: 'img-3',
    time: 4000
  },
  {
    info: 'img-4',
    time: 5000
  },
  {
    info: 'img-5',
    time: 4000
  },
  {
    info: 'img-6',
    time: 3000
  },
  {
    info: 'img-7',
    time: 2000
  },
  {
    info: 'img-8',
    time: 3000
  },
  {
    info: 'img-9',
    time: 2000
  },
  {
    info: 'img-10',
    time: 4000
  },
  {
    info: 'img-11',
    time: 2000
  },
  {
    info: 'img-12',
    time: 3000
  },
]

const limitLoad = (urls, handler, limit) => {
  const sequence = [].concat(urls)
  let promises = []

  promises = sequence.splice(0, limit).map((url, index) => handler(url).then(() => index))

  let p = Promise.race(promises)
  for (let i = 0; i < sequence.length; i++) {
    p = p.then(res => {
      promises[res] = handler(sequence[i]).then(() => res)
      return Promise.race(promises)
    }).then()
  }
}


const loadImg = url => {
  return new Promise((resolve) => {
    console.log(`${url.info} start`)
    setTimeout(() => {
      console.log(`${url.info} end`)
      resolve()
    }, url.time)
  })
}

limitLoad(urls, loadImg, 3)
