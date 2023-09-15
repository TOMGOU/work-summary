# JS 内存管理机制

## JS 内存生命周期

> 分配内存

> 内存的读与写

> 内存回收

## 栈内存与堆内存

> 其中基本类型包括：String、Number、Boolean、null、undefined、Symbol。这类型的数据最明显的特征是大小固定、体积轻量、相对简单，它们被放在 JS 的栈内存里存储。

> 而排除掉基本类型，剩下的 Object 类型就是引用类型，又名“复杂类型”。顾名思义，引用类型的数据往往相对复杂、占用空间较大、且大小不定，它们被放在 JS 的堆内存里存储。

## 垃圾回收机制

### 引用计数

```js
const students = ['修言', '小明', 'bear']
```

> 这行代码首先是开辟了一块内存，把右侧这个数组塞了进去，此时这个数组就占据了一块内存。随后 students 变量指向它，这就是创建了一个指向该数组的 “引用”。此时数组的引用计数就是 1 。

```js
const students = ['修言', '小明', 'bear']
students = null
```

> 在引用计数法的机制下，内存中的每一个值都会对应一个引用计数。当垃圾收集器感知到某个值的引用计数为 0 时，就判断它 “没用” 了，随即这块内存就会被释放。

> 引用计数的问题，无法识别循环引用

```js
function badCycle() {
  var cycleObj1 = {}
  var cycleObj2 = {}
  cycleObj1.target = cycleObj2
  cycleObj2.target = cycleObj1
}

badCycle()
```

### 标记清除

> 自 2012 年起，所有浏览器都使用了标记清除算法。可以说，标记清除法是现代浏览器的标准垃圾回收算法。在标记清除算法中，一个变量是否被需要的判断标准，是它是否可抵达 。

> 标记清除算法有两个阶段，分别是标记阶段和清除阶段：

  - 标记阶段：垃圾收集器会先找到根对象，在浏览器里，根对象是 Window；在 Node 里，根对象是 Global。从根对象出发，垃圾收集器会扫描所有可以通过根对象触及的变量，这些对象会被标记为“可抵达 ”。

  - 清除阶段： 没有被标记为“可抵达” 的变量，就会被认为是不需要的变量，这波变量会被清除

## 内存泄漏

> 该释放的变量（内存垃圾）没有被释放，仍然霸占着原有的内存不松手，导致内存占用不断攀高，带来性能恶化、系统崩溃等一系列问题，这种现象就叫内存泄漏。

### 内存泄漏成因分析

- 全局变量

```js
function test() {
  me = 'xiuyan'
}
```

- 忘记清除的 setInterval 和 setTimeout

- 清除不当的 DOM

```js
const myDiv = document.getElementById('myDiv')

function handleMyDiv() {
    // 一些与myDiv相关的逻辑
}

// 使用myDiv
handleMyDiv()

// 尝试”删除“ myDiv
document.body.removeChild(document.getElementById('myDiv'));
```