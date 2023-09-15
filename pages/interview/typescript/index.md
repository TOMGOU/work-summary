# TypeScript

## 1. 你觉得使用ts的好处是什么?

* TypeScript是JavaScript的加强版，它给JavaScript添加了可选的静态类型和基于类的面向对象编程，它拓展了JavaScript的语法。所以ts的功能比js只多不少.
* Typescript 是纯面向对象的编程语言，包含类和接口的概念.
* TS 在开发时就能给出编译错误， 而 JS 错误则需要在运行时才能暴露。
* 作为强类型语言，你可以明确知道数据的类型。代码可读性极强，几乎每个人都能理解。
* ts中有很多很方便的特性, 比如可选链.

## 2. type 和 interface的异同

重点：用interface描述数据结构，用type描述类型

## 3. tsconfig.json如何配置？

```js
{
  "exclude": ["node_modules"],
  "include": ["src/**/*.ts"],
  "compilerOptions": {
    "target": "ES6",           // 目标 JavaScript 版本
    "module": "CommonJS",      // 模块系统
    "outDir": "./dist",        // 编译输出目录
    "rootDir": "./src",        // TypeScript 源代码目录
    "strict": true,            // 启用严格类型检查
    "esModuleInterop": true    // 启用 ECMAScript 模块系统互操作性
  }
}
```

## 4. 什么是泛型？