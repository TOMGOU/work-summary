# Context

> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

> react-router 和 react-redux 中都运用了 Context, 阅读源码必备。

## context 的基本用法

##### step-1: 使用React的Context API，在组件外部建立一个Context。

```js
import { createContext } from 'react';

const TestContext = createContext({});

export default TestContext;
```

##### step-2: 父组件中使用 Context.Provider 注入数据。

```js
import React, { Component } from 'react'
import TestContext from '../context'
import Sub from '../components/Sub'

export default class Home extends Component {
  render() {
    return (
      <TestContext.Provider value={{
        userName: 'tom'
      }}>
        <Sub />
      </TestContext.Provider>
    )
  }
}
```

##### step-3: 子组件中使用 Context.consumer 使用数据。

```js
import React, { Component } from 'react'
import TestContext from '../context'

export default class Sub extends Component {
  render() {
    return (
      <TestContext.Consumer>
        {info => <div>{info.userName}</div>}
      </TestContext.Consumer>
    )
  }
}
```

## useContext 的基本用法

##### step-1: 使用React的Context API，在组件外部建立一个Context。

```js
import { createContext } from 'react';

const TestContext = createContext({});

export default TestContext;
```

##### step-2: 父组件中使用 Context.Provider 注入数据。

```js
import React, { Component } from 'react'
import TestContext from '../context'
import Sub from '../components/Sub'

export default class Home extends Component {
  render() {
    return (
      <TestContext.Provider value={{
        userName: 'tom'
      }}>
        <Sub />
      </TestContext.Provider>
    )
  }
}
```

##### step-3: 子组件中使用 Context.consumer 使用数据。

```js
import React, { useContext } from 'react'
import TestContext from '../context'

function Sub () {
  const { userName } = useContext(TestContext)
  return <div>{userName}</div>
}

export default Sub
```