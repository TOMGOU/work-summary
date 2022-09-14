# Cyclomatic Complexity

## 1. 定义

`圈复杂度` (Cyclomatic complexity) 是一种代码复杂度的衡量标准，也称为条件复杂度或循环复杂度，它可以用来衡量一个模块判定结构的复杂程度，数量上表现为独立现行路径条数，也可理解为覆盖所有的可能情况最少使用的测试用例数。简称 CC。

## 2. 衡量标准

`代码复杂度低，代码不一定好，但代码复杂度高，代码一定不好。`

* 1 - 10: 清晰
* 10 - 20: 复杂
* 20 - 30: 非常复杂
* 30+ : 不可读

## 3. 圈复杂度检测方法

#### 3-1. eslint规则

```js
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module"
  },
  parser: "vue-eslint-parser",
  plugins: [
      'html'
  ],
  'rules': {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    complexity: [
      'warn',
      { max: 1 }
    ]
  }
}
```

#### 3-2. CLIEngine

```js
const eslint = require('eslint');

console.log(eslint)

const { CLIEngine } = eslint;

const cli = new CLIEngine({
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        complexity: [
            'error',
            { max: 0 }
        ]
    }
});

const reports = cli.executeOnFiles(['.']).results;
console.log({ reports })
```

#### 3-3. c-scan

```js
// npm i c-scan --save

const scan = require('c-scan');

scan({
  extensions:'**/*.js',
  rootPath:'src',
  defalutIgnore:'true',
  ignoreRules:[],
  ignoreFileName:'.gitignore'
}).then(res => {
  console.log({ res })
});
```

#### 3-4. c-complexity

```js
// npm i c-complexity --save

const cc = require('c-complexity');

cc({},0).then(res => {
  console.log({ res }, res.result)
});
```

#### 3-5. conard(cli 工具)

```js
// npm i conard -g

conard cc
conard cl
```
