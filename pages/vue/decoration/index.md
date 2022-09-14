# 修饰符

> 从事件的捕获与冒泡说起。

## addEventListener 

- 第一个参数表示：第一个表示触发条件，比如 'click'、'hashchange'

- 第二个参数表示：触发事件

- 第三个参数表示：事件出发的时机，默认为 false，在冒泡阶段触发

  * true 表示在捕获阶段调用事件处理程序

  * false 表示在冒泡阶段调用事件处理程序

## .capture 修饰符

> 元素点击事件的触发分为两个阶段：捕获阶段和冒泡阶段。

- 不加 .capture 修饰符，相当于 addEventListener 的第三个参数为 false, 在冒泡阶段触发事件。

- 添加 .capture 修饰符，相当于 addEventListener 的第三个参数为 true, 在捕获阶段触发事件。

## 事件修饰符

- .stop: 阻止冒泡事件，相当于 .preventDefault()

- .prevent 阻止默认事件

- .self 只有在 event.target 是当前元素自身时，才触发处理函数

- .once 只执行一次

- .passive 提升移动端的性能

  > 在监听元素滚动事件的时候，会一直触发onscroll事件，在pc端是没啥问题的，但是在移动端，会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符

- .native 自定义组件上绑定原生事件

  > 自定义组件内部只能使用 `vm.$emit` 触发的事件。只有加了 .native 修饰符才能使用原生事件，否者报错。

## 其他修饰符

- .sync 子组件内部改变 props 属性值并更新到父组件中

  > 由于保持数据的单向性，从父组件传到子组件的数据，子组件如果修改了项目还可以运行浏览器上会报错，加上.sync后子组件内部改变props属性值并更新到父组件中

- .lazy 提升输入框输入性能

  > v-model 双向数据绑定，输入框输入内容时视图就更新了，如果想要输入完所有东西，光标离开才更新视图

  ```html
  <input type="text" v-model.lazy="value">
  ```