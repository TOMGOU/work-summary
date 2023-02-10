# https 模块

## openssl 生成证书文件

```js
// 1、生成私钥key文件：
openssl genrsa -out privatekey.pem 1024

// 2、通过私钥生成CSR证书签名  （需要填一些信息、可直接回车）
openssl req -new -key privatekey.pem -out certrequest.csr

// 3、通过私钥和证书签名生成证书文件 
openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
```

- 看到 `Signature ok`，说明生成证书成功。

## https 代码

```js
const https = require('https');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 8000;

const options = {
	key: fs.readFileSync(path.resolve(__dirname, './privatekey.pem'), 'utf8'),
	cert: fs.readFileSync(path.resolve(__dirname, './certificate.pem'), 'utf8')
};

https.createServer(options, function (request, response) {
	response.writeHead(200);
	response.end("Hello world from HTTPS");
}).listen(PORT, () => {
	console.log(`Server listening on https://${HOST}:${PORT}`)
});
```

## chrome 您的连接不是私密连接

> 直接在当前页面用键盘输入 `thisisunsafe` ，不是在地址栏输入，直接敲键盘就行了，页面即会自动刷新进入网页。
