# BFC

## BFC 的理解

块级格式化上下文，它是指一个独立的会计渲染区域，只有块级盒子参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与区域外部无关。

## 从一个现象说起

一个没有高度的盒子，子元素浮动，该盒子会出现高度塌陷，无法撑起自身。--这个盒子没有形成 BFC。

## 如何创建 BFC

- 方法一：float 的值不是 none

- 方法二：position 的值不是 static 或者 relative

- 方法三：display 的值是 inline-block、flex 或者 inline-flex

- 方法四：overflow: hidden

## BFC 的作用

- 可以取消盒子 margin 塌陷

- 可以阻止元素被浮动元素覆盖