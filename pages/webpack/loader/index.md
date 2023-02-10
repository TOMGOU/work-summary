# webpack-loader

## loader template

```js
const loaderUtils = require('loader-utils')
const cnchar = require('cnchar')
const trad = require('cnchar-trad')
cnchar.use(trad)

module.exports = function (source) {
  const option = loaderUtils.getOptions(this);
  let newSource = ''
  newSource = cnchar.convert.simpleToTrad(source)
  const optionKeys = Object.keys(option)
  optionKeys.length && optionKeys.forEach(key => {
    newSource = newSource.replace(new RegExp(key, 'g'), option[key])
  })
  return newSource
}
```

## loader 参数

> https://www.npmjs.com/package/loader-utils

```js
const loaderUtils = require('loader-utils')

const option = loaderUtils.getOptions(this);
```
