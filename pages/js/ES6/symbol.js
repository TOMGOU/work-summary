let s1 = Symbol('foo');
let s2 = Symbol('foo');

let s3 = Symbol.for('foo');
let s4 = Symbol.for('foo');

console.log(s3 === s4);

console.log(Symbol.keyFor(s3), Symbol.keyFor(s1))

console.log(s1.toString() === s3.toString());

console.log(s1.description, s3.description);

let a = {
  [s1]: 'Hello!',
  [s2]: 'World!',
  name: 'test'
};

console.log(a[s1], a[s2]);


Object.getOwnPropertySymbols(a).forEach(s => {
  console.log(s, a[s]);
})

Reflect.ownKeys(a).forEach(s => {
  console.log(s, a[s])
})
