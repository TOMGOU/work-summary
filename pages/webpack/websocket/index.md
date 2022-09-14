# websocket 在热更新中的应用

## 服务端

```js
const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server
const chokidar = require('chokidar')

wss = new WebSocketServer({ port: 8181 });
wss.on('connection', (ws) => {
  const watch = chokidar.watch('dist', {
    persistent: true,
    ignoreInitial: true,
    disableGlobbing: false
  })

  watch.on('change', (filePath) => {
    ws.send('reload')
  })
})
 
app.use('/', express.static('./dist'));
 
app.listen(3001);
```

`chokidar 是基于 fs.watch 的文件监听第三方库`

## 客户端

```js
const ws = new WebSocket('ws://localhost:8181');
ws.onmessage = function (e) {
  console.log('message', e.data)
  window.location.reload()
}
```