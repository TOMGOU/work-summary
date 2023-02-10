# Husky

> https://github.com/typicode/husky

> https://typicode.github.io/husky/#/

## 基础使用

- step-1: 安装 husky 包

```js
npm install husky -D
```

- step-2: 生成 .husky 文件

```js
// package.json 添加脚本

{
  "prepare": "husky install"
}

// 执行脚本

npm run prepare
```

- step-3: 添加 hook

```js
npx husky add .husky/pre-commit "npm run lint"
```
