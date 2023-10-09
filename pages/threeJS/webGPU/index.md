# webGPU

```js
// 创建canvas并添加到document中
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
// canvas的宽高
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 判断浏览器是否支持webgpu
if (navigator.gpu === undefined) {
  alert("当前浏览器不支持WebGPU");
  throw new Error("当前浏览器不支持WebGPU");
}
// 获取WebGPU的上下文
let context = canvas.getContext("webgpu");

// 创建WebGPU的设备
let adapter = await navigator.gpu.requestAdapter();
// 获取GPU设备,用于分配资源
let device = await adapter.requestDevice();
console.log(navigator.gpu);
console.log(adapter, device);
console.log(adapter.requestAdapterInfo());
// bgra8unorm,rgba8unorm,获取最佳的画布格式，实现最佳的跨平台性能
let format = navigator.gpu.getPreferredCanvasFormat();
console.log(format);
// 配置上下文
context.configure({
  device: device,
  // 获取画布的首选上下文格式
  format: format,
  //   设置不透明，不透明的画布可以提高性能，premultiplied,允许WebGPU在渲染时预乘alpha通道
  alphaMode: "opaque",
});

console.log(context);
// wgsl着色器
let vertWGSL = /*GLSL*/ `
// 顶点着色器主函数
@vertex
fn main(
    @builtin(vertex_index) vertexIndex: u32,
) -> @builtin(position) vec4<f32> {
    // 设置三角形的顶点坐标
    // 如果类型没有指定，默认会根据当前赋值的内容进行推断
    var length = 0.5;
    var pos = array<vec2<f32>, 3>(
        vec2(0.0, length),
        vec2(-0.5, -0.5),
        vec2(0.5, -0.5), 
    );
    // 返回顶点坐标
    return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
}
`;

// 片元着色器
let fragWGSL = /*GLSL*/ `
@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4(1.0, 0.0, 0.0, 1.0);
}
`;

// 创建渲染管线
let pipeline = device.createRenderPipeline({
  // 布局,用于着色器中资源的绑定
  layout: "auto",
  //   顶点着色器
  vertex: {
    module: device.createShaderModule({
      code: vertWGSL,
    }),
    // 入口函数
    entryPoint: "main",
  },
  //   片元着色器
  fragment: {
    module: device.createShaderModule({
      code: fragWGSL,
    }),
    // 入口函数
    entryPoint: "main",
    // 输出颜色
    targets: [
      {
        format: format,
      },
    ],
  },
  // 图元类型
  primitive: {
    topology: "triangle-list",
  },
});

// 渲染函数
function render() {
  // 开始命令编码
  // 开始渲染1个通道或者几个->渲染状态->通过渲染管线绘制图元-》结束渲染通道
  let commandEncoder = device.createCommandEncoder();
  // 开始渲染通道
  let renderPass = commandEncoder.beginRenderPass({
    // 颜色附件数组
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: {
          r: 0.0,
          g: 0.0,
          b: 0.0,
          a: 1.0,
        },
        // 清除操作
        loadOp: "clear",
        // 保存操作
        storeOp: "store",
      },
    ],
  });
  //   设置渲染管线
  renderPass.setPipeline(pipeline);
  //   绘制三角形
  renderPass.draw(3, 1, 0, 0);
  //   结束渲染通道
  renderPass.end();
  // 提交命令
  device.queue.submit([commandEncoder.finish()]);
  // 结束命令编码
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
```