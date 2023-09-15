# React Source Code

## jsx
- React.createElement

```js
/**
 * schedule —> 把我的任务放进一个队列里，然后以某一种节奏进行执行；
 * 
 */

// task 的任务队列
const queue = [];
const threshold = 1000 / 60;

const transtions = [];
let deadline = 0;

// 获取当前时间， bi  date-now 精确
const now = () => performance.now(); // 时间 ，精确
// 从任务queue中，选择第一个 任务 
const peek = arr => arr.length === 0 ? null : arr[0];

// schedule —> 把我的任务放进一个队列里，然后以某一种节奏进行执行；
export function schedule (cb) {
    queue.push(cb);
    startTranstion(flush);
}

// 此时，是否应该交出执行权
function shouldYield() {
    return navigator.scheduling.isInputPending() || now() >= deadline;
}

// 执行权的切换
function startTranstion(cb) {
    transtions.push(cb) && postMessage();
}

// 执行权的切换
const postMessage = (() => {
    const cb = () => transtions.splice(0, 1).forEach(c => c());
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = cb;
    return () => port2.postMessage(null);
})()

// 模拟实现 requestIdleCallback 方法
function flush() {
    // 生成时间，用于判断
    deadline = now() + threshold;
    let task = peek(queue);

    // 我还没有超出 16.666ms 同时，也没有更高的优先级打断我
    while(task && !shouldYield()) {
        const { cb } = task;
        const next = cb();
        // 相当于有一个约定，如果，你这个task 返回的是一个函数，那下一次，就从你这里接着跑
        // 那如果 task 返回的不是函数，说明已经跑完了。不需要再从你这里跑了
        if(next && typeof next === "function") {
            task.cb = next;
        } else {
            queue.shift()
        }
        task = peek(queue);
    }

    // 如果我的这一个时间片，执行完了，到了这里。
    task && startTranstion(flush)
}
```

## requestIdleCallback
- requestIdleCallback(RIC)
- 50毫秒问题
- postMessage: messageChannel event-loop
- setTimeout: 有4到5秒的延迟

## scheduler
- generator：无法从中间位置开始
- web-worker： 无法处理 dom

## useTransition
- startTransition

## Future
- 流式渲染
- server component