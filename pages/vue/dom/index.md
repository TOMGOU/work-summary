# `Vue` 虚拟dom VS `React` fiber

## `Vue` 虚拟dom

> 对真实 dom 的抽象，用嵌套对象表示，用属性来描述节点，最终通过一系列的操作映射到真实 dom 上

> 优点：

- 保证性能的下限

- 无需手动操作真实 dom

- 跨平台

> 缺点：

- 首次渲染大量的 dom 的时候，会比 innerHTML 的插入速度慢，因为多家了一层虚拟 dom。

```js
class VNnode {
  //构造函数
  //一个节点会有标签（tag）属性（props）value，标签类型
  constructor(tag, props, value, type) {
    //标签名转小写
    this.tag = tag && tag.toLowerCase()
    this.props= props
    this.value = value
    this.type = type
    this.children = []
  }
  //追加子元素
  appendChild(vnode) {
    this.children.push(vnode)
  }
}
```

### 虚拟 `dom` 简单模拟

- 文本节点的创建：document.createTextNode()

- 元素的创建：document.createElement()

- 元素的插入：element.appendChild()

- 元素属性的设置：element.setAttribute(key, val)

```js
const vnode = {
  tag: 'div',
  props: {
    id: 'app',
    className: 'container'
  },
  children: [
    {
      tag: 'p',
      props: {
        id: 'text1',
        className: 'text'
      },
      children: ['123']
    },
    {
      tag: 'p',
      props: {
        id: 'text2',
        className: 'text'
      },
      children: ['456']
    }
  ]
}

const render = (vnode) => {
  if (typeof vnode === 'number') {
    return String(vnode)
  }
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  const element = document.createElement(vnode.tag)

  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      if (key === 'className') {
        element.setAttribute('class', vnode.props[key])
      } else {
        element.setAttribute(key, vnode.props[key])
      }
    })
  }

  if (vnode.children) {
    vnode.children.forEach(childNode => {
      element.appendChild(render(childNode))
    })
  }

  return element
}

console.log(render(vnode))
```

## `React` fiber

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

## `Vue` 虚拟dom VS `React` fiber 差异

> `Vue` 虚拟 dom 只有一个数组类型的 children 属性指向孩子节点，而 `React` fiber 有 return 指向父节点，child 指向孩子节点，sibling 指向最近的兄弟节点。

> 从本质上来说，`Vue` 虚拟 dom 是树，`React` fiber 不仅是一棵树还是双向链表。

## `requestIdleCallback`

> `React` 没有依赖收集，数据更新有瓶颈，需要利用浏览器的空闲时间来

> `React` 放弃使用 `requestIdleCallback`：

  - 浏览器兼容性

  - 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 `tab` 后，之前 `tab` 注册的 `requestIdleCallback` 触发的频率会变得很低

> 基于以上原因，`React` 实现了功能更完备的 `requestIdleCallback` polyfill，这就是 `Scheduler`。

```js
const workLoop = (deadLine) => {
    let shouldYield = false;// 是否该让出线程
    while(!shouldYield){
        console.log('working')
        // 遍历节点等工作
        shouldYield = deadLine.timeRemaining()<1;
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop);
```

## 双缓存技术
...