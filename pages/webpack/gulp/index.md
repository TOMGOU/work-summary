# gulp

### 命令行传参

```
// 命令语句
gulp build --type=mock

// gulp任务中获取参数
const gulp = require('gulp')
const argv = require('yargs').argv
console.log({ argv })
```

### gulp基本用法

```
/**
 * 清除文件
 */

const argv = require('yargs').argv
const fs = require('fs-extra')

// 直接导出
const clean = function(done) {
  const { type } = argv

  // dist
  if (type === 'dist') {
    fs.removeSync('../dist');
  }

  // mock
  if (type === 'mock') {
    fs.removeSync('../dist/mock')
    fs.removeSync('../dist/npm/mockjs')
  }

  done()
}
exports.clean = gulp.series(clean)


// api
gulp.task('clean', function(done) {
  const { type } = argv

  // dist
  if (type === 'dist') {
    fs.removeSync('../dist');
  }

  // mock
  if (type === 'mock') {
    fs.removeSync('../dist/mock')
    fs.removeSync('../dist/npm/mockjs')
  }

  done()
})

```

### gulp常用api

- gulp.src() // glob
- gulp.dest()
- gulp.task('pack', () => {})   <==>   exports.pack = pack
- gulp.watch()   <==>   exports.watch = watch

### 流文件处理

- through2是对node.js原生stream.Transform进行的封装。源码中定义了一个DestroyableTransform。
- 一般gulp的插件都会用through2，这是因为gulp使用了vinyl-fs，而vinyl-fs使用了through2。

```
const gulp = require('gulp');
const through = require('through2');

gulp.src("./src/*.js")
  .pipe(minify())
  .pipe(through.obj(function (chunk, enc, cb) {
    console.log('chunk', chunk)
    cb(null, chunk)
  }))
```

### gulp热更新之watch

```
const gulp = require('gulp');

gulp.task('watch', () => {
  const watcher = gulp.watch("./src/*.js", pack)
  watcher.on('change', function(event) {
    console.log({ event })
  });
})
```

### 任务流程控制

- gulp.series 任务将按顺序执行
- gulp.parallel 任务将并发执行

## gulp.src glob 匹配规则

> gulp 内部使用了 node-glob 模块来实现其文件匹配功能。

> 第一个参数是文件匹配模式，用来匹配文件路径(包括文件名)，直接是某个具体的文件路径，也可以是一个数组。

> 还有一个 options 参数

### pattern 含义

```
* 匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾

** 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。

? 匹配文件路径中的一个字符(不会匹配路径分隔符)

[…] 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法

“{}” 匹配多个属性 例：src/{a,b}.js(包含a.js和b.js文件) src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；

!(pattern|pattern|pattern) 匹配任何与括号中给定的任一模式都不匹配的

?(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?

+(pattern|pattern|pattern) 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+

*(pattern|pattern|pattern) 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*

@(pattern|pattern|pattern) 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)
```

> pattern 示例

```
* 能匹配 a.js,x.y,abc,abc/,但不能匹配a/b.js

*.* 能匹配 a.js,style.css,a.b,x.y

*/*/*.js 能匹配 a/b/c.js,x/y/z.js,不能匹配a/b.js,a/b/c/d.js

** 能匹配 abc,a/b.js,a/b/c.js,x/y/z,x/y/z/a.b,在未尾时能用来匹配所有的目录和文件

**/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js

a/**/z 能匹配 a/z,a/b/z,a/b/c/z,a/d/g/h/j/k/z

a/**b/z 能匹配 a/b/z,a/sb/z,但不能匹配a/x/sb/z,因为只有单**单独出现才能匹配多级目录

?.js 能匹配 a.js,b.js,c.js

a?? 能匹配 a.b,abc,但不能匹配ab/,因为它不会匹配路径分隔符

[xyz].js 只能匹配 x.js,y.js,z.js,不会匹配xy.js,xyz.js等,整个中括号只代表一个字符

[^xyz].js 能匹配 a.js,b.js,c.js等,不能匹配x.js,y.js,z.js
```

### 多种匹配模式时，使用数组

> gulp.src([‘js/*.js’, ‘css/*.css’, ‘*.html’])

> 排除模式

```
gulp.src([*.js, ‘!b*.js’]) // 匹配所有js文件，但排除掉以b开头的js文件

gulp.src([‘!b*.js’, *.js]) // 不会排除任何文件，因为排除模式不能出现在数组的第一个元素中
```

> 展开模式

```
a{b,c}d 会展开为 abd,acd

a{b,}c 会展开为 abc,ac

a{0..3}d 会展开为 a0d,a1d,a2d,a3d

a{b,c{d,e}f}g 会展开为 abg,acdfg,acefg

a{b,c}d{e,f}g 会展开为 abdeg,acdeg,abdeg,abdfg

```

### options参数

> options： 类型(可选)：Object，有3个属性buffer、read、base

```
options.buffer： 类型：Boolean 默认：true 设置为false，将返回file.content的流并且不缓冲文件，处理大文件时非常有用；

options.read： 类型：Boolean 默认：true 设置false，将不执行读取文件操作，返回null；

options.base： 类型：String 设置输出路径以某个路径的某个组成部分为基础向后拼接
```
