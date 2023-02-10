# Lerna 使用说明

## 使用教程

### 安装

```shell
$ npm install --global lerna
```

### 起步

创建项目 

```shell
$ mkdir lerna-example && cd lerna-example
$ npx lerna init
```

### 添加第一个包

- 命令：`lerna create <name> [loc]`
- 文档： https://github.com/lerna/lerna/tree/master/commands/create#readme

**举例**

这里包名为 `lerna-pkg-util`

```
lerna create lerna-pkg-util
```

### 添加依赖

- 命令：`lerna add <pkg> [globs..]`
- 文档：https://github.com/lerna/lerna/tree/master/commands/add#readme

**举例**

这里往 `lerna-pkg-util` 包添加依赖 `dayjs`

```
lerna add dayjs --scope=lerna-pkg-util
```

如果是 dev 依赖加上命令

```
lerna add gulp --scope=lerna-pkg-util --dev
```

### 安装依赖

- 命令：`lerna bootstrap`
- 文档：https://github.com/lerna/lerna/tree/master/commands/bootstrap#readme

### 包发布

- 命令：`lerna publish [bump]`
- 文档：https://github.com/lerna/lerna/tree/master/commands/publish#readme

推荐采用 `lerna publish from-package --yes` 方式来发布，因为如果直接采用 `lerna publish` 与 `lerna publish from-git` 则需要 git commit 没提交，才能 `publish` 成功。而采用 `lerna publish from-package --yes` 则只需要 `npm` 包的版本号没有发不过，则可以继续发布。这样很方便集成在 `CI` 里。


### 常见问题

###### 1. 如何把 `node_modules` 安装到根目录

在项目 `lerna.json` 增加如下配置
```
  "command": {
    "bootstrap": {
      "hoist": true
    }
  }
```

###### 2. 如何解决 `CI` 环境下发布权限问题？

在 `lerna` 项目根目录下，创建 `.npmrc`，里面代码如下：

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

在 `npmjs` 后台创建 `Access Tokens` ，然后在 `CI` 设置 `NPM_TOKEN` 的环境变量为 `Access Tokens` 的值即可。


### 参考资料

官网：https://lerna.js.org/
Github：https://github.com/lerna/lerna