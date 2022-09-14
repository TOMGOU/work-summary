# WebGL

> `WebGL` 是一组基于 `JavaScript` 语言的图形规范，浏览器厂商按照这组规范进行实现，为 `Web` 开发者提供一套3D图形相关的 `API`。这些 `API` 能够让 `Web` 开发者使用 `JavaScript` 语言直接和显卡（GPU）进行通信。

> `WebGL` 应用由 `JavaScript` 程序和着色器程序构成。

> `WebGL` 的编程开发者需要针对 CPU 和 GPU 进行编程，CPU 部分是 `JavaScript` 程序，GPU 部分是着色器程序。

> `GLSL`——`OpenGL Shading Language`（`OpenGL` 着色语言），用来在 `OpenGL` 编写着色器程序的语言。



## 渲染管线

准备顶点数据 - 顶点着色 - 图元组装 - 光栅化 - 片元着色

- 1.顶点着色器阶段，利用 GPU 的并行计算优势对顶点逐个进行坐标变换。

- 2.图元装配阶段，将顶点按照图元类型组装成图形。

- 3.光栅化阶段，光栅化阶段将图形用不包含颜色信息的像素填充。

- 4.片元着色器阶段，该阶段为像素着色，并最终显示在屏幕上。

## 主流程

```js
// 顶点着色器源码
let vertexstring = `
  attribute vec4 position;
  uniform     mat4    proj;
  void main(void){
      gl_Position = position;
      gl_PointSize=60.0;
  }
`;

// 片元着色器源码
let fragmentstring = `
  void main(void){
    gl_FragColor = vec4(0,0,1.0,1.0);
  }
`;

// step-1: 创建空着色器对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// step-2: 将源码分配给着色器对象
gl.shaderSource(vertexShader, vertexShaderSource);
gl.shaderSource(fragmentShader, fragmentShaderSource);

// step-3: 编译着色器对象
gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

// step-5: 创建着色器程序
const program = gl.createProgram();

// step-6: 将着色器对象挂载到着色器程序
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

// step-7: 链接着色器程序
gl.linkProgram(program);

// step-8: 使用着色器程序
gl.useProgram(program);

// step-9: 为顶点着色器传值

// step-10: 设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// step-11: 用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);

// step-12: 绘制。
gl.drawArrays(gl.POINTS, 0, 1);
gl.drawArrays(gl.TRIANGLE, 0, 3);

```

- step-9: 使用缓冲区对象为顶点着色器传值

```js
// 获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
const aposLocation = gl.getAttribLocation(program, 'position');

// 类型数组构造函数Float32Array创建顶点数组
const data = new Float32Array([
  0.6, 0.2, 0, //顶点1坐标
  0.7, 0.6, 0, //顶点2坐标
  0.8, 0.2, 0, //顶点3坐标
  -0.6, -0.2, 0, //顶点4坐标
  -0.7, -0.6, 0, //顶点5坐标
  -0.8, -0.2, 0, //顶点6坐标
  0.1, 0.2, 0, // 顶点7坐标
  0.2, 0.6, 0, // 顶点8坐标
  0.3, 0.2, 0, // 顶点9坐标
]);

// 创建缓冲区对象
const buffer = gl.createBuffer();

// 绑定缓冲区对象,激活buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

// 顶点数组data数据传入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

// 缓冲区中的数据按照一定的规律传递给位置变量apos
gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);

// 允许数据传递
gl.enableVertexAttribArray(aposLocation);
```

- step-9: 不使用缓冲区对象为顶点着色器传值

```js
// 类型数组构造函数Float32Array创建顶点数组
const pointPosition = new Float32Array([100.0, 100.0, 0.0, 1.0]);

// 获取顶点着色器的位置变量
const aPsotion = webgl.getAttribLocation(webgl.program, 'position');

// 直接将数据传递给位置变量 aPsotion
webgl.vertexAttrib4fv(aPsotion, pointPosition);
```

- 向着色器中传递数据

  * `getAttribLocation`: 找到着色器中的 `attribute` 变量地址

  * `getUniformLocation`: 找到着色器中的 `uniform` 变量地址

  * `vertexAttrib4f`: 给 `attribute` 变量传递四个浮点数

  * `uniform4f`: 给 `uniform` 变量传递四个浮点数

## 是否使用缓冲区的区别(`Geometry` vs `BufferGeometry`)

#### `Geometry` 模型生成流程

- 【代码】-> 【CPU 进行数据处理，转化成虚拟3D数据】 -> 【GPU 进行数据组装，转化成像素点，准备渲染】 -> 显示器

- 第二次修改时，与第一次操作完全相同。

#### `BufferGeometry` 模型生成流程 

- 【代码】 -> 【CPU 进行数据处理，转化成虚拟3D数据】 -> 【GPU 进行数据组装，转化成像素点，准备渲染】 -> 【丢入缓存区】 -> 显示器

- 第二次修改时，可通过API直接修改缓存区数据:【代码】 -> 【CPU 进行数据处理，转化成虚拟3D数据】 -> 【修改缓存区数据】 -> 显示器

#### `Geometry` 转化为 `BufferGeometry`

```js
bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry)
```

