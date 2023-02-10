# babel基本配置和自定义插件编写

## babel基本配置
```js
const myPlugin = require("./plugin")
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3",
        targets: {
          browsers: ["ie >= 12"]
        }
      }
    ]
  ],
  plugins: [
    myPlugin,
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2
      }
    ]
  ]
}
```

## babel自定义插件编写

## 文档地址
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md

## babel 编译原理

> 经典流程图

![image](../../../imgs/ast.jpeg)

> babel 主要模块及作用

```js
const babel = require("@babel/core") // babel.parseSync 将文件读取的代码转成 AST
const template = require("@babel/template").default // 将手写的模板代码转成 AST
const traverse = require("@babel/traverse").default // traverse 遍历AST树并进行替换、添加、删除操作
const generate = require("@babel/generator").default // 将 AST 还原成代码
```

> demo 代码：在某句代码前插入一段新的代码

```js
const path = require('path')
const fs = require('fs')
const babel = require("@babel/core")
const template = require("@babel/template").default
const generate = require("@babel/generator").default
const traverse = require("@babel/traverse").default

const Path = entryPath.join(__dirname, 'dist/app.js')
const content = fs.readFileSync(entryPath, 'utf-8')

const appJsAst = babel.parseSync(content, {sourceType: 'script'})

const buildRequire = template(`
 const taroApp = require("./taro/app.js");
`)

const ast = buildRequire()

traverse(appJsAst, {
  ExpressionStatement(path) {
    const calleePath = path.get('expression.callee')
    if (calleePath.isIdentifier({ name: 'App' })) {
      const prevPath = path.getPrevSibling()
      const isVariableDeclaration = prevPath.isVariableDeclaration()
      const firstDeclarationPath = isVariableDeclaration && prevPath.get('declarations.0')
      const isTaroApp = firstDeclarationPath && firstDeclarationPath.node.id.name === 'taroApp'
      console.log(firstDeclarationPath.node.id.name)
      if (!isTaroApp) {
        path.insertBefore(ast)
      }
    }
  }
})

const { code: appJsCode } = generate(appJsAst, { sourceMaps: false })

const destPath = path.join(__dirname, 'dist/new.js')

fs.writeFileSync(destPath, appJsCode)

```

> @babel/traverse 方法详解

> ast-explorer 网址：https://lihautan.com/babel-ast-explorer

```js
const traverse = require("@babel/traverse").default

traverse(appJsAst, {
  ExpressionStatement(path) {
    const calleePath = path.get('expression.callee')
    if (calleePath.isIdentifier({ name: 'App' })) {
      const prevPath = path.getPrevSibling()
      const isVariableDeclaration = prevPath.isVariableDeclaration()
      const firstDeclarationPath = isVariableDeclaration && prevPath.get('declarations.0')
      const isTaroApp = firstDeclarationPath && firstDeclarationPath.node.id.name === 'taroApp'
      console.log(firstDeclarationPath.node.id.name)
      if (!isTaroApp) {
        path.insertBefore(ast)
      }
    }
  }
})

// ExpressionStatement
// prevPath.get('declarations.0') 虽然是数组，但还是只能使用点操作，prevPath.get('declarations[0]') 无效
// path.getPrevSibling() 获取兄弟节点
// prevPath.isVariableDeclaration() 节点判断
// firstDeclarationPath.node.id.name === 'taroApp' node 不能少
// path.insertBefore(ast) 节点插入
```

## babel 和 polyfill 的区别

- babel 默认只转换新的 JavaScript 语法（syntax），而不转换新的 API。比如：箭头函数转化成普通函数。

- polyfill 将先的 API 用 es5 的方法实现。比如：Promise、Array.of

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 使用的才引入
        corejs: 3,
      },
    ],
  ],
};
```
