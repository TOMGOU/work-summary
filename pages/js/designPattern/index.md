# Design Pattern

> js 是一门动态的语言，设计模式的目的是为了编写出更加优雅，更具有维护性的代码。

> 新项目各方面设计的好，后期傻子也能维护好。

## 设计原则（SOLID）

> 不用死脑筋全部满足，尽可能多的满足这些原则即可。

#### 单一职责原则

> S（Single Responsibility Principle)

> 一个程序或一个类或一个方法只做好一件事，如果功能过于复杂，我们就拆分开，每个方法保持独立，减少耦合度。

#### 开闭原则

> O（Open Closed Principle)

> 对扩展开放，对修改封闭；增加新需求的时候，我们需要做的是增加新代码，而非去修改源码。

#### 里斯替换原则

> L（Liskov Substitution Principle）

> 子类必须实现父类的抽象方法，但不得重写父类的非抽象方法。

> 当子类覆盖或实现父类的方法时，方法的输入参数可以比父类方法的输入参数更宽松。

> 当子类覆盖或实现父类的方法时，方法的返回结果可以比父类方法的返回结果范围更严格。

#### 接口隔离原则

> I (Interface Segregation Principle)

> 保持接口的单一独立，类似于单一原则，不过接口独立原则更注重接口。

#### 依赖倒置原则

> D（Dependence Inversion Principle）

> 面向接口编程，依赖于抽象而不依赖于具体，使用方只关注接口而不需要关注具体的实现。

## 设计模式

> 按类型分为：创建型、结构型和行为型

### A. 创建型

> 工厂模式: 批量生产同类型应用来满足频繁使用同一种类型需求时

> 建造者模式: 当我们需要模块化拆分一个大模块，同时使模块间独立解耦分工

> 单例模式: 全局只需要一个实例，注重统一一体化

#### 工厂模式

> Button Producer：生产不同类型的按钮 => 生产多个本质相同，利用传参区分不同属性的元素

#### 建造者模式

> 页头组件Header: 包含了title、button、breadcum => 生产多重不同类型的元素 => 建造者

#### 单例模式

> 全局只有一个实例，比如：全局应用 router store

### B. 结构型

> 适配器模式: 中间转换参数、保持模块间独立的时候

> 装饰器模式: 附着于多个组件上，批量动态赋予功能的时候

> 代理模式: 将代理对象与调用对象分离，不直接调用目标对象

#### 适配器模式

> 适配模式可用来在现有接口和不兼容的类之间进行适配。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。

> 配合策略模式使用更香。

```js
class HKDevice {
  getPlug() {
    return '港行插头';
  }
}

class mainlandDevice {
  getPlug() {
    return '大陆插头';
  }
}

class Target {
  constructor(name) {
    this.name = name
    this.device = {
      'HKDevice': new HKDevice(),
      'mainlandDevice': new mainlandDevice()
    }
    this.plug = this.getDevice();
  }
  getDevice() {
    return this.device[this.name]
  }
  getPlug() {
    return this.plug.getPlug() + '+转换器';
  }
}

const target1 = new Target('mainlandDevice');
const res1 = target1.getPlug();

const target2 = new Target('HKDevice');
const res2 = target2.getPlug();

console.log({res1, res2})
```

#### 装饰器模式

> 装饰器(decorator)模式能够在不改变对象自身的基础上，动态的给某个对象添加额外的职责，不会影响原有接口的功能。比如：埋点。

> 其实就是在函数体外面包裹了一层。

```js
const _onload = () => {console.log('onload')}

onload = () => {
  _onload();
  console.log('自己的处理函数');
};

onload()
```

> es6 的装饰器就是写在 Model 类下面的 getData 方法上面：@wrap

> es6 装饰器的三个参数：target, name, descriptor
  - target：Model.prototype 原型
  - name：key 类方法名
  - descriptor：Object.getOwnPropertyDescriptor(target, key) 类方法对应的描述符

```js
class Model {
  getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('wait for 2 seconds')
        resolve([{
          id: 1,
          name: 'Niko'
        }, {
          id: 2,
          name: 'Bellic'
        }])
      }, 2000)
    })
  }
}

const wrap = (Model, key) => {
  // 获取Class对应的原型
  let target = Model.prototype

  // 获取函数对应的描述符
  let descriptor = Object.getOwnPropertyDescriptor(target, key)

  let log = function (...arg) {
    let start = new Date().valueOf()

    return descriptor.value.apply(this, arg).then((res) => {
      let end = new Date().valueOf()
      console.log(`start: ${start} end: ${end} consume: ${end - start}`)
      return res
    })
  }

  Object.defineProperty(target, key, {
    ...descriptor,
    value: log
  })
}

wrap(Model, 'getData')

const init = async() => {
  const model = new Model()

  const res = await model.getData()

  console.log(res)
}

init()
```

```js
// 类装饰器
export const test = (target: any) => {
  target.isAnimal = true;
  console.log({target})
  return target;
}

// 类方法装饰器
export const readonly = (target: any, name: string, descriptor: PropertyDescriptor) => {
  descriptor.writable = false;
  console.log('readonly')
  return descriptor;
}

// 使用
@test
export default class VirtualList extends Vue {
  @readonly
  created() {
    console.log(123)
  }
}
```

#### 代理模式

> 代理模式分为很多类，其中经常用到的有保护代理、虚拟代理、缓存代理。

> 保护代理是为了阻止外部对内部对象的访问或者是操作。比如：下面的示例。

> 虚拟代理是为了提升性能，延迟本体执行，在合适的时机进行触发，目的是减少本体的执行次数。比如：节流函数。

> 缓存代理同样是为了提升性能，但是为了减缓内存的压力，同样的属性，在内存中只保留一份。

```js
class Game {
  play() {
    return "playing";
  }
}

class Player {
  constructor(age) {
    this.age = age;
  }
}

class GameProxy {
  constructor(player) {
    this.player = player;
  }
  play() {
    return (this.player.age < 16) ? "小屁孩不让玩游戏" : new Game().play();
  }
}

const player = new Player(15);
const game = new GameProxy(player);

const res = game.play();

console.log(res)
```

### C. 行为型

> 命令模式: 发出指令，中间层传递命令本身，命中包含执行对象

> 模板模式: 通过模板定义执行顺序，做独立操作

> 观察者模式: 通过观察者，可以让被观察值统一发生变化，触发相应依赖值的统一更新

> 职责链模式: 独立职责的单元通过链式执行，逐步操作流程

> 策略模式: 策略模式的目的是定义一组算法，将每个算法封装在独立的策略类中，并使它们可以互相替换，以便在运行时选择合适的策略来解决特定的问题

> 迭代器模式: 迭代器模式的目的是提供一种顺序访问聚合对象（例如列表、数组或集合）元素的方法，而不暴露聚合对象的内部结构。它将迭代的责任封装在一个独立的迭代器对象中。

#### 命令模式

> 将请求封装成对象，分离命令接受者和发起者之间的耦合，主要分三个对象：发起者、命令对象、接受者。

> Kicker 发起命令，触发 Commander 执行命令，让 Receiver 干活。

```js
class Receiver {
  exec () {
    console.log('你给我滚！')
  }
}

class Commander {
  constructor (receiver) {
    this.receiver = receiver
  }
  exec () {
    this.receiver.exec()
  }
}

class Kicker {
  constructor (command) {
    this.command = command
  }
  go () {
    this.command.exec()
  }
}

const receiver = new Receiver()
const commander = new Commander(receiver)
const kicker = new Kicker(commander)

kicker.go()
```

#### 模板模式

> 模板模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。

> 抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。

> 子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择`重写父类的方法`。

```js
class Template {
  boilWater () {
    console.log('把水煮开')
  }
  brew () {}
  pourInCup () {}
  addCondiments () {}

  init () {
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
  }
}

class Coffee extends Template {
  brew () {
    console.log('用沸水冲泡咖啡')
  }

  pourInCup () {
    console.log('把咖啡倒进杯子')
  }

  addCondiments () {
    console.log('加糖和牛奶')
  }
}

class Tea extends Template {
  brew () {
    console.log('用沸水冲泡茶叶')
  }

  pourInCup () {
    console.log('把茶叶倒进杯子')
  }

  addCondiments () {
    console.log('加加柠檬')
  }
}

const coffee = new Coffee()
coffee.init()

const tea = new Tea()
tea.init()
```

#### 发布订阅模式

> 发布订阅应用的场景很多，比如 vue 的双向绑定、node 的 EventEmitter

> MyEventEmitter 中的 on 是订阅，emit 是发布。

```js
class MyEventEmitter {
  constructor() {
    this.events = {}
  }

  on (event, cbFn) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(cbFn)
    return this
  }

  off (event, cbFn) {
    if (!cbFn) {
      this.events[event] = []
      return this
    }
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(item => item !== cbFn)
    }
    return this
  }

  once (event, cbFn) {
    const onceFn = () => {
      cbFn.apply(this, arguments)
      this.off(event, onceFn)
    }
    this.on(event, onceFn)
    return this
  }

  emit (event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(item => item.call(this, ...args))
    }
  }
}

// test
const myEvent = new MyEventEmitter()

myEvent.on('test1', () => {
  console.log('test-11')
}).on('test1', () => {
  console.log('test-22')
}).on('test1', () => {
  console.log('test-33')
})

myEvent.emit('test1')
```

#### 职责链模式

> 责任链模式（Chain of Responsibility Pattern）为请求创建了一个接收者对象的链。使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。

> 数据链如下：

```js
const action = {
  name: 'HR',
  nextAction: {
    name: '领导',
    nextAction: { 
      name: '老板',
      nextAction: null 
    }
  }
}
```

```js
class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }
  setNextAction(action) {
    this.nextAction = action;
  }
  approve() {
    console.log(`${this.name}请审批，是否可以请假？`);
    if (this.nextAction !== null) {
      this.nextAction.approve();
    }
  }
}

const hr = new Action('HR');
const leader = new Action('领导');
const boss = new Action('老板');

hr.setNextAction(leader);
leader.setNextAction(boss);

console.log(hr)

hr.approve();
```

#### 策略模式

> 优化 if else 的一种常用手段，比较简单。

```js
const performanceS = salary => salary * 4

const performanceA = salary => salary * 3

const performanceB = salary => salary * 2

const calculateBonus = function( performanceLevel, salary ){
  if ( performanceLevel === 'S' ) {
    return performanceS( salary )
  }
  if ( performanceLevel === 'A' ) {
    return performanceA( salary )
  }
  if ( performanceLevel === 'B' ) {
    return performanceB( salary )
  }
}
const res = calculateBonus( 'A' , 10000 )

console.log(res)
```

改成策略模式：

```js
const strategies = {
  "S": salary => salary * 4,
  "A": salary => salary * 3,
  "B": salary => salary * 2
}
const calculateBonus = (level, salary) => strategies[level](salary)

const res = calculateBonus( 'A' , 10000 )

console.log(res)
```

#### 迭代器模式

> 从一个数据集合中按照一定顺序，不断地取数据的过程

> 工作中的实际应用案例：循环动画，从第一个 next() 开始，循环调用，从而将动画抽离成一个配置文件，实现用户自定义动画的功能

```ts
import { ref } from 'vue'
import gsap from 'gsap'
import { controls } from './controls'
import { camera } from './three'
import { task } from '../config/task'
import { selectedValue } from './webWorker/index'

const task = [
  {
    type: 'screen',
    target: true,
    duration: 0.5
  },
  {
    type: 'switch',
    target: 'floor_0'
  },
  {
    type: 'gsap',
    target: controls.target,
    obj: {
      x: 0,
      y: 0,
      z: 0
    },
    duration: 1
  },
  {
    type: 'rotate',
    duration: 30
  },
  {
    type: 'switch',
    target: 'floor_1'
  },
  {
    type: 'gsap',
    target: controls.target,
    obj: {
      x: -600,
      y: 0,
      z: 500
    },
    duration: 4
  }
]

const isShowModel = ref(true)
const isShowDash = ref(true)

const gsapPromise = (property: any, obj: any, duration: number) => {
  return new Promise((resolve, reject) => {
    gsap.to(property, {
      ...obj,
      duration,
      repeat: 0,
      yoyo: true,
      onComplete: () => {
        resolve(1)
      }
    })
  })
}

const rotatePromise = (duration: number) => {
  return new Promise((resolve, reject) => {
    controls.autoRotate = true
    gsap.delayedCall(duration, () => {
      controls.autoRotate = false
      resolve(1)
    })
  })
}

const switchFloorPromise = (target: string) => {
  return new Promise((resolve, reject) => {
    selectedValue.value = target
    gsap.delayedCall(1, () => {
      resolve(1)
    })
  })
}

const switchScreenPromise = (target: boolean, duration: number) => {
  return new Promise((resolve, reject) => {
    isShowModel.value = target
    isShowDash.value = !target
    gsap.delayedCall(duration, () => {
      resolve(1)
    })
  })
}

let taskGenerator: any = null

function* generatorEach(arr: any[]) {
  for (const [index, value] of arr.entries()) {
    yield (async () => {
      const { type, target, obj, duration } = value
      // 楼层模型切换
      if (type === 'switch') {
        await switchFloorPromise(target)
      // 大屏切换
      } else if (type === 'screen') {
        await switchScreenPromise(target, duration)
      // 位置切换
      } else if (type === 'gsap') {
        await gsapPromise(target, obj, duration)
      // 场景旋转
      } else if (type === 'rotate') {
        await rotatePromise(duration)
      }
      const { done } = taskGenerator.next()
      if (done) {
        taskGenerator = generatorEach(task)
        taskGenerator.next()
      }
    })()
  }
}

const animation = async () => {
  if (gsap.globalTimeline.paused()) {
    location.reload()
    controls.autoRotate = true
  } else {
    controls.reset()
    controls.autoRotate = false
    taskGenerator = generatorEach(task)
    taskGenerator.next()
  }
}

const rest = () => {
  controls.autoRotate = false
  gsap.globalTimeline.pause()
}

export { animation, rest, isShowModel, isShowDash }
```

后面继续。。。
