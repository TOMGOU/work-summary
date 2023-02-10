# 前端模块化和组件化理解
模块化主要体现的是一种分而治之的思想。分而治之是软件工程的重要思想，是复杂系统开发和维护的基石。模块化则是前端最流行的分治手段。
### 为什么需要模块化

> 我们都知道在早期 JavaScript 没有模块这一概念，都是通过script标签引入js文件代码。当然这写基本简单需求没有什么问题，但当我们的项目越来越庞大时，我们引入的js文件就会越多，这时就会出现以下问题：

- js 文件作用域都是顶层，这会造成变量污染。

- js 文件多，变得不好维护。

- js 文件依赖问题，稍微不注意顺序引入错，代码全报错。

### 前端模块化历史和方案
1. 函数封装
2. 对象封装
3. 闭包，立即执行函数
4. AMD(Asynchronous Module Definition)
5. CMD(Common Module Definition)
6. ES6 import export/export default

##### 函数封装

> 造成全局变量污染

##### 对象封装

> 造成全局变量污染

##### 闭包，立即执行函数

> 下面是好多年前封装的一个模块

```js
/**
 * 占用全局变量 Semiauto（半自动）和 Auto（自动轮播）
 * 启动函数.exec()
 */
(function (win) {
  function Semiauto($ul, $li, $tab) {
    this.$ul = $ul;
    this.$tab = $tab;
    this.width = $li.width();
    this.index = 0;
  }
  Semiauto.prototype = {
    exec: function () {
      this.addEvent();

    },
    addEvent: function () {
      var This = this;
      this.$tab.mouseenter(function () {
        This.index = This.$tab.index($(this));
        $(this).addClass("on").siblings().removeClass("on");
        This.$ul.finish().animate({
          left: -This.width * This.index
        }, 500)
      })
    }
  };
  //inhert and extend
  function Auto($ul, $li, $tab, $box) {
    Semiauto.call(this, $ul, $li, $tab);
    this.$box = $box;
    this.timer = null;
    this.len = $li.length;
  }
  //prototype inhert
  function Fn() { };
  Fn.prototype = Semiauto.prototype;
  Auto.prototype = new Fn();
  //extend
  Auto.prototype.doit = Auto.prototype.exec;
  Auto.prototype.exec = function () {
    this.doit();
    this.autoplay();
    this.clear();
  }
  Auto.prototype.autoplay = function () {
    var This = this;
    this.timer = setInterval(function () {
      This.index++;
      This.index %= This.len;
      This.$tab.eq(This.index).addClass("on").siblings().removeClass("on");
      This.$ul.finish().animate({
        left: -This.width * This.index
      })
    }, 3000)
  }
  Auto.prototype.clear = function () {
    var This = this;
    this.$box.hover(function () {
      clearInterval(This.timer);
    }, function () {
      This.autoplay();
    });
  }
  win.Semiauto = Semiauto;
  win.Auto = Auto;
})(window);
```

##### Commonjs(node)：同步的

> commonJS用同步的方式加载模块,在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。

> 但是在浏览器端，限于网络原因，更合理的方案是使用异步加载，这种方式在加载多个模块时，并没有平行加载。同时，浏览器也并不兼容CommonJS，原因就是浏览器缺少Nodejs的四个变量module、exports，require、global 。

> 要想浏览器支持，那么我们可以使用Browserify，它是目前 CommonJS 格式转换的工具。Browserify的实现原理主要是将所有模块放入一个数组，id 属性是模块的编号，source 属性是模块的源码，deps 属性是模块的依赖。

```js
[
  {
    "id":1,
    "source":"module.exports = function(x) {\n  console.log(x);\n};",
    "deps":{}
  },
  {
    "id":2,
    "source":"var foo = require(\"./foo\");\nfoo(\"Hi\");",
    "deps":{"./foo":1},
    "entry":true
  }
]

//模块定义 model.js

var name = 'old man';

function printName(){
    console.log(name);
}

module.exports = {
    printName: printName
}

// 加载模块

var nameModule = require('./model.js');

nameModule.printName()
```

##### AMD(Asynchronous Module Definition)

> Commonjs 是同步的，在浏览器并不支持，所以AMD应运而生，它支持异步的require。因为AMD并不是javascript原生支持的所以需要我们引入RequireJS这个库。

```js
/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
require(["jquery","underscore"],function($,_){
  // some code here
});

// 引用模块的时候，我们将模块名放在[]中作为reqiure()的第一参数；
// 如果我们定义的模块本身也依赖其他模块,那就需要将它们放在[]中作为define()的第一参数

// 定义math.js模块
define(function () {
    var basicNum = 0;
    var add = function (x, y) {
        return x + y;
    };
    return {
        add: add,
        basicNum :basicNum
    };
});
// 定义一个依赖underscore.js的模块
define(['underscore'],function(_){
  var classify = function(list){
    _.countBy(list,function(num){
      return num > 30 ? 'old' : 'young';
    })
  };
  return {
    classify :classify
  };
})

// 引用模块，将模块放在[]内
require(['jquery', 'math'],function($, math){
  var sum = math.add(10,20);
  $("#sum").html(sum);
});
```

##### CMD(Common Module Definition)

> CMD是另一种随着sea.js发展起来的模块化方案，它与之前介绍的AMD相比不同的是二者执行的依赖的时机不同，而不是加载依赖的时机。

> AMD加载依赖时依赖前置，js可以立刻加载所声明的模块。而CMD则是就近依赖需要把模板解析完一遍才可以知道依赖的事哪些方面，所以性能方面比AMD略差。

```js
/** AMD写法 **/
define(["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
     // 等于在最前面声明并初始化了要用到的所有模块
    a.doSomething();
    if (false) {
        // 即便没用到某个模块 b，但 b 还是提前执行了
        b.doSomething()
    } 
});

/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明
    a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
});

/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});
```

- AMD与CMD区别:

  * AMD推崇依赖前置，提前执行: AMD在加载模块完成后就会执行该模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行。

  * CMD推崇就近依赖，延迟执行: CMD加载完某个依赖模块后并不执行，只是下载而已，在所有依赖模块加载完成后进入主逻辑，遇到require语句的时候才执行对应的模块，这样模块的执行顺序和书写顺序是完全一致的。

##### ES6 import export/export default

> 使用前提：`<script type="module">`，浏览器中ES Module是异步加载，不会堵塞浏览器，即等到整个页面渲染完，再执行模块脚本。如果网页有多个ESM，它们会按照在页面出现的顺序依次执行。

```js
export {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}

export default {
  install,
  DemoComponent,
  AuditSteps,
  Ellipsis,
  SearchForm,
  LxTable,
  SearchSelect,
  AddMembers,
  PopoverForm
}
```

- ES Modules 工作流程：

  * 流程简析: 创建AST -> 生成 Module Record -> 转化 Module Instance

  * 模块加载: 
    - 构造：查找、下载并解析所有文件到模块记录中。
      * 1、根据入口创建依赖关系的AST;
      * 2、下载module文件，用于解析;
      * 3、解析每个module文件，生成 Module Record（包含当前module的AST、变量等）;
      * 4、将Module Record 映射到 Module Map中，保持每个module文件的唯一性;

    - 实例化：在内存中寻找一块区域来存储所有导出的变量（但还没有填充值）。然后让 export 和 import 都指向这些内存块。这个过程叫做链接（linking）

      * 1、生成模每个Module Record的块环境记录(Module Enviroment Record)，用来管理 Module Record 的变量等；
      * 2、在内存中写入每个Module的数据，同时 Module文件的导出export和引用文件的 import指向该地址；

    - 求值：在内存块中填入变量的实际值。

      * 1、执行对应Module文件中顶层作用域的代码，确定实例化阶段中定义变量的值，放入内存中；

