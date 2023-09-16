
const reactive1 = (data) => {
  return new Proxy(data, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      console.log('get', key, result)
      return result
    },
    set(target, key, val, receiver) {
      const result = Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      return true
    }
  })
}

const reactive2 = (data) => {
  Object.keys(data).forEach(key => {
    console.log(key)
    Object.defineProperty(data, key, {
      get() {
        console.log('get', key, data[key])
        return data[key]
      },
      set(newValue) {
        console.log('set', key, newValue)
        data[key] = newValue
      }
    })
  })
}

// const data = {
//   a: 2
// }

// reactive2(data)

// data.a = 1
// console.log(data.a)

const data = {
  value: 42
};

// 使用 Object.defineProperty 定义属性的 getter 和 setter
Object.defineProperty(data, 'value', {
  enumerable: true,
  configurable: true,
  get() {
    return data['value'];
  },
  set(newValue) {
    console.log('Setting value to', newValue);
    this._value = newValue;
  }
});

console.log(data.value); // 触发 getter
data.value = 100; // 触发 setter
