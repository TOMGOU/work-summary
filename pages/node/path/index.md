# path 相关模块

## path.resolve

生成绝对路径：path.resolve(__dirname, '../')

## path.join 

路径拼接

## path.dirname

获取目录名称

## path.basename

获取文件名称（带扩展名）

## path.extname

获取文件扩展名

## path.parse

解析路径：
  - root: 根目录
  - dir: 目录名称
  - base: 文件名称（带扩展名）
  - ext: 扩展名
  - name: 文件名称（不带扩展名）

## path.format

path.parse 的逆向操作

## path.relative

path.relative(from, to) 获取相对路径

## path.normalize

格式化：// -> /

## path.isAbsolute

判断绝对路径
