# RegExp

> string 的方法

- match
- replace
- search

> RegExp 的方法

- test
- exec

## match

> 从 string 中匹配符合正则的结果，以数组的形式返回

> 如果正则指定了参数 g，那么 match 一次返回所有的结果 ["1a", "1b", "1c"]

> 如果正则没有指定了参数 g，那么 match 返回符合条件的第一个匹配项结果 ["1a", index: 0, input: "1a1b1c", groups: undefined]

```js
const htmlText = res.text
const reg = new RegExp('"objURL":"(.*?)",', 'g')
const imgUrl = htmlText.match(reg)
const imgList = imgUrl.map(item => {
  item.match(/":(.*)"/g)
  return RegExp.$1
})
```

## replace

> 直接替换

```js
const str = `Welcome to Microsoft!
We are proud to announce that Microsoft has.
one of the largest Web Developers sites in the world.`

const option = {'Microsoft': 'W3School', 'world': 'universe'}

Object.keys(option).forEach(key => {
  str = str.replace(new RegExp(key, 'g'), option[key])
})

console.log({str})
```

> 函数替换

```js
const year = '2021'; 
const month = '10'; 
const day = '01'; 

let template = '${year}-${month}-${day}';
let context = { year, month, day };

const render = tem => {
  return (obj) => {
    // ?的意思是非贪婪模式（https://regex101.com/）
    return tem.replace(/\$\{(.+?)\}/g, (args, key) => {
      return context[key]
    })
  }
}

const str = render(template)({year,month,day});

console.log(str)
```
## search

> string.test(RegExp): 返回符合条件的第一个匹配项下标，如果匹配不到，则返回 -1。

## test

> RegExp.test(string): 查找对应的字符串中是否存在，存在返回 true，不存在返回 false。

## exec

> RegExp.exec(string): 查找并返回当前的匹配结果，并以数组的形式返回，匹配不到返回 null。
