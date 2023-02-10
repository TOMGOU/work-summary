new Promise((resolve) => {
  console.log(1)
  setTimeout(() => {
    console.log(2);
  }, 1000);
  resolve()
}).then(() => {
  console.log(4)
  new Promise((resolve) => resolve()).then(() => {
    console.log(3)
    new Promise((resolve) => resolve()).then(() => {
      console.log(5)
    })
  })
})

// 1 4 3 5 2
