# webp

## 批量转换 webp

```js
const webp=require('webp-converter');
const { resolve, basename, extname } = require('path');
const glob = require("glob")

webp.grant_permission();

glob("./imgs/*.{gif,png,jp{,e}g}", { root: resolve(__dirname, './')}, function (er, files) {
  files.forEach(file => {
    extname(file) === '.gif' ?
    webp.gwebp(file, resolve(__dirname,`./webp/${basename(file)}.webp`), "-q 80", logging="-v") :
    webp.cwebp(file, resolve(__dirname,`./webp/${basename(file)}.webp`), "-q 80", logging="-v");
  })
})
```

- 做一下并发控制，防止超过系统限制

```js
const webp=require('webp-converter');
const { resolve, basename, extname } = require('path');
const glob = require("glob")

webp.grant_permission();

const limitGenerate = (files, handler, limit) => {
  const sequence = [].concat(files)
  let promises = []

  promises = sequence.splice(0, limit).map((file, index) => handler(file).then(() => index))

  let p = Promise.race(promises)
  for (let i = 0; i < sequence.length; i++) {
    p = p.then(res => {
      promises[res] = handler(sequence[i]).then(() => res)
      return Promise.race(promises)
    }).then()
  }
}

const generateImg = file => {
  return new Promise((res) => {
    console.log(`${file} start`)
    const result = extname(file) === '.gif' ?
    webp.gwebp(file, resolve(__dirname,`./webp/${basename(file)}.webp`), "-q 80", logging="-v") :
    webp.cwebp(file, resolve(__dirname,`./webp/${basename(file)}.webp`), "-q 80", logging="-v");
    result.then(() => {
      console.log(`${file} end`)
      res()
    });
  })
}

glob("./imgs/*.{gif,png,jp{,e}g}", { root: resolve(__dirname, './')}, function (er, files) {
  limitGenerate(files, generateImg, 3)
})

```

## webp 在页面中的应用: image + background-image

```js
/* *注册全局自定义指令 `webp-bg``v-webp`
 * 是否支持 webp
 * @memberof isSupportWebp
 * 如果画布的高度或宽度是0，那么会返回字符串'data:',
 * 如果传入的类型非'image/png'，但是返回的值以'data:image/png'开头，那么该传入的类型是不支持的。
 * */
const isSupportWebp = document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0;
Vue.directive('webp', {
  inserted (el: any) {
    try {
      if (isSupportWebp) {
        if (process.env.RUN_ENV === 'development') {
          el.src = el.src.replace(/https*:\/\/[^/]+\//, '/');
          return;
        }
        if (el.src.indexOf('base64')) {
          return;
        }
        el.src = `${el.src}_.webp`;
      }
    } catch (err) {
      return false;
    }
  },
});
Vue.directive('webp-bg', {
  inserted (el: any) {
    try {
      if (isSupportWebp) {
        const str = (el).getAttribute('class').split(' ');
        str.push('webpa');
        el.setAttribute('class', str.join(' '));
      }
    } catch (err) {
      return false;
    }
  },
});
```

```html
<div class="index-nav" v-webp-bg></div>
<img src="../../assets/styles/images/file_bg.png" v-webp alt="">
```
