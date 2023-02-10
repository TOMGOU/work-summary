# Class

## prototype && __proto__ && constructor 三角关系

> https://blog.csdn.net/cc18868876837/article/details/81211729

```js
class Test {
  ...
}

const test = new Test()

Test.prototype === test.__proto__ // true

Test.prototype.constructor === test.constructor  // true
```

## new 关键字干了啥？

## 静态属性 && 静态方法

```js
class Test {
  static option = {
    test: 123
  }

  static showOption () {
    console.log(this.option)
  }
}

console.log(Test.option)

console.log(Test.showOption())
```

## 私有属性 && 私有方法

## 静态块

## new.target 属性

## Class 的继承

> 通过extends关键字实现继承

#### Object.getPrototypeOf

#### super 关键字