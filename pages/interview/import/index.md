# 按需引入和全量引入

## export与export default的区别

- 1.在一个js文件中，export可以多次使用，export default只能使用一次

- 2.export最后导出的是一个对象，其导出的内容会被放入此对象中，在导入时用解构赋值来取值比较方便；export default导出时是什么，导入时就是什么。

- 3.export default后面不可以用 var、let、const， 可用 export default function(){} function add(){}

## export 

```js
// @lx-frontend/wrap-element-ui
export {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}

// 导入
import { SearchSelect } from '@lx-frontend/wrap-element-ui'
```

## export default

```js
// @lx-frontend/wrap-element-ui
export default {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}

// 导入
import wrapElement from '@lx-frontend/wrap-element-ui'
```

## export + export default

```js
// @lx-frontend/wrap-element-ui
export {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}
export default {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}

// 导入
import wrapElement, { SearchSelect } from '@lx-frontend/wrap-element-ui'
```
