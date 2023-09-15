# Hooks

> Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

> Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

> 常用的 hook: useState/useEffect/useContext/useMemo/useReducer/useCallback/useRef/...

## useMemo

> `useMemo` 是 `React` 提供的一个 `Hook`，用于在函数组件中进行记忆化计算。它接收一个依赖数组和一个回调函数，并返回计算结果。

> `useMemo` 的作用是在依赖数组中的值发生变化时，才重新计算结果并返回；如果依赖数组中的值没有变化，则直接返回上一次的计算结果。

> 可以模拟 `vue` 中的 `computed` 计算属性

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

## useRef 

> `useRef` 是 `React` 提供的一个 `Hook`，用于创建一个可持久化的引用。

> 使用 `useRef` 可以在函数组件中创建一个引用，并在组件的多次渲染之间保持引用的稳定性。它返回一个可变的 `ref` 对象，其中的 `.current` 属性可以被赋值为任意值。

```js
import React, { useRef } from 'react';

function ExampleComponent() {
  const inputRef = useRef(null);

  const handleClick = () => {
    // 使用 ref 引用的 DOM 元素或其他值
    console.log(inputRef.current.value);
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Log Input Value</button>
    </div>
  );
}

```

## useEffect

> `useEffect` 是 `React` 提供的一个 `Hook`，用于在函数组件中执行副作用操作，例如订阅事件、请求数据、操作 DOM 等。它可以看作是类组件中的生命周期方法 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的组合。

> `useEffect` 接收两个参数：一个副作用函数和一个依赖数组。副作用函数用于执行实际的副作用操作，依赖数组用于指定该副作用函数的依赖项。

```js
import React, { useEffect } from 'react';

function ExampleComponent() {
  useEffect(() => {
    // 在组件挂载时执行副作用操作
    console.log('Component mounted');

    // 在组件卸载时执行清理操作
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  return <div>Example Component</div>;
}

```

## useCallback

> `useCallback` 是 `React` 的一个 `Hook` 函数，用于在组件中缓存回调函数。它的作用是优化性能，避免不必要的函数重新创建。

```js
import React, { useCallback } from 'react';

const MyComponent = () => {
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []);

  return <button onClick={handleClick}>Click me</button>;
};

```

## useContext

> `useContext` 是 `React` 的一个 `Hook` 函数，用于在函数组件中访问上下文（context）中的值。

```js
import React, { useContext } from 'react';

// 创建一个上下文对象
const MyContext = React.createContext();

const ParentComponent = () => {
  const value = 'Hello, world!';

  return (
    <MyContext.Provider value={value}>
      <ChildComponent />
    </MyContext.Provider>
  );
};

const ChildComponent = () => {
  const value = useContext(MyContext);

  return <div>{value}</div>;
};

```

## useImperativeHandle

> `useImperativeHandle` 是 React 中的一个 Hook，它允许您向父组件暴露子组件的某些功能或方法，通常用于封装和控制子组件的外部行为。这可以帮助您在父组件中直接操作子组件，而不需要通过 `ref` 来访问子组件的 `DOM` 或实例。

> `useImperativeHandle` 的作用是在子组件中定义一个接口，以便向父组件公开特定的方法或属性。这样父组件就可以通过子组件的 `ref` 来访问这些方法或属性。

```js
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

// 子组件
const ChildComponent = forwardRef((props, ref) => {
  const inputRef = useRef();

  // 在子组件中定义要暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current.focus();
    },
    getInputValue: () => {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} />;
});

// 父组件
function ParentComponent() {
  const childRef = useRef(null);

  const handleButtonClick = () => {
    childRef.current.focusInput();
    const inputValue = childRef.current.getInputValue();
    console.log('Input Value:', inputValue);
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleButtonClick}>Focus Input</button>
    </div>
  );
}

export default ParentComponent
```

## useTransition

> `useTransition` 是一个用于处理渲染过程中的状态转换的 `Hook`。它可以让我们在组件更新时添加一个延迟，以便在完成数据加载之前保持用户界面的稳定性。在数据加载完成后，`React` 会将组件更新为最新状态。

> 非常适用于以下场景：

  - 数据加载：在数据加载过程中，我们可以使用 `useTransition` 在更新 `UI` 之前显示一个加载指示器，从而优化用户体验。

  - 动画和过渡效果：在组件状态更新时，`useTransition` 可以让我们更好地控制动画和过渡效果的触发时机。

```js
import { useState, useEffect, useTransition } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [startTransition, isPending] = useTransition();

  useEffect(() => {
    if (query !== '') {
      // 模拟 API 请求
      const fetchData = async () => {
        const response = await fetch(`https://api.example.com/search?q=${query}`);
        const data = await response.json();
        return data;
      };

      startTransition(async () => {
        const data = await fetchData();
        setResults(data);
      });
    } else {
      setResults([]);
    }
  }, [query, startTransition]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## useDeferredValue

> `useDeferredValue` 是一个用于控制组件更新优先级的 `Hook`。它可以让我们将某个值的更新推迟到更合适的时机，从而避免在高优先级任务执行期间进行不必要的渲染。

> 可以应用于以下场景：

  - 用户输入：在处理实时搜索、自动完成等与用户输入相关的功能时，我们可以使用 `useDeferredValue` 来确保输入框在用户输入过程中保持流畅，同时在合适的时机更新相关组件。

  - 列表和大型数据集：当需要处理大量数据时，`useDeferredValue` 可以帮助我们控制渲染的优先级，从而避免阻塞用户界面。例如，在分页加载数据的情况下，我们可以使用 `useDeferredValue` 在高优先级任务完成后再更新数据列表。

```js
import { useState, useEffect, useDeferredValue } from 'react';

function LiveSearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const deferredQuery = useDeferredValue(query, { timeoutMs: 200 });

  useEffect(() => {
    if (deferredQuery !== '') {
      // 模拟 API 请求
      const fetchData = async () => {
        const response = await fetch(`https://api.example.com/search?q=${deferredQuery}`);
        const data = await response.json();
        return data;
      };

      fetchData().then((data) => {
        setResults(data);
      });
    } else {
      setResults([]);
    }
  }, [deferredQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
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