# cli 相关概念及知识

cli 是⼀种通过命令⾏来交互的⼯具应⽤，全称时 Command Line Interface。⽐较常⻅的就是 createreact-app，vue-cli 等，他们都能够将⼀段 js 脚本，通过封装为可执⾏代码的形式，进⾏⼀些操作。

使⽤ cli 之后呢，能快速的创建⼀些我们业务中的样板⽂件，⽐如快速创建⼀个项⽬内容，配置公共的eslint、webpack 等等配置⼯具。

在封装这些内容之前，我们需要使⽤如下的⼏个库：

* commander：命令⾏中的参数获取
* inquirer：命令⾏的表单
* chalk：命令⾏中的可变颜⾊效果
* clui：命令⾏中的 loading 效果
* figlet：打印大字体框架名
* child_process：node 原⽣模块，提供⼀些⽅法让我们能够执⾏新的命令

child_process 中有⼀些⽅法，⽐如 exec 等， exec ⽅法⽤于新建⼀个⼦进程，然后缓存它的运⾏结果，运⾏结束后调⽤回调函数。
我们这⾥可以使⽤ execSync，它能够执⾏⼀些我们 linux 中的命令。
commander 对命令⾏进⾏了解析，可以让我们⽐较⽅便的进⾏命令⾏参数的获取，读取和解析
chalk 对应的是命令⾏⽂字颜⾊的更改
clui 是⼀个命令⾏中展示 loading 效果的库

```js
#!/usr/bin/env node
const { program } = require('commander')
const inquirer = require('inquirer')
const path = require("path")
const childProcess = require("child_process")
const fuzzy = require('fuzzy');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

const configs = ['babel', 'typescript', 'eslint', 'router'];

program
  .arguments('<dir>')
  .description('this is a directory')
  .action(dir => {
    // console.log('--dir', dir)
    return inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'which framework do u like?',
        choices: [
          'vue',
          'react',
          'uni-app'
        ]
      },
      {
        type: 'checkbox-plus',
        name: 'configs',
        message: 'Enter configs',
        pageSize: 10,
        highlight: true,
        searchable: true,
        default: ['babel', 'router'],
        source: function(answersSoFar, input) {
          input = input || '';
    
          return new Promise(function(resolve) {
    
            var fuzzyResult = fuzzy.filter(input, configs);
    
            var data = fuzzyResult.map(function(element) {
              return element.original;
            });
    
            resolve(data);
            
          });
    
        }
      }
    ]).then(answer => {
      const fullDir = path.resolve(process.cwd(), dir)
      console.log({ fullDir })
      const command = `git clone https://github.com/TOMGOU/${answer.framework}-template.git ${fullDir}`
      console.log({ command })
      childProcess.execSync(command)
    })
  })

// console.log(process.argv)
program.parse(process.argv)
```

注意点：
```js
"bin": {
    "lxs-cli": "./index.js"
  },
```
* `#!/usr/bin/env node` + package.json[bin] -> npm link 本地开发软连接 lxs-cli 命令
* commander.program.arguments( ).description( ).action( ) + commander.program.parse(process.argv)
* inquirer.prompt([{ }, { }]) 收集用户自选参数
* `inquirer-checkbox-plus-prompt` 是 inquirer 的多选插件
* child_process.execSync(command) 子线程执行 git 命令