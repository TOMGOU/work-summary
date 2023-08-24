# css Modules

## css Modules 是什么

> A CSS Modules is a CSS file in which all class names and animation names are scoped locally by default.

> 所有的类名和动画名称默认都有各自的作用域的 CSS 文件。CSS Modules 并不是 CSS 官方的标准，也不是浏览器的特性，而是使用一些构建工具，比如 webpack，对 CSS 类名和选择器限定作用域的一种方式（类似命名空间）

## vite 的 css Modules 配置

> https://cn.vitejs.dev/config/shared-options.html#css-modules

```js
css.modules: {
  // 开启 camelCase 格式变量名转换
  localsConvention: 'camelCase',
  // 类名 前缀
  // generateScopedName: (name: string) => name,
  generateScopedName: '[local]',
},
```

## css Modules 使用

```js
import styles from "./style.module.less";

<div className={styles.body}></div>
```

## css Modules 的实现原理


### postcss-modules-scope

> https://github.com/css-modules/postcss-modules-scope/blob/master/src/index.js

> 这个包主要是实现了 CSS Modules 的样式隔离（Scope Local）以及继承（Extend）

### postcss-modules-values

> https://github.com/css-modules/postcss-modules-values/blob/master/src/index.js

> 这个库的主要作用是在模块文件之间传递任意值，主要是为了实现在 CSS Modules 中能够使用变量


## 总结

CSS Modules 并不是 CSS 官方的标准，也不是浏览器的特性，而是使用一些构建工具，比如 webpack，对 CSS 类名和选择器限定作用域的一种方式（类似命名空间）。通过 CSS Modules，我们可以实现 CSS 的局部作用域，Class 的组合等功能。最后我们知道 CSS Loader 实际上是通过两个库进行实现的。其中， postcss-modules-scope —— 实现CSS Modules 的样式隔离（Scope Local）以及继承（Extend）和 postcss-modules-values ——在模块文件之间传递任意值