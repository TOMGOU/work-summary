# Hooks

> Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

> Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

> 常用的 hook: useState/useEffect/useContext/useMemo/useReducer/useCallback/useRef/...

## useMemo

> 可以模拟 vue 中的 computed 计算属性

```js
import { useState, useMemo } from 'react'

function Memo () {
  const [firstName, setFirstName] = useState('Kobe')
  const [lastName, setLastName] = useState('Bryant')
  const fullName = useMemo(() => `${firstName}-${lastName}`, [firstName, lastName])

  return (
    <div>
        <p onClick={() => setFirstName('James')}>{firstName}</p>
        <p onClick={() => setLastName('Harden')}>{lastName}</p>
        <p>{fullName}</p>
    </div>
  )
}

export default Memo;
```

## useState 源码

```js
function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending)

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```