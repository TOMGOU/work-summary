# RegExp

## 正则基础知识：

* `\d`: 数字
* `\w`: 数字字母下划线
* `\s`: 空格
* `[a-zA-Z]`: 字母
* `[-]`: 正则元素，例如：`/[0-9]/g`
* `{,}`: 正则量词，例如：`/\d{0,3}/g`
* `*`: 0个或者多个，`{0,}`
* `+`: 1个或者多个，`{1,}`
* `?`: 0个或者1个，`{0,1}`
* `[^0]\d*[@]$`: `^` 表示以什么开头，`$` 表示以什么结尾

## reg 的方法

1. reg.test(str)：匹配到：返回true;匹配不到：返回false;

2. reg.exec(str)：匹配到：返回数组【reg,index,str】；匹配不到：返回null;无全局标识符，无子集：匹配到：返回数组；匹配不到：返回null;【["123", index: 0, input: "123abc123def123"]】无全局标识符，有子集：匹配到：返回数组（第二项是子集）；匹配不到：返回null;【["123", "12", index: 0, input: "123abc123def123"]】

## string 的方法

- match

str.match(reg)：无全局标识符，无子集：匹配到：返回数组；匹配不到：返回null;【["123", index: 0, input: "123abc123def123"]】与exec类似无全局标识符，有子集：匹配到：返回数组（第二项是子集）；匹配不到：返回null;【["123", "12", index: 0, input: "123abc123def123"]】与exec类似有全局标识符：匹配到：返回数组（全为匹配到的项）；匹配不到：返回null;【["123", "123", "123"]】忽略全局标识符

- replace

str.replace(reg,newStr)

- search

str.search(reg)：匹配到：总是返回第一个匹配项的下标；匹配不到：返回-1；

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
