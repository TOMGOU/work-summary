# child_process 模块

```js
const { spawn } = require('child_process')

const task1 = () => new Promise((resolve, reject) => {
  const test = spawn('npm', ['run', 'dev'])

  test.stdout.on('data', (data) => {
    console.log(`stdout1: ${data}`);
    if (/finished/.test(data)) {
      console.log('new task2。。。')
      resolve()
    }
  });
})

const task2 = () => new Promise((resolve, reject) => {
  const test = spawn('npm', ['run', 'test'])

  test.stdout.on('data', (data) => {
    console.log(`stdout2: ${data}`);
    if (/圆满完成任务/.test(data)) {
      console.log('new task3。。。')
      resolve()
    }
  });
})

const task3 = () => {
  console.log('撒花')
}

const task = async () => {
  await task1()
  await task2()
  task3()
}
```

## 特殊应用场景

- 多个项目之间的任务组合: cwd 与 lerna 的 --scope 有相同的功能。

```js
const path = require('path')
const { spawn } = require('child_process')

spawn('npm', ['run', `dev:${temp}`], {
  cwd: path.resolve(__dirname, '../packages/wepy-project')
})

lerna run task1 --scope=ucma-frontend--wepy && lerna run task2 --scope=ucma-frontend--taro

```

## 实际应用案例: wepy 与 taro 两个框架项目并存。

```js
const path = require('path')
const { spawn } = require('child_process')
const colors = require('colors')

const temp = process.env.TEMP_TYPE

const wepyBuildPromise = () => new Promise((resolve, reject) => {
  const lixinBuild = spawn('npm', ['run', `dev:${temp}`], {
    cwd: path.resolve(__dirname, '../packages/wepy-project')
  })
  lixinBuild.stdout.on('data', (data) => {
    console.log(`${colors.green('wepy build')}--${data}`)
    if (/开始监听文件改动/.test(data)) {
      resolve()
    }
  })
  lixinBuild.stderr.on('data', (data) => {
    console.log(`${colors.red('wepy build err')}--${data}`)
  })
  lixinBuild.on('exit', () => console.log(`${colors.green('wepy热更新监听程序退出')}`))
})

const taroBuildPromise = () => new Promise(resolve => {
  const taroBuild = spawn('npm', ['run', 'dev'], {
    cwd: path.resolve(__dirname, '../packages/taro-project')
  })

  taroBuild.stdout.on('data', (data) => {
    console.log(`${colors.green('taro build')}--${data}`)
    if (/拷贝结束/.test(data)) {
      resolve()
    }
  })
  taroBuild.stderr.on('data', (data) => {
    console.log(`${colors.red('taro build err')}--${data}`)
  })
  taroBuild.on('exit', () => console.log(`${colors.green('taro热更新监听程序退出')}`))
})

const patchWxApp = () => {
  const patchProcess = spawn('npm', ['run', 'enchance-wxapp'], {
    cwd: path.resolve(__dirname, '../packages/wepy-project')
  })
  patchProcess.stdout.on('data', (data) => {
    console.log(`${colors.green('patch wx app')}--${data}`)
  })
  patchProcess.stderr.on('data', (data) => {
    console.log(`${colors.red('patch wx app err')}--${data}`)
  })
  patchProcess.on('exit', () => console.log(`${colors.green('打补丁完成！')}`))
}

const mainProcess = async () => {
  await wepyBuildPromise()
  await taroBuildPromise()
  // 每次拷贝结束都要执行一次微信小程序的补丁程序，包括taro热更新
  patchWxApp()
}

mainProcess()

```