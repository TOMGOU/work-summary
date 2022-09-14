# ndb调试node源码

```
ndb is an improved debugging experience for Node.js, enabled by Chrome DevTools 
ndb 是一次对 node 调试体验的升级，Chrome DevTools 原生支持 ndb
```

### ndb安装

```
npm install -g ndb
```

### 启动ndb

##### 1.直接执行文件

```
ndb app.js
```

##### 2.运行一个二进制可执行文件

```
ndb npm start
```

##### 3.运行一个项目

```
ndb .
```

### ndb放置断点
- 和浏览器调试一致
- chrome 浏览器调试快速定位文件快捷键： command + p
